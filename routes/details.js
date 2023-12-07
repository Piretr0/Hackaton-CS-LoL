const express = require("express");
const router = express.Router();
const isadmin = require("../public/javascripts/authorize");

router.get("/", isadmin, (req, res) => {
    res.render("details");
});

module.exports = router;