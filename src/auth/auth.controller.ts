import { Controller, UseGuards, Post, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login() {
    return this.authService.sign();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/status')
  status() {
    return true;
  }
}
