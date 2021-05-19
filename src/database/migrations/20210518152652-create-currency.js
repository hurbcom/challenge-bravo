module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('currencies', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        symbol: {
          allowNull: false,
          type: Sequelize.STRING(4),
          unique: true,
        },
        rate: {
          allowNull: false,
          type: Sequelize.DECIMAL(10, 4),
        },
        default: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
    },
  
    down: async (queryInterface) => {
      await queryInterface.dropTable('currencies');
    },
  };
  