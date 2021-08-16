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
    }
  });

  return Currency;
};
