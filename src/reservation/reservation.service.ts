import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/entity/table4.entity';
import { MenuService } from 'src/menu/menu.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { EXCEPTIONS } from 'src/util/responses';
import { validateDateTime } from 'src/util/valider';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
  ) {}

  async createReservation({
    customerId,
    restaurantId,
    date,
    startTime,
    endTime,
    phone,
    guests,
    menu,
  }: {
    customerId: number;
    restaurantId: number;
    date: string;
    startTime: string;
    endTime: string;
    phone: string;
    guests: number;
    menu: number[];
  }) {
    // 레스토랑 존재 여부 확인
    await this.restaurantService.findRestaurant({
      restaurantId,
    });

    // 해당 레스토랑에 있는 메뉴인지 검증
    await this.validateMenus(menu, restaurantId);

    const menus = await this.menuService.findMenuById({ menu });

    // 시간 검증
    validateDateTime(date, startTime, endTime);

    const overlappingReservations = await this.reservationRepository.find({
      where: {
        restaurant: { id: restaurantId },
        date, // 동일한 날짜
        // startTime이 다른 예약의 종료시간과 겹치거나, endTime이 다른 예약의 시작시간과 겹치는지 체크
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (overlappingReservations.length > 0) {
      throw new BadRequestException(
        '이 예약 시각은 이미 다른 예약과 겹칩니다.',
      );
    }

    await this.reservationRepository.save({
      customer: { id: customerId },
      restaurant: { id: restaurantId },
      date,
      startTime,
      endTime,
      phone,
      guests,
      menus,
    });

    return { message: '예약이 성공적으로 등록 되었습니다.' };
  }

  async validateMenus(menuIds: number[], restaurantId: number) {
    const menuPromises = menuIds.map(async (menuId) => {
      await this.menuService.findMenu({ restaurantId, id: menuId });
    });

    try {
      await Promise.all(menuPromises);
    } catch (error) {
      throw new BadRequestException('하나 이상의 메뉴가 유효하지 않습니다');
    }
  }
}
