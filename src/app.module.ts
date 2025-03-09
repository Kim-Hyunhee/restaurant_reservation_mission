import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Feature1Module } from './feature1/feature1.module';
import { Feature2Module } from './feature2/feature2.module';

@Module({
  imports: [Feature1Module, Feature2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
