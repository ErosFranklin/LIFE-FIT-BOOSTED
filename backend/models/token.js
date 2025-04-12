const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    type: { type: String, required: true },
    user_id_sha: { type: String, required: true },
    type_token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;