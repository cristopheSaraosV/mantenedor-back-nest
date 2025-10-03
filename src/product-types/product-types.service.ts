import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductType } from './entities/product-type.entity/product-type.entity';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';

@Injectable()
export class ProductTypesService {
  constructor(
    @InjectRepository(ProductType)
    private productTypeRepository: Repository<ProductType>,
  ) {}

  async create(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
    const productType = this.productTypeRepository.create(createProductTypeDto);
    return this.productTypeRepository.save(productType);
  }

  async findAll(): Promise<ProductType[]> {
    return this.productTypeRepository.find({
      relations: ['category', 'products'],
      order: { sortOrder: 'ASC', name: 'ASC' }
    });
  }

  async findByCategory(categoryId: number): Promise<ProductType[]> {
    return this.productTypeRepository.find({
      where: { categoryId, isActive: true },
      relations: ['category', 'products'],
      order: { sortOrder: 'ASC', name: 'ASC' }
    });
  }

  async findActive(): Promise<ProductType[]> {
    return this.productTypeRepository.find({
      where: { isActive: true },
      relations: ['category', 'products'],
      order: { sortOrder: 'ASC', name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<ProductType> {
    const productType = await this.productTypeRepository.findOne({
      where: { id },
      relations: ['category', 'products']
    });
    if (!productType) {
      throw new NotFoundException(`Tipo de producto con ID ${id} no encontrado`);
    }
    return productType;
  }

  async update(id: number, updateProductTypeDto: UpdateProductTypeDto): Promise<ProductType> {
    const productType = await this.findOne(id);
    Object.assign(productType, updateProductTypeDto);
    return this.productTypeRepository.save(productType);
  }

  async remove(id: number): Promise<void> {
    const productType = await this.findOne(id);
    await this.productTypeRepository.remove(productType);
  }
}
