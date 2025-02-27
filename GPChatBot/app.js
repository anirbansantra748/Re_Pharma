const express = require("express");
const path = require("path");

const port = 3000;
const app = express();

// ✅ Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure correct views directory

// Route to render chatbot UI
app.get("/chatbot", (req, res) => {
    res.render("chatbot");
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
