// 해당 도메인의 DTO 관리
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MenuCategory } from 'src/entity/table3.entity';
import { Type } from 'class-transformer';

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
  @IsEnum(MenuCategory)
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

export class GetMenuDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '메뉴 이름',
    example: '맛있는 메뉴',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: '최소 가격',
    example: '20000',
    required: false,
  })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: '최대 가격',
    example: '1000000',
    required: false,
  })
  maxPrice?: number;
}
