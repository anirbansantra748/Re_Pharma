require("dotenv").config();
const axios = require("axios");
console.log("Loaded API Key:", process.env.GEMINI_API_KEY);

const GEMINI_API_KEY = "AIzaSyBeXpxnjQ9QwXMqk3U4LxVjbJreNYJVj_s"; // Ensure you have this in your .env file
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

module.exports.summarizeBlog = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: "No blog content provided" });

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: `Summarize this: ${content}` }] }]
        }, {
            headers: { "Content-Type": "application/json" }
        });

        const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available";

        res.render('pages/summary',{summary,error:false})
    } catch (error) {
        console.error("Summarization error:", error.response?.data || error.message);
        res.status(500).json({ error: "Error summarizing blog" });
    }
};


//
module.exports.renderChat = async (req,res)=>{
    res.render('pages/chat.ejs')
}

module.exports.chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ parts: [{ text: message }] }]
        }, {
            headers: { "Content-Type": "application/json" }
        });

        const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "AI request failed" });
    }
};
