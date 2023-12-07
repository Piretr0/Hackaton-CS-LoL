'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class register extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  register.init({
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    active: DataTypes.INTEGER,
    edit: DataTypes.INTEGER,
    add: DataTypes.INTEGER,
    delete: DataTypes.INTEGER,
    power: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'register',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return register;
};