module.exports=(sequelize,DataTypes)=>
{
const grupy=sequelize.define("grupy",
{
    nazwaZespolu:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    },
    nazwaSzkoly:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    },
    stopienSzkoly:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    },
    active:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    },
    gra_CS:{
        type:DataTypes.INTEGER,
        allowNull:true,
        validate:{
            notEmpty:true
        }
    },
    gra_LOL:{
        type:DataTypes.INTEGER,
        allowNull:true,
        validate:{
            notEmpty:true
        }
    },
}, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  })

grupy.associate = models => {
    grupy.hasMany(models.user, {
        onDelete:"cascade"
    });
}


return grupy
}