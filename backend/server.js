const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

// Load env
dotenv.config();

// Init
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('The server is running.');
});

app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});