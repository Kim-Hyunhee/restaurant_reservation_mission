// 각종 유틸리티 함수 관련 공유 코드 (ex. 검증 로직)
import * as bcrypt from 'bcrypt';

/**
 * 비밀번호 확인 함수
 * @param {string} plainPassword 평문 비밀번호
 * @param {string} hashedPassword 해시된 비밀번호
 * @returns {Promise<boolean>} 비밀번호가 일치하면 true, 아니면 false
 */
export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
