"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "registers",
      [
        {
          login: "admin",
          password: await bcrypt.hash("admin", 10),
          // password: await bcrypt.hash("niko123", 10),
          active: 1,
          edit:1,
          add: 1,
          delete: 1,
          power: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
