require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/models/mongo/mongo.js'); 
const userRoutes = require('./backend/routes/user_routes'); 
const authRoutes = require('./backend/routes/auth_routes.js');

const app = express();

connectDB();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
