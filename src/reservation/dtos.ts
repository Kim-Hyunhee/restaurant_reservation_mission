// 해당 도메인의 DTO 관리
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '레스토랑 Id',
    example: 1,
  })
  restaurantId: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: '예약 날짜',
    example: 'YYYY-MM-DD',
  })
  date: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: '예약 시작 시간은 HH:mm 포맷으로 입력해야 합니다.',
  })
  @ApiProperty({
    description: '예약 시작 시간',
    example: 'HH:mm',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: '예약 끝 시간은 HH:mm 포맷으로 입력해야 합니다.',
  })
  @ApiProperty({
    description: '예약 끝 시간',
    example: 'HH:mm',
  })
  endTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^010-\d{4}-\d{4}$/, {
    message: '휴대폰 번호의 포맷은 010-xxxx-xxxx 입니다.',
  })
  @ApiProperty({
    description: '예약자 휴대폰 번호',
    example: '010-7777-7777',
  })
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: '예약 인원',
    example: 5,
  })
  guests: number;

  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    description: '메뉴',
    example: [1, 2, 3],
  })
  menu: number[];
}

export class FetchReservationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '예약자 휴대폰 번호',
    example: '010-7777-7777',
    required: false,
  })
  phone: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: '예약 날짜',
    example: 'YYYY-MM-DD',
    required: false,
  })
  date: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: '최소 인원',
    example: 3,
    required: false,
  })
  minGuest: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    description: '메뉴',
    example: 1,
    required: false,
  })
  menu: number;
}
