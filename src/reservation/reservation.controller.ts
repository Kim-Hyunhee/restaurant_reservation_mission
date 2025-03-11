import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReservationService } from './reservation.service';
import { CreateReservationDto, FetchReservationDto } from './dtos';
import { CreateReservationForm, FetchReservationForm } from './forms';

@Controller('reservation')
@ApiTags('reservation')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard)
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  async postReservation(@Body() data: CreateReservationDto, @Request() req) {
    const customerId = req.user.sub;
    const {
      restaurantId,
      date,
      startTime,
      endTime,
      phone,
      guests,
      menu,
    }: CreateReservationForm = data;

    return await this.reservationService.createReservation({
      customerId,
      restaurantId,
      date,
      startTime,
      endTime,
      phone,
      guests,
      menu,
    });
  }

  @Get()
  async getManyReservation(
    @Query() query: FetchReservationDto,
    @Request() req,
  ) {
    const customerId = req.user.role === 'customer' ? req.user.sub : undefined;
    const restaurantId =
      req.user.role === 'restaurant' ? req.user.sub : undefined;

    const { phone, date, minGuest, menu }: FetchReservationForm = query;

    return await this.reservationService.fetchManyReservation({
      customerId,
      phone,
      date,
      minGuest,
      menu,
      restaurantId,
    });
  }
}
