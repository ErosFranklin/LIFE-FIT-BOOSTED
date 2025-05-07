require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/models/mongo/mongo.js'); 
const userRoutes = require('./backend/routes/user_routes'); 
const authRoutes = require('./backend/routes/auth_routes.js');
const trainingRoutes = require('./backend/routes/training_routes.js');

const app = express();

connectDB();
const allowedOrigins = [
  'https://life-fit-boosted.vercel.app',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', trainingRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
