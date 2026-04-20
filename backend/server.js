const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const taskRoutes = require('./routes/tasks');
const suggestionRoutes = require('./routes/suggestions');

// Init
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

// Middleware setup
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/suggestions', suggestionRoutes);

app.get('/', (req, res) => {
  res.send('The server is running.');
});

app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});