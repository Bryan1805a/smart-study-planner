const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load env
dotenv.config();

// Init
const app = express();

// Backend runs on port 5000
const PORT = process.env.PORT || 5000;

// Setting up Middleware
app.use(cors());
app.use(express.json());

// Response in root URL
app.get("/", (req, res) => {
    res.send("Server is running.");
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});