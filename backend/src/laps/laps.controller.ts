import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LapsService } from './laps.service';

@Controller('laps')
export class LapsController {
  constructor(private readonly lapsService: LapsService) {}

  @Post()
  create(@Body() createLapDto: any) {
    return this.lapsService.create(createLapDto);
  }

  @Get()
  findAll() {
    return this.lapsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lapsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLapDto: any) {
    return this.lapsService.update(+id, updateLapDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lapsService.remove(+id);
  }
}
