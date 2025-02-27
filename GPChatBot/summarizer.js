// dependencies
// npm install express axios dotenv
// HUGGINGFACE_API_KEY=your_huggingface_api_key_here
// HUGGINGFACE_API_KEY it is in the .gitignore file

// Load environment variables from the .env file
require("dotenv").config();

const express = require("express"); // Web framework for creating the API
const axios = require("axios"); // HTTP client for making API requests
const bodyParser = require("body-parser"); // Middleware to parse JSON requests

const app = express(); // Create an Express application
const PORT = 3000; // Define the port where the server will run

// Hugging Face API details
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/";
const CHATBOT_MODEL = "facebook/blenderbot-3B"; // Model for an empathetic chatbot
const HEADERS = {
    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // API Key from .env file
    "Content-Type": "application/json",
};

// Middleware to parse JSON data from requests
app.use(bodyParser.json());

/**
 * Function to add personality and emotions to the chatbot's response.
 * It checks for frequent phrases and provides predefined friendly responses.
 */
function personalizeResponse(userMessage, botResponse) {
    const lowerMessage = userMessage.toLowerCase(); // Convert user message to lowercase

    // Common phrases and their custom responses
    const responses = {
        hello: "🤖 Hello there! How can I assist you today? 😊",
        "how are you": "😊 I'm just a bot, but I'm feeling great! Thanks for asking. How about you?",
        thanks: "🙌 You're welcome! I'm always here to help. 😊",
        "thank you": "🙌 You're welcome! I'm always here to help. 😊",
        "tell me a joke": "😂 Why don’t robots ever get tired? Because they recharge! 🔋😆",
        "what is your name": "🤖 You can call me Emora! I'm here to chat and assist you with anything.",
    };

    // Check if user message contains any predefined phrases
    for (let key in responses) {
        if (lowerMessage.includes(key)) return responses[key];
    }

    // If no predefined response, return the original bot response or fallback
    return botResponse || "🤔 I'm not sure how to respond to that, but I'm always learning!";
}

/**
 * API Endpoint: /chat
 * Handles user messages, sends them to Hugging Face chatbot, and returns a response.
 */
app.post("/chat", async (req, res) => {
    try {
        let userMessage = req.body.message; // Extract user message from request

        // If no message is provided, return an error
        if (!userMessage) return res.status(400).json({ error: "No message provided" });

        // Structure the conversation to help the AI understand better
        userMessage = `User: ${userMessage} \nAssistant:`;

        // Prepare payload for Hugging Face API request
        const payload = { inputs: userMessage };

        // Send request to Hugging Face chatbot model
        const response = await axios.post(`${HUGGINGFACE_API_URL}${CHATBOT_MODEL}`, payload, { headers: HEADERS });

        let botResponse = response.data.generated_text; // Extract response from API
        botResponse = personalizeResponse(userMessage, botResponse); // Customize response with emotions

        // Send the chatbot's response back to the frontend
        res.json({ response: botResponse });
    } catch (error) {
        console.error("Chatbot Error:", error.message); // Log any errors
        res.status(500).json({ error: "Error communicating with chatbot" }); // Send error response
    }
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`🤖 Chatbot server is running on http://localhost:${PORT}`);
});
