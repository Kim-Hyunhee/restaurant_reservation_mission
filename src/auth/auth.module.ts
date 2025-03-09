import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Restaurant } from 'src/entity/table1.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Customer } from 'src/entity/table2.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Customer]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
