import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, MenuCategory } from 'src/entity/table3.entity';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { EXCEPTIONS, RESPONSES, SUCCESS } from 'src/util/responses';
import {
  In,
  Repository,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private restaurantService: RestaurantService,
  ) {}

  /** 레스토랑 ID 검증 */
  private async validateRestaurant({ restaurantId }: { restaurantId: number }) {
    await this.restaurantService.findRestaurant({ restaurantId });
  }

  /** 메뉴 생성 */
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
    await this.validateRestaurant({ restaurantId });

    await this.menuRepository.save({
      restaurant: { id: restaurantId },
      name,
      price,
      category,
      description,
    });

    return SUCCESS.menuCreated;
  }

  /** 특정 메뉴 조회 */
  async findMenu({ restaurantId, id }: { restaurantId: number; id: number }) {
    const menu = await this.menuRepository.findOne({
      where: { id, restaurant: { id: restaurantId } },
    });

    if (!menu) {
      throw EXCEPTIONS.entityNotFound('Menu');
    }

    return menu;
  }

  /** 여러 개의 메뉴 조회 (필터링 포함) */
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
    await this.validateRestaurant({ restaurantId });

    const whereConditions: any = { restaurant: { id: restaurantId } };

    // 메뉴 이름이 있을 경우
    if (name) whereConditions.name = Like(`%${name}%`);
    // 최소 가격이 있을 경우
    if (minPrice) whereConditions.price = MoreThanOrEqual(minPrice);
    // 최대 가격이 있을 경우
    if (maxPrice) whereConditions.price = LessThanOrEqual(maxPrice);

    return this.menuRepository.find({ where: whereConditions });
  }

  /** 메뉴 삭제 */
  async removeMenu({ restaurantId, id }: { restaurantId: number; id: number }) {
    await this.findMenu({ restaurantId, id });
    await this.menuRepository.delete({ id });

    return SUCCESS.menuDeleted;
  }

  /** 여러 개의 메뉴 ID로 조회 */
  async findMenuById({ menu }: { menu: number[] }) {
    return this.menuRepository.find({ where: { id: In(menu) } });
  }
}
