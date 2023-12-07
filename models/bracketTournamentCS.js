module.exports=(sequelize,DataTypes)=>
{
const bracketTournamentCS=sequelize.define("bracketTournamentCS",
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

bracketTournamentCS.associate = models => {
    bracketTournamentCS.belongsTo(models.grupy, {
        as: 'team_a',
        foreignKey: 'team_a_id',
       
    });
    bracketTournamentCS.belongsTo(models.grupy, {
        as: 'team_b',
        foreignKey: 'team_b_id',
      
    });
    bracketTournamentCS.belongsTo(models.grupy, {
        foreignKey: {
            name: 'winner_id',
            allowNull: true
        }
    });
}



return bracketTournamentCS
}