const express = require("express");
const router = express.Router();
const demoController = require("../controllers/demoController");

router.get("/demo", demoController.getTestMessage);

module.exports = router;
