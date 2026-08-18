import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(
    dto: CreateOrderDto,
    userId: number,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const item of dto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product #${item.productId} not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}": ` +
              `available ${product.stock}, requested ${item.quantity}`,
          );
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        const orderItem = queryRunner.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          price: product.price,
        });

        orderItems.push(orderItem);
        totalPrice += Number(product.price) * item.quantity;
      }

      const order = queryRunner.manager.create(Order, {
        user: { id: userId } as User,
        items: orderItems,
        totalPrice,
        status: OrderStatus.PENDING,
      });

      const savedOrder = await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      await this.clearProductsCache();

      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    query: OrderQueryDto,
    userId: number,
    userRole: Role,
  ) {
    const {
      page = 1,
      pageSize = 10,
      status,
    } = query;

    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoin('order.user', 'user')
      .addSelect([
        'user.id',
        'user.email',
        'user.name',
        'user.role',
        'user.createdAt',
      ]);

    if (userRole !== Role.ADMIN) {
      queryBuilder.andWhere('order.userId = :userId', {
        userId,
      });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', {
        status,
      });
    }

    queryBuilder.orderBy('order.createdAt', 'DESC');

    const skip = (page - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    const [items, total] =
      await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(
    id: number,
    userId: number,
    userRole: Role,
  ): Promise<Order> {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoin('order.user', 'user')
      .addSelect([
        'user.id',
        'user.email',
        'user.name',
        'user.role',
        'user.createdAt',
      ])
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      throw new NotFoundException(
        `Order #${id} not found`,
      );
    }

    if (
      userRole !== Role.ADMIN &&
      order.user.id !== userId
    ) {
      throw new ForbiddenException(
        'You can only view your own orders',
      );
    }

    return order;
  }

  async updateStatus(
    id: number,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id },
         relations: ['items', 'items.product'],
      });

      if (!order) {
        throw new NotFoundException(
          `Order #${id} not found`,
        );
      }

      const allowedTransitions: Record<
        OrderStatus,
        OrderStatus[]
      > = {
        [OrderStatus.PENDING]: [
          OrderStatus.CONFIRMED,
          OrderStatus.CANCELLED,
        ],
        [OrderStatus.CONFIRMED]: [
          OrderStatus.SHIPPED,
          OrderStatus.CANCELLED,
        ],
        [OrderStatus.SHIPPED]: [
          OrderStatus.DELIVERED,
        ],
        [OrderStatus.DELIVERED]: [],
        [OrderStatus.CANCELLED]: [],
      };

      if (
        !allowedTransitions[order.status].includes(dto.status)
      ) {
        throw new BadRequestException(
          `Status transition from "${order.status}" ` +
            `to "${dto.status}" is not allowed`,
        );
      }

      if (dto.status === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          const product =
            await queryRunner.manager.findOne(Product, {
              where: { id: item.product.id },
            });

          if (product) {
            product.stock += item.quantity;
            await queryRunner.manager.save(product);
          }
        }
      }

      order.status = dto.status;
      const savedOrder =
        await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      if (dto.status === OrderStatus.CANCELLED) {
        await this.clearProductsCache();
      }

      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const order = await this.ordersRepository.findOneBy({
      id,
    });

    if (!order) {
      throw new NotFoundException(
        `Order #${id} not found`,
      );
    }

    await this.ordersRepository.remove(order);
  }

  private async clearProductsCache(): Promise<void> {
    const keys: string[] =
      await this.cacheManager.store.keys('products:*');

    if (keys.length > 0) {
      await Promise.all(
        keys.map((key) => this.cacheManager.del(key)),
      );
    }
  }
}