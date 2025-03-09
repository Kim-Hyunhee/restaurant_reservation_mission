import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { verifyJwtToken } from 'src/util/utilFunction';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('인증 토큰이 필요합니다.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyJwtToken(
      this.jwtService,
      this.configService,
      token,
    );

    if (!decoded) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    request['user'] = decoded; // 검증된 사용자 정보 저장
    return true;
  }
}
