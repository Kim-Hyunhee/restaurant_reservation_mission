import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/entity/table1.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 가게 로그인
  async restautantLogin({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    // 가입된 계정인지 확인
    const restaurant = await this.restaurantRepository.findOne({
      where: { username },
    });
    if (!restaurant) {
      throw new NotFoundException('가입되지 않은 계정입니다.');
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    const payload = { sub: restaurant.id, username: restaurant.username };
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');

    return {
      access_token: await this.jwtService.signAsync(payload, { secret }),
    };
  }
}
