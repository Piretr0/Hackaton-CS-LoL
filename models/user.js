
module.exports=(sequelize,DataTypes)=>
{
const user=sequelize.define("user",
{
    imie:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    nazwisko:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    index:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    active:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    rezerwa:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    opiekun:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
}, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  })

user.associate = models => {
    user.belongsTo(models.grupy, {
        foreignKey: {
            allowNull: true
        }
    });
}
return user
}

