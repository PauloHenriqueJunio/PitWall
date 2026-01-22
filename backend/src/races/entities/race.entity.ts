import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lap } from '../../laps/entities/lap.entity';

@Entity()
export class Race {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  round: number;

  @Column()
  date: string;

  @Column()
  year: number;

  @OneToMany(() => Lap, (lap) => lap.race)
  laps: Lap[];
}
