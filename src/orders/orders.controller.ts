import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Створити замовлення',
  })
  @ApiResponse({
    status: 201,
    description: 'Замовлення успішно створено',
  })
  @ApiResponse({
    status: 400,
    description: 'Помилка валідації або недостатньо товару',
  })
  @ApiResponse({
    status: 401,
    description: 'Користувач не авторизований',
  })
  @ApiResponse({
    status: 404,
    description: 'Продукт не знайдено',
  })
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.ordersService.create(dto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Мої замовлення (user) / Всі замовлення (admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список замовлень отримано',
  })
  @ApiResponse({
    status: 401,
    description: 'Користувач не авторизований',
  })
  findAll(
    @Query() query: OrderQueryDto,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.findAll(
      query,
      userId,
      role,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Отримати одне замовлення',
  })
  @ApiResponse({
    status: 200,
    description: 'Замовлення знайдено',
  })
  @ApiResponse({
    status: 403,
    description: 'Заборонено переглядати чуже замовлення',
  })
  @ApiResponse({
    status: 404,
    description: 'Замовлення не знайдено',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.findOne(
      id,
      userId,
      role,
    );
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Змінити статус замовлення',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус замовлення змінено',
  })
  @ApiResponse({
    status: 400,
    description: 'Перехід між статусами заборонений',
  })
  @ApiResponse({
    status: 403,
    description: 'Доступ дозволено тільки адміністратору',
  })
  @ApiResponse({
    status: 404,
    description: 'Замовлення не знайдено',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Видалити замовлення',
  })
  @ApiResponse({
    status: 200,
    description: 'Замовлення видалено',
  })
  @ApiResponse({
    status: 403,
    description: 'Доступ дозволено тільки адміністратору',
  })
  @ApiResponse({
    status: 404,
    description: 'Замовлення не знайдено',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.remove(id);
  }
}