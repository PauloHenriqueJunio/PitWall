import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Lap } from '../../laps/entities/lap.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  team: string;

  @Column()
  number: number;

  @Column({ nullable: true })
  country: string;

  @OneToMany(() => Lap, (lap) => lap.driver)
  laps: Lap[];
}
