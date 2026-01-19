import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Race } from './entities/race.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class RacesService {
  constructor(
    @InjectRepository(Race)
    private raceRepository: Repository<Race>,
  ) {}

  async create(createRaceDto: any) {
    const newRace = this.raceRepository.create(createRaceDto);
    return await this.raceRepository.save(newRace);
  }

  async findAll() {
    return await this.raceRepository.find({ order: { round: 'ASC' } });
  }

  findOne(id: number) {
    return `This actions returns a #${id} race`;
  }

  update(id: number, updateRaceDto: any) {
    return `This actions updates a #${id} race`;
  }

  remove(id: number) {
    return `This actions removes a #${id} race`;
  }
}
