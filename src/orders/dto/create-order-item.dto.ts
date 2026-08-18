import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID продукту',
  })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Кількість одиниць продукту',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}