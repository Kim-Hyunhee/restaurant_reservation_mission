import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dtos';
import { CreateReservationForm } from './forms';

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
}
