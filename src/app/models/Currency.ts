import { Table, Column, Model, AllowNull, Length } from 'sequelize-typescript';

export interface ICurrency {
  symbol: string,
  name: string
}

@Table({ tableName: 'currencies', paranoid: true, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at' })
export default class Currency extends Model<Currency> {
  @AllowNull(false)
  @Column
  symbol!: string;

  @AllowNull(false)
  @Column
  name!: string;
}