'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('registers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      active: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      add: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      delete: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      edit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      power: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('registers');
  }
};