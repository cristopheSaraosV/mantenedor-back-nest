import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateProductTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  specifications?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsNumber()
  categoryId: number;
}
