require("dotenv").config({ path: "key.env" });
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // ✅ Enable CORS

const API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large";
const HEADERS = {
    "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    "Content-Type": "application/json"
};

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) return res.status(400).json({ error: "No message provided" });

        const payload = { inputs: userMessage };
        const response = await axios.post(API_URL, payload, { headers: HEADERS });

        res.json({ response: response.data.generated_text || "I'm here to chat! 😊" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Error communicating with chatbot" });
    }
});

app.listen(5000, () => {
    console.log("✅ Chatbot server is running on port 5000...");
});
