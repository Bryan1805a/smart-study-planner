const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env
dotenv.config();

// Init
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('The server is running.');
});

app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});