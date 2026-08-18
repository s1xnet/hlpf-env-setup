import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const { categoryId, ...productData } = dto;
    const product = this.productsRepository.create(productData);

    if (categoryId !== undefined) {
      product.category = await this.getCategory(categoryId);
    }

    const saved = await this.productsRepository.save(product);
    await this.clearProductsCache();
    return saved;
  }

  async findAll(query: ProductQueryDto) {
    const cacheKey = `products:${JSON.stringify(query)}`;

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const {
      page = 1,
      pageSize = 10,
      sort = 'createdAt',
      order = 'desc',
      categoryId,
      minPrice,
      maxPrice,
      search,
    } = query;

    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (search) {
      qb.andWhere('product.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    qb.orderBy(
      `product.${sort}`,
      order.toUpperCase() as 'ASC' | 'DESC',
    );

    const skip = (page - 1) * pageSize;
    qb.skip(skip).take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    const result = {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    await this.cacheManager.set(cacheKey, result, 60_000);

    return result;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} was not found`);
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, ...productData } = dto;

    Object.assign(product, productData);

    if (categoryId !== undefined) {
      product.category = await this.getCategory(categoryId);
    }

    const saved = await this.productsRepository.save(product);
    await this.clearProductsCache();
    return saved;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    await this.clearProductsCache();
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

  private async getCategory(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} was not found`);
    }

    return category;
  }
}