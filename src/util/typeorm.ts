// 설정 파일 코드 (ex. typeorm)
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Restaurant } from 'src/entity/table1.entity';
import { Customer } from 'src/entity/table2.entity';
import { Menu } from 'src/entity/table3.entity';
import { Reservation } from 'src/entity/table4.entity';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [Restaurant, Customer, Menu, Reservation],
  synchronize: true,
});
