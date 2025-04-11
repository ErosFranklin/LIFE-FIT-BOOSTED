require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/models/mongo/mongo.js'); 
const app = express();

connectDB();
app.use(cors()); 
app.use(express.json());
