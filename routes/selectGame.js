const express = require("express");
const router = express.Router();

const game = null
router.get("/", (req, res) => {
  res.render("selectGame");
});

router.get("/", (req, res) => {
  res.render("selectGame");
});


module.exports = router;
