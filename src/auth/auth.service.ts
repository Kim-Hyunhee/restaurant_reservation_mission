import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/entity/table1.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Customer } from 'src/entity/table2.entity';
import { generateJwtToken } from '../util/utilFunction';
import { comparePasswords } from '../util/valider';
import { EXCEPTIONS, RESPONSE_MESSAGES } from 'src/util/responses';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 가게 로그인
  async restaurantLogin({
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
      throw EXCEPTIONS.entityNotFound('Restaurant');
    }

    // 비밀번호 확인
    const isMatch = await comparePasswords(password, restaurant.password);
    if (!isMatch) {
      throw EXCEPTIONS.unauthorized;
    }
    const payload = { sub: restaurant.id, username: restaurant.username };

    return {
      access_token: await generateJwtToken(
        this.jwtService,
        this.configService,
        payload,
      ),
      message: RESPONSE_MESSAGES.loginSuccess,
    };
  }

  // 고객 로그인
  async customerLogin({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    // 가입된 계정인지 확인
    const customer = await this.customerRepository.findOne({
      where: { username },
    });
    if (!customer) {
      throw EXCEPTIONS.entityNotFound('Customer');
    }

    // 비밀번호 확인
    const isMatch = await comparePasswords(password, customer.password);
    if (!isMatch) {
      throw EXCEPTIONS.unauthorized;
    }
    const payload = { sub: customer.id, username: customer.username };

    return {
      access_token: await generateJwtToken(
        this.jwtService,
        this.configService,
        payload,
      ),
      message: RESPONSE_MESSAGES.loginSuccess,
    };
  }
}
