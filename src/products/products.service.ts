import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['productType', 'productType.category'],
      order: { sortOrder: 'ASC', model: 'ASC' }
    });
  }

  async findActive(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['productType', 'productType.category'],
      order: { sortOrder: 'ASC', model: 'ASC' }
    });
  }

  async findByProductType(productTypeId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { productTypeId, isActive: true },
      relations: ['productType', 'productType.category'],
      order: { sortOrder: 'ASC', model: 'ASC' }
    });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productType', 'productType')
      .leftJoinAndSelect('productType.category', 'category')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .orderBy('product.sortOrder', 'ASC')
      .addOrderBy('product.model', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['productType', 'productType.category']
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateStock(id: number, stock: number): Promise<Product> {
    if (stock < 0) {
      throw new BadRequestException('El stock no puede ser negativo');
    }
    
    const product = await this.findOne(id);
    product.stock = stock;
    return this.productRepository.save(product);
  }
}
