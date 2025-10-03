import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { ProductType } from '../../../product-types/entities/product-type.entity/product-type.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  technicalSpecs: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column()
  productTypeId: number;

  @ManyToOne(() => ProductType, productType => productType.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productTypeId' })
  productType: ProductType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
