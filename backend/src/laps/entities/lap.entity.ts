import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Driver } from '../../driver/entities/driver.entity';
import { Race } from '../../races/entities/race.entity';

@Entity()
export class Lap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lap_number: number;

  @Column()
  position: number;

  @Column({ nullable: true })
  session_type: string;

  @Column()
  time: string;

  @Column({ type: 'float', nullable: true })
  sector_1: number;

  @Column({ type: 'float', nullable: true })
  sector_2: number;

  @Column({ type: 'float', nullable: true })
  sector_3: number;

  @ManyToOne(() => Driver, (driver) => driver.laps, { onDelete: 'CASCADE' })
  driver: Driver;

  @ManyToOne(() => Race, (race) => race.laps, { onDelete: 'CASCADE' })
  race: Race;
}
