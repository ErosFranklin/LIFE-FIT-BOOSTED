require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/models/mongo/mongo.js'); 
const userRoutes = require('./backend/routes/user_routes'); 

const app = express();

connectDB();
app.use(cors()); 
app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
