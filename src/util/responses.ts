// 각족 유틸리티 함수 관련 공유 코드(ex. 공통 응답)

import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// util/responses.ts

export const RESPONSE_MESSAGES = {
  passwordIncorrect: '비밀번호가 틀렸습니다.',
  accountNotFound: '가입되지 않은 계정입니다.',
  loginSuccess: '로그인 성공',
  serverError: '서버 오류가 발생했습니다.',
  validationError: '유효하지 않은 데이터입니다.',
  unauthorized: '인증되지 않았습니다.',
  entityNotFound: (entity: string) => `${entity}을(를) 찾을 수 없습니다.`,
  forbidden: '접근이 금지되었습니다.',
};

export const EXCEPTIONS = {
  unauthorized: new UnauthorizedException(RESPONSE_MESSAGES.unauthorized),
  entityNotFound: (entity: string) =>
    new NotFoundException(RESPONSE_MESSAGES.entityNotFound(entity)),
  forbidden: new ForbiddenException('접근이 금지되었습니다.'),
  // 날짜가 유효하지 않을 경우 던질 예외
  invalidDate: (message: string) => {
    const error = new Error(message);
    error.name = 'InvalidDateException'; // 예외 이름
    return error;
  },
  // 시간 검증 실패 시 던질 예외
  invalidTime: (message: string) => {
    const error = new Error(message);
    error.name = 'InvalidTimeException'; // 예외 이름
    return error;
  },
};
