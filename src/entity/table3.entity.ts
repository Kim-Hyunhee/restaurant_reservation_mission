import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './table1.entity';

export enum MenuCategory {
  KOREAN = '한식',
  JAPANESE = '일식',
  CHINESE = '중식',
  WESTERN = '양식',
}

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // 메뉴 이름

  @Column()
  price: number; // 가격

  @Column({ type: 'enum', enum: MenuCategory })
  category: MenuCategory; // 카테고리

  @Column({ nullable: true })
  description: string; // 메뉴 설명

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  restaurant: Restaurant;
}
