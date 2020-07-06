import { Table, Column, Model, AllowNull, Unique, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

export interface ICurrency {
  id?: number,
  symbol: string,
  name: string
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date
}

@Table({ tableName: 'currencies', paranoid: true, timestamps: true, createdAt: false, updatedAt: false })
export default class Currency extends Model<Currency> {
  @AllowNull(false)
  @Unique
  @Column
  symbol!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt!: Date;

}