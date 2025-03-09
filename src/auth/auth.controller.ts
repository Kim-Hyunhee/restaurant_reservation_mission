import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/restaurant/login')
  async restaurantLogin(@Body() data: LoginDto) {
    return await this.authService.restautantLogin(data);
  }
}
