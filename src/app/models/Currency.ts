import { Table, Column, Model, AllowNull, Unique } from 'sequelize-typescript';

export interface ICurrency {
  id?: number,
  symbol: string,
  name: string
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date
}

@Table({ tableName: 'currencies', paranoid: true, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' })
export default class Currency extends Model<Currency> {
  @AllowNull(false)
  @Unique
  @Column
  symbol!: string;

  @AllowNull(false)
  @Column
  name!: string;
}