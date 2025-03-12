import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReservationService } from './reservation.service';
import {
  CreateReservationDto,
  FetchReservationDto,
  ModifyReservationDto,
} from './dtos';
import {
  CreateReservationForm,
  FetchReservationForm,
  ModifyReservationForm,
} from './forms';
import { validateRole } from 'src/util/valider';

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

    // role이 customer인 경우만 허용
    validateRole(req.user.role, 'customer');

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

  @Put(':id')
  async putReservation(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() query: ModifyReservationDto,
  ) {
    const customerId = req.user.sub;
    const { guests, menu }: ModifyReservationForm = query;

    // role이 customer인 경우만 허용
    validateRole(req.user.role, 'customer');

    return await this.reservationService.modifyReservation({
      id,
      customerId,
      guests,
      menu,
    });
  }

  @Delete(':id')
  async deleteReservation(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const customerId = req.user.sub;

    // role이 customer인 경우만 허용
    validateRole(req.user.role, 'customer');

    return await this.reservationService.removeReservation({
      id,
      customerId,
    });
  }
}
