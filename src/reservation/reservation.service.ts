import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entity/table3.entity';
import { Reservation } from 'src/entity/table4.entity';
import { MenuService } from 'src/menu/menu.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { EXCEPTIONS, RESPONSES, SUCCESS } from 'src/util/responses';
import { validateDateTime } from 'src/util/valider';
import {
  FindOptionsWhere,
  LessThan,
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

  /** 예약 생성 */
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
    await this.restaurantService.findRestaurant({ restaurantId });

    // 메뉴 유효성 검증
    await this.validateMenus({ menuIds: menu, restaurantId });
    const menus = await this.menuService.findMenuById({ menu });

    // 날짜 및 시간 검증
    validateDateTime(date, startTime, endTime);

    // 기존 예약과 중복 여부 확인
    const overlappingReservations = await this.reservationRepository.find({
      where: {
        restaurant: { id: restaurantId },
        date,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (overlappingReservations.length > 0) {
      throw EXCEPTIONS.reservationOverlap;
    }

    // 예약 저장
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

    return SUCCESS.reservationCreated;
  }

  /** 메뉴 유효성 검증 */
  private async validateMenus({
    menuIds,
    restaurantId,
  }: {
    menuIds: number[];
    restaurantId: number;
  }) {
    try {
      await Promise.all(
        menuIds.map((menuId) =>
          this.menuService.findMenu({ restaurantId, id: menuId }),
        ),
      );
    } catch (error) {
      throw EXCEPTIONS.invalidMenu;
    }
  }

  /** 예약 조회 (필터 조건 적용) */
  async fetchManyReservation({
    customerId,
    phone,
    date,
    minGuest,
    menu,
    restaurantId,
  }: {
    customerId?: number;
    phone?: string;
    date?: string;
    minGuest?: number;
    menu?: number;
    restaurantId?: number;
  }) {
    const whereCondition: FindOptionsWhere<Reservation> = {};

    if (customerId) whereCondition.customer = { id: customerId };
    if (restaurantId) whereCondition.restaurant = { id: restaurantId };
    if (phone) whereCondition.phone = `%${phone}%`;
    if (date) whereCondition.date = date;
    if (minGuest) whereCondition.guests = MoreThanOrEqual(minGuest);
    if (menu) whereCondition.menus = { id: menu };

    return await this.reservationRepository.find({
      where: whereCondition,
      relations: ['restaurant', 'menus', 'customer'],
    });
  }

  /** 예약 수정 */
  async modifyReservation({
    id,
    customerId,
    guests,
    menu,
  }: {
    id: number;
    customerId: number;
    guests?: number;
    menu?: number[];
  }) {
    const reservation = await this.findReservation({ id, customerId });

    if (menu) {
      await this.validateMenus({
        menuIds: menu,
        restaurantId: reservation.restaurant.id,
      });
      reservation.menus = await this.menuService.findMenuById({ menu });
    }

    reservation.guests = guests ?? reservation.guests;
    await this.reservationRepository.save(reservation);

    return SUCCESS.reservationUpdated;
  }

  /** 예약 단건 조회 (없으면 예외 발생) */
  private async findReservation({
    id,
    customerId,
  }: {
    id: number;
    customerId: number;
  }) {
    const reservation = await this.reservationRepository.findOne({
      where: { id, customer: { id: customerId } },
      relations: ['restaurant', 'menus', 'customer'],
    });
    if (!reservation) {
      throw EXCEPTIONS.entityNotFound('Reservation');
    }

    return reservation;
  }

  /** 예약 취소 (삭제) */
  async removeReservation({
    id,
    customerId,
  }: {
    id: number;
    customerId: number;
  }) {
    await this.findReservation({ id, customerId });
    await this.reservationRepository.delete({ id });

    return SUCCESS.reservationCancelled;
  }
}
