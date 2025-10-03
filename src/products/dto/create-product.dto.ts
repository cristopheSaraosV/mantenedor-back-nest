import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => value ? +value : null)
  @IsNumber()
  @Min(0)
  price?: number;

  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  technicalSpecs?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => value ? +value : 0)
  @IsNumber()
  sortOrder?: number;

  @Transform(({ value }) => +value)
  @IsNumber()
  productTypeId: number;
}
