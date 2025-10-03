import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
constructor(private auth: AuthService, private users: UsersService) {}


  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.auth.login(req.user);
  }
}
