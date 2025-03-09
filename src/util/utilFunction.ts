// 각종 유틸리티 함수 관련 공유 코드
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT 토큰 생성 함수
 * @param {JwtService} jwtService JwtService 인스턴스
 * @param {object} payload JWT의 payload
 * @returns {Promise<string>} 생성된 JWT 토큰
 */
export async function generateJwtToken(
  jwtService: JwtService,
  configService: ConfigService,
  payload: object,
): Promise<string> {
  const secret = configService.get<string>('JWT_ACCESS_SECRET');

  return jwtService.signAsync(payload, { secret });
}
