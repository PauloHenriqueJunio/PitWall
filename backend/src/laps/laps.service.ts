import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lap } from './entities/lap.entity';

@Injectable()
export class LapsService {
  constructor(
    @InjectRepository(Lap)
    private lapRepository: Repository<Lap>,
  ) {}

  async create(createLapDto: any) {
    const newLap = this.lapRepository.create(createLapDto);
    return await this.lapRepository.save(newLap);
  }

  async findAll() {
    return await this.lapRepository.find({
      relations: ['driver'],
    });
  }

  async findOne(id: number) {
    return await this.lapRepository.findOne({ where: { id } }); // ← Busca real no BD
  }

  async update(id: number, updateLapDto: any) {
    await this.lapRepository.update(id, updateLapDto);
    return this.findOne(id); // Retorna o registro atualizado
  }

  async remove(id: number) {
    await this.lapRepository.delete(id);
    return { deleted: true };
  }
}
