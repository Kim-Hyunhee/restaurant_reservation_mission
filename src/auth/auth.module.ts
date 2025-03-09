import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Restaurant } from 'src/entity/table1.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
