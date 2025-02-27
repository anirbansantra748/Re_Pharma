const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Route for blog summarization
router.post("/:id/summarize", aiController.summarizeBlog);

router.post('/chat',aiController.chatWithAI)
// Route for AI chatbot
router.get("/chat", aiController.renderChat);


module.exports = router;
