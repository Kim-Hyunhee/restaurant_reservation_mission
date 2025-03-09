import { MenuCategory } from 'src/entity/table3.entity';
// 해당 도메인의 사용자 입력 스키마 관리

export class MenuForm {
  name: string;
  price: number;
  category: MenuCategory;
  description: string;
}
