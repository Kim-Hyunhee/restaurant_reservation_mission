import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/entity/table1.entity';
import { EXCEPTIONS } from 'src/util/responses';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async findRestaurant({ restaurantId }: { restaurantId: number }) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw EXCEPTIONS.entityNotFound('Restaurant');
    }

    return restaurant;
  }
}
