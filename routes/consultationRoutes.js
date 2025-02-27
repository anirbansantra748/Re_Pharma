const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultationController");
const { isLoggedIn } = require("../middleware/isLoggedIn");

router.post("/request/:id", isLoggedIn, consultationController.requestConsultation);
router.post("/schedule/:id", isLoggedIn, consultationController.scheduleConsultation);


module.exports = router;
