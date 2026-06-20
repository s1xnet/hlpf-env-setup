export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  isActive?: boolean;
  categoryId?: number;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
  categoryId?: number;
}