import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu, MenuCategory } from 'src/entity/table3.entity';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Repository } from 'typeorm';

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

    return await this.menuRepository.save({
      restaurantId,
      name,
      price,
      category,
      description,
    });
  }
}
