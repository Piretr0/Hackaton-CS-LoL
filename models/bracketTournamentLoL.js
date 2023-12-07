module.exports=(sequelize,DataTypes)=>
{
const bracketTournamentLoL=sequelize.define("bracketTournamentLoL",
{
    team_a_score:{
        type:DataTypes.INTEGER,
        allowNull:true,
        validate:{
            notEmpty:true
        }
    },
    team_b_score:{
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

bracketTournamentLoL.associate = models => {
    bracketTournamentLoL.belongsTo(models.grupy, {
        as: 'team_a',
        foreignKey: 'team_a_id',
       
    });
    bracketTournamentLoL.belongsTo(models.grupy, {
        as: 'team_b',
        foreignKey: 'team_b_id',
      
    });
    bracketTournamentLoL.belongsTo(models.grupy, {
        foreignKey: {
            name: 'winner_id',
            allowNull: true
        }
    });
}



return bracketTournamentLoL
}