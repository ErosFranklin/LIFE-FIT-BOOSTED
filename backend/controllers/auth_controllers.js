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
            training_split: user.training_split,
            has_training_split: !!user.training_split,
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

// trocar senha (usuário autenticado)
exports.changePassword = async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Senha atual incorreta.' });
      }
  
      user.password = newPassword; 
      await user.save();
  
      res.status(200).json({ message: 'Senha alterada com sucesso.' });
    } catch (err) {
      console.error('Erro ao trocar senha:', err.message);
      res.status(500).json({ error: 'Erro ao trocar a senha.', details: err.message });
    }
  };

module.exports = { loginController, getUserData };