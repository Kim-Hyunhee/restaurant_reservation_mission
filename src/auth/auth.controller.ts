import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { LoginForm } from './forms';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('restaurant/login')
  async restaurantLogin(@Body() data: LoginDto) {
    const { username, password }: LoginForm = data;

    return await this.authService.restaurantLogin({ username, password });
  }

  @Post('customer/login')
  async customerLogin(@Body() data: LoginDto) {
    const { username, password }: LoginForm = data;

    return await this.authService.customerLogin({ username, password });
  }
}
