import { Module } from '@nestjs/common';
import { Feature1Controller } from './feature1.controller';
import { Feature1Service } from './feature1.service';

@Module({
  controllers: [Feature1Controller],
  providers: [Feature1Service]
})
export class Feature1Module {}
