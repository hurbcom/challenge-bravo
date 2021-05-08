module.exports =(sequelize,DataTypes) =>{
    const Currency = sequelize.define("Currency",{
        name:DataTypes.STRING,
        code:DataTypes.STRING,
        icon:DataTypes.STRING,
        value:DataTypes.FLOAT,
        fictional:DataTypes.BOOLEAN,
    })
    return Currency
}