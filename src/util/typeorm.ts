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
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [Restaurant, Customer, Menu, Reservation],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false, // 자가 서명 인증서 우회
  },
});
