import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Restaurant } from './entity/table1.entity';
import { Customer } from './entity/table2.entity';
import { Menu } from './entity/table3.entity';
import { Reservation } from './entity/table4.entity';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [Restaurant, Customer, Menu, Reservation],
  synchronize: true,
});
