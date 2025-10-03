import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto, role: 'user' | 'admin' = 'user') {
    const exists = await this.repo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new BadRequestException('Email ya registrado');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({ email: dto.email, name: dto.name, passwordHash, role });
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string, withPassword = false) {
    return this.repo.findOne({
      where: { email: email.toLowerCase() },
      select: withPassword ? ['id', 'email', 'name', 'passwordHash', 'role', 'isActive', 'createdAt', 'updatedAt'] : undefined,
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (dto.email) user.email = dto.email.toLowerCase();
    if (dto.name) user.name = dto.name;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 10);
    if (typeof dto.isActive === 'boolean') user.isActive = dto.isActive;
    return this.repo.save(user);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
