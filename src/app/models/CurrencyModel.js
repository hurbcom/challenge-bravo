import { Model, DataTypes } from 'sequelize';

class Currency extends Model {
    static init(sequelize) {
        super.init(
            {
                name: DataTypes.STRING,
                initials: DataTypes.STRING,
                value: DataTypes.DECIMAL(10, 2),
                dateCreation: {
                    type: DataTypes.DATE,
                    field: 'date_creation',
                    defaultValue: DataTypes.NOW
                }
            },
            {
                sequelize,
                tableName: 'currency',
                timestamps: false
            }
        );

        return this;
    }
}

export default Currency;
