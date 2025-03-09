import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from './table4.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string; // 로그인 ID

  @Column()
  password: string; // 비밀번호 (해싱하여 저장)

  @OneToMany(() => Reservation, (reservation) => reservation.customer)
  reservations: Reservation[];
}
