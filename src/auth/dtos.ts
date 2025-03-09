// 해당 도메인의 DTO 관리
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '회원 ID',
    example: 'restaurant1',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '비밀번호',
    example: 'test123!',
  })
  password: string;
}
