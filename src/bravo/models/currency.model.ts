import { Column, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Currency extends Model<Currency> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}