const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('../models/token.js')
const User = require('../models/user.js');   
const logger = require('../utils/logger.js');

const loginController = async (data) => {
   
    const { email, password } = data;

    try {
        
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Usuário com credencial ${email} não encontrado.`);
            return { error: 'Usuário não existe', statusCode: 401 };
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn(`Senha inválida para o usuário com credencial ${email}.`);
            return { error: 'Senha inválida', statusCode: 401 };
        }

        const tokenPayload = {
            id: user._id,
            email: user.email,
            name: user.name,
            type: "access", 
        };
        
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        const newToken = new Token({
            email: user.email,
            type: "access",
            user_id_sha: user._id,
            type_token: "access"
        });

        await newToken.save();

        logger.info(`Sucesso no login para usuário com credencial ${email}.`);
        return { message: 'Sucesso no Login', token, user, statusCode: 200 };
    } catch (err) {
        logger.error(`Error in loginController: ${err.message}`);
        return { error: 'Internal server error', statusCode: 500 };
    }
};
const getUserData = async (user) => {
    try {
        const userData = await User.findById(user.id).select('-password'); 
        if (!userData) {
            logger.warn(`Usuário não encontrado ao buscar seus dados.`);
            return { error: 'Usuário não encontrado' }; 
        }

        logger.info(`Usuário encontrado ao buscar seus dados.`);
        return { user: userData }; 
    } catch (error) {
        throw new Error('Erro ao buscar dados do usuário'); 
    }
};

module.exports = { loginController, getUserData };