module.exports = (sequelize, Sequelize) => {
  const Currency = sequelize.define("currency", {
    code: { 
      type: Sequelize.STRING, 
      allowNull: false,
      unique: {
          args: 'code',
          msg: 'Currency already registered'
      }
    },
    usd_value: { 
      type: Sequelize.FLOAT,
      allowNull: false
    },
    updated_at: { type: Sequelize.DATE },
    created_at: { type: Sequelize.DATE },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Currency;
};
