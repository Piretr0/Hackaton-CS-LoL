const express = require("express");
const router = express.Router();
const isLogged = require("../public/javascripts/isLogged");

router.get("/", isLogged, (req, res) => {
    res.render("login");
});

module.exports = router;