import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { User } from './users/entities/user.entity/user.entity';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        url: cfg.get<string>('DATABASE_URL'),
        ssl: cfg.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        autoLoadEntities: true,
        synchronize: cfg.get('DB_SYNC') === 'true', // SOLO dev
      }),
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    ProductTypesModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const name = this.config.get<string>('ADMIN_NAME') || 'Admin';
    const password = this.config.get<string>('ADMIN_PASSWORD');

    if (!email || !password) {
      console.warn('⚠️ Variables de admin no definidas en .env');
      return;
    }

    const exists = await this.usersService.findByEmail(email);
    if (!exists) {
      await this.usersService.create({ email, name, password }, 'admin');
      console.log(`✅ Usuario admin creado: ${email} / ${password}`);
    } else {
      console.log(`ℹ️ Admin ${email} ya existe, no se creó otro`);
    }
  }
}
