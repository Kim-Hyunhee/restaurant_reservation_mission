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

/**
 * JWT 토큰 검증 함수
 * @param {JwtService} jwtService - JwtService 인스턴스
 * @param {ConfigService} configService - ConfigService 인스턴스
 * @param {string} token - 검증할 JWT 토큰
 * @returns {Promise<any>} 검증된 사용자 정보 (유효하지 않으면 null)
 */
export async function verifyJwtToken(
  jwtService: JwtService,
  configService: ConfigService,
  token: string,
): Promise<any> {
  const secret = configService.get<string>('JWT_ACCESS_SECRET');

  try {
    return jwtService.verifyAsync(token, { secret });
  } catch (error) {
    return null; // 검증 실패 시 null 반환
  }
}
