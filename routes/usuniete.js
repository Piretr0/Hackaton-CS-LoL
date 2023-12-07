const express = require("express");
const router = express.Router();
const { user } = require("../models");
const { grupy } = require("../models");
const isadmin = require("../public/javascripts/authorize");

router.get("/", isadmin, async (req, res) => {
  const grupies = await grupy
    .findAll(
      {
        where: {
          active: 0,
        },
      },
      {
        include: user,
      }
    )
    .then((grupies) => {
      res.render("usuniete", {
        grupies,
      });
    });
});

module.exports = router;
