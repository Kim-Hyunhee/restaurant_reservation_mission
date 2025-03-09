import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Menu } from './table3.entity';
import { Reservation } from './table4.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string; // 로그인 ID

  @Column()
  password: string; // 비밀번호 (해싱하여 저장)

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menus: Menu[];

  @OneToMany(() => Reservation, (reservation) => reservation.restaurant)
  reservations: Reservation[];
}
