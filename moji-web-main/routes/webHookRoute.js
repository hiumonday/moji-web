const express = require("express");
const passport = require("passport");
const webHookController = require("../controllers/webHookController");
const { isAuthenticatedUser, authorizedRole } = require("../middlewares/auth");

const router = express.Router();

router.post("/webhook-event-handler", webHookController.webhook);

module.exports = router;
