import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Currency extends Model<Currency> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    currency: string;

    @Column({
        type: DataType.DECIMAL
    })
    rate: number;
}