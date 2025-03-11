export class CreateReservationForm {
  restaurantId: number;
  date: string;
  startTime: string;
  endTime: string;
  phone: string;
  guests: number;
  menu: number[];
}

export class FetchReservationForm {
  phone?: string;
  date?: string;
  minGuest?: number;
  menu?: number;
}
