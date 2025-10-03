import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 👈 NECESARIO
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // 👈 si Auth también lo usa
})
export class UsersModule {}
