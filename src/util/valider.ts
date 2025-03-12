// 각종 유틸리티 함수 관련 공유 코드 (ex. 검증 로직)
import * as bcrypt from 'bcrypt';
import { EXCEPTIONS } from './responses';
import { UnauthorizedException } from '@nestjs/common';

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

/**
 * 주어진 날짜, 시작 시간, 종료 시간을 검증하는 함수
 * - 날짜는 오늘 이후여야 하고
 * - 시작 시간은 종료 시간보다 앞서야 함
 *
 * @param date - 예약 날짜 (YYYY-MM-DD 형식)
 * @param startTime - 시작 시간 (HH:mm 형식)
 * @param endTime - 종료 시간 (HH:mm 형식)
 * @returns void
 * @throws 예외를 던짐
 */

export function validateDateTime(
  date: string,
  startTime: string,
  endTime: string,
): void {
  const today = new Date();
  const reservationDate = new Date(date);

  // 예약 날짜가 오늘보다 이전이면 예외 처리
  if (reservationDate.getTime() < today.setHours(0, 0, 0, 0)) {
    throw EXCEPTIONS.invalidDate('예약 날짜는 오늘 이후여야 합니다.');
  }

  // 유효하지 않은 날짜 형식 처리
  if (isNaN(reservationDate.getTime())) {
    throw EXCEPTIONS.invalidDate('유효하지 않은 날짜 형식입니다.');
  }

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // 시작 시간이 종료 시간보다 늦으면 예외 처리
  if (
    startHour > endHour ||
    (startHour === endHour && startMinute >= endMinute)
  ) {
    throw EXCEPTIONS.invalidTime(
      '시작 시간은 종료 시간보다 이전이어야 합니다.',
    );
  }
}

/**
 * 권한이 있는지 검증하는 함수
 *
 * @param role - 사용자의 role
 * @param allowedRole - 권한이 있는 role
 * @returns void
 * @throws 예외를 던짐
 */

export const validateRole = (role: string, allowedRole: string) => {
  if (role !== allowedRole) {
    throw new UnauthorizedException(
      `권한이 없습니다. (${allowedRole}만 접근 가능합니다.)`,
    );
  }

  return true;
};
