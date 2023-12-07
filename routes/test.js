const express = require("express");
const router = express.Router();
const { toDoList } = require("../models");
const { grupy } = require("../models");

router.get("/", async (req, res) => {
  const Lista = await grupy.findAll({where: {
    active: 1,
  },}).then((Lista) => {
    res.render("test", {
      Lista,
    });
  });
});


module.exports = router;
