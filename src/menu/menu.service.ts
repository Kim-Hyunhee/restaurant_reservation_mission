import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, MenuCategory } from 'src/entity/table3.entity';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private restaurantService: RestaurantService,
  ) {}

  async createMenu({
    restaurantId,
    name,
    price,
    category,
    description,
  }: {
    restaurantId: number;
    name: string;
    price: number;
    category: MenuCategory;
    description: string;
  }) {
    await this.restaurantService.findRestaurant({
      restaurantId,
    });

    await this.menuRepository.save({
      restaurantId,
      name,
      price,
      category,
      description,
    });

    return { message: '메뉴가 성공적으로 등록 되었습니다.' };
  }

  async findManyMenu({
    restaurantId,
    name,
    minPrice,
    maxPrice,
  }: {
    restaurantId: number;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    // restaurantId가 유효한지 확인
    await this.restaurantService.findRestaurant({
      restaurantId,
    });

    // where 조건 생성
    const whereConditions: any = { restaurant: { id: restaurantId } };

    if (name) {
      // 이름에 대해 부분 일치 검색
      whereConditions.name = Like(`%${name}%`);
    }

    if (minPrice) {
      // 최소 가격이 있을 경우
      whereConditions.price = MoreThanOrEqual(minPrice);
    }

    if (maxPrice) {
      // 최대 가격이 있을 경우
      whereConditions.price = LessThanOrEqual(maxPrice);
    }

    // 메뉴 조회
    return await this.menuRepository.find({
      where: whereConditions,
    });
  }
}
