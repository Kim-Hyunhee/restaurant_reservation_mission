import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entity/table3.entity';
import { Reservation } from 'src/entity/table4.entity';
import { MenuService } from 'src/menu/menu.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { EXCEPTIONS } from 'src/util/responses';
import { validateDateTime } from 'src/util/valider';
import {
  FindOptionsWhere,
  LessThan,
  LessThanOrEqual,
  Like,
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

  private async validateMenus(menuIds: number[], restaurantId: number) {
    const menuPromises = menuIds.map(async (menuId) => {
      await this.menuService.findMenu({ restaurantId, id: menuId });
    });

    try {
      await Promise.all(menuPromises);
    } catch (error) {
      throw new BadRequestException('하나 이상의 메뉴가 유효하지 않습니다');
    }
  }

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

    // 전화번호 일부 검색 (LIKE 사용)
    if (phone) {
      whereCondition.phone = Like(`%${phone}%`);
    }

    // 예약 날짜 검색
    if (date) {
      whereCondition.date = date;
    }

    // 최소 인원수 검색
    if (minGuest) {
      whereCondition.guests = MoreThanOrEqual(minGuest);
    }

    // 특정 메뉴가 포함된 예약 검색
    if (menu) {
      whereCondition.menus = { id: menu };
    }

    let query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.menus', 'menu')
      .leftJoinAndSelect('reservation.restaurant', 'restaurant')
      .leftJoinAndSelect('reservation.customer', 'customer')
      .where(whereCondition);

    if (menu) {
      query = query.andWhere('menu.id = :menuId', { menuId: menu });
    }

    const reservations = await query
      .select([
        'reservation.id',
        'reservation.date',
        'reservation.startTime',
        'reservation.endTime',
        'reservation.guests',
        'restaurant.id',
        'customer.id',
        'menu.id',
        'menu.name',
        'menu.category',
        'menu.description',
      ])
      .getMany();

    return reservations;
  }

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
    // 예약 조회 (없으면 예외 발생)
    const reservation = await this.fetchReservation({ id, customerId });

    let menusToUpdate: Menu[] | undefined;

    // 새로운 메뉴가 있을 경우 업데이트할 메뉴 가져오기
    if (menu) {
      await this.validateMenus(menu, reservation.restaurant.id);
      menusToUpdate = await this.menuService.findMenuById({ menu });
    }

    // 기존 예약 정보 업데이트
    reservation.guests = guests ?? reservation.guests;
    if (menusToUpdate) {
      reservation.menus = menusToUpdate;
    }

    // `save()` 사용하여 업데이트 반영 (ManyToMany 관계도 자동 처리됨)
    await this.reservationRepository.save(reservation);

    return { message: '예약이 성공적으로 수정되었습니다.' };
  }

  private async fetchReservation({
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
      throw new NotFoundException('예약 내역이 존재하지 않습니다.');
    }

    return reservation;
  }
}
