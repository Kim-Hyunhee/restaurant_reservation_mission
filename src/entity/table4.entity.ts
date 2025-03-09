import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './table1.entity';
import { Customer } from './table2.entity';
import { Menu } from './table3.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.reservations)
  customer: Customer;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations)
  restaurant: Restaurant;

  @Column()
  date: string; // YYYY-MM-DD 형식

  @Column()
  startTime: string; // HH:mm 형식

  @Column()
  endTime: string; // HH:mm 형식

  @Column()
  phone: string; // 예약자 전화번호

  @Column()
  guests: number; // 예약 인원 수

  @ManyToMany(() => Menu)
  @JoinTable()
  menus: Menu[];
}
