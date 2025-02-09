const express = require("express");
const consultationController = require("../controllers/consultationController");
const router = express.Router();

router.post("/consultation", consultationController.createConsultation);

module.exports = router;
