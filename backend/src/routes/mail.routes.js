const { sendOverdateEmail } = require("../controllers/mail.controller");
const { Router } = require("express");
const router = new Router();

router.post("/", sendOverdateEmail);

module.exports = router;
