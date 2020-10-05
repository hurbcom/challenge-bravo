import { Entity, PrimaryColumn, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Unique(['currency'])
@Entity()
export class Currencies {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  currency: string;

  @Column()
  value: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}