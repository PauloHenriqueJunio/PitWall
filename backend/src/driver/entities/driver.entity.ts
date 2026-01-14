import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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
}
