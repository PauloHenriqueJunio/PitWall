import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LapsService } from './laps.service';
import { LapsController } from './laps.controller';
import { Lap } from './entities/lap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lap])],
  controllers: [LapsController],
  providers: [LapsService],
})
export class LapsModule {}
