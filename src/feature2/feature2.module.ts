import { Module } from '@nestjs/common';
import { Feature2Controller } from './feature2.controller';
import { Feature2Service } from './feature2.service';

@Module({
  controllers: [Feature2Controller],
  providers: [Feature2Service]
})
export class Feature2Module {}
