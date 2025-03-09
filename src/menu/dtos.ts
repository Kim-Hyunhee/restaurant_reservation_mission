// 해당 도메인의 DTO 관리
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MenuCategory } from 'src/entity/table3.entity';

export class MenuDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '메뉴 이름',
    example: '맛있는 메뉴',
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: '가격',
    example: '20000',
  })
  price: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '메뉴 카테고리',
    enum: ['한식', '중식', '일식', '양식'],
  })
  category: MenuCategory;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '메뉴 설명',
    example: '이 메뉴는 정말 맛있습니다.',
    required: false,
  })
  description: string;
}
