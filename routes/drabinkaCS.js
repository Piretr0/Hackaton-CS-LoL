const express = require("express");
const router = express.Router();
const { grupy } = require("../models");
const { user } = require("../models");
const { bracketTournamentCS } = require("../models");

router.get("/", async (req, res) => {
  
  try {
    const Lista = await bracketTournamentCS.findAll({
      include: [  {
        model: grupy,
        as: 'team_a',
        include: user,
      },
      {
        model: grupy,
        as: 'team_b',
        include: user,
      },]
  })

  const Lista_grup = await grupy.findAll({where: { active: 1 , gra_CS: 1}})


    // console.log(JSON.stringify(Lista, null, 2));
    res.render("drabinkaCS", {
      Lista, Lista_grup
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});




module.exports = router;
