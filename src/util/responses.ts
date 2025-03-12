// 각족 유틸리티 함수 관련 공유 코드(ex. 공통 응답)
import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

// 공통 응답 메시지
export const RESPONSES = {
  success: {
    reservationCreated: '예약이 성공적으로 생성되었습니다.',
    reservationUpdated: '예약이 성공적으로 수정되었습니다.',
    reservationCancelled: '예약이 성공적으로 취소되었습니다.',
    loginSuccess: '로그인 되었습니다.',
    menuCreated: '메뉴가 성공적으로 생성되었습니다.',
    menuDeleted: '메뉴가 성공적으로 삭제되었습니다.',
  },
};

// 성공 응답 형식
export const SUCCESS = {
  reservationCreated: {
    statusCode: HttpStatus.CREATED,
    message: RESPONSES.success.reservationCreated,
  },
  reservationUpdated: {
    statusCode: HttpStatus.OK,
    message: RESPONSES.success.reservationUpdated,
  },
  reservationCancelled: {
    statusCode: HttpStatus.OK,
    message: RESPONSES.success.reservationCancelled,
  },
  login: {
    statusCode: HttpStatus.CREATED,
    message: RESPONSES.success.loginSuccess,
  },
  menuCreated: {
    statusCode: HttpStatus.CREATED,
    message: RESPONSES.success.menuCreated,
  },
  menuDeleted: {
    statusCode: HttpStatus.OK,
    message: RESPONSES.success.menuDeleted,
  },
};

// 예외 객체
export const EXCEPTIONS = {
  unauthorized: new UnauthorizedException('인증되지 않았습니다.'),
  forbidden: new ForbiddenException('접근이 금지되었습니다.'),
  entityNotFound: (entity: string) =>
    new NotFoundException(`${entity}을(를) 찾을 수 없습니다.`),
  reservationOverlap: new BadRequestException(
    '해당 시간대에 예약이 이미 존재합니다.',
  ),
  invalidMenu: new BadRequestException('유효하지 않은 메뉴입니다.'),
  invalidDate: (message: string) => new BadRequestException(message),
  invalidTime: (message: string) => new BadRequestException(message),
};
