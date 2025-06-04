const mongoose = require('mongoose');
const User = require('../models/user.js');
const logger = require('../utils/logger.js');
const moment = require('moment');
const bcrypt = require('bcryptjs');

exports.createUserController = async (data) => {
    const { name, email, password, birthday_day, number, weight, height } = data;

    const birth = moment(birthday_day, 'DD/MM/YYYY');

    if (!birth.isValid()) {
        return { error: 'Data de nascimento inválida', statusCode: 400 };
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'Email já está em uso', statusCode: 400 }; // Retornando como objeto
        }
        
        const newUser = new User({
            name,
            email,
            password,
            birthday_day: birth.toDate(),
            number, 
            weight, 
            height
        });

        await newUser.save();

        logger.info(`Usuário de nome ${newUser.name} e email ${newUser.email} criado com sucesso!`);
        return { message: 'Usuário criado com sucesso', user: newUser, statusCode: 201 }; 
    } catch (err) {
        logger.error(`Erro ao criar usuário: ${err.message}`);
        return { error: 'Erro interno do servidor', statusCode: 500 };
    }
};

// Buscar usuário autenticado por ID
exports.getAuthenticatedUser = async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    if (!req.user || req.user.id.toString() !== userId) {
        logger.warn(`Acesso negado: usuário não autenticado ou ID inválido.`);
        return res.status(403).json({ message: 'Acesso negado: Usuário não autenticado ou ID inválido' });
    }

    try {
        const user = await User.findById(userId).select('-password');

        if (!user) {
            logger.warn(`Usuário de ID ${userId} não encontrado.`);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        logger.info(`Usuário de ID ${userId} encontrado com sucesso.`);
        res.status(200).json(user);
    } catch (err) {
        logger.error(`Erro ao buscar usuário: ${err.message}`);
        res.status(500).json({ message: 'Erro ao buscar usuário: ' + err.message });
    }
};

exports.updateUserController = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  if (!req.user || String(req.user.id) !== id) {
    return res.status(403).json({ message: 'Acesso negado: não autorizado.' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const allowedFields = ['name', 'birthday_day', 'number', 'weight', 'height', 'email'];
    const filteredUpdates = {};

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        if (key === 'birthday_day') {
          const birth = moment(updates.birthday_day, 'DD/MM/YYYY');
          if (!birth.isValid()) {
            return res.status(400).json({ message: 'Data de nascimento inválida' });
          }
          filteredUpdates[key] = birth.toDate();
        } else {
          filteredUpdates[key] = updates[key];
        }
      }
    }

    Object.assign(user, filteredUpdates);
    await user.save();

      logger.info(`Usuário atualizado com os dados: ${JSON.stringify(filteredUpdates)}`);

      res.status(200).json({
        message: 'Usuário atualizado com sucesso.',
        user: user.toObject({ getters: true, virtuals: false })
      });
    } catch (err) {
      logger.error(`Erro ao atualizar usuário ${id}: ${err.message}`);
      res.status(500).json({ message: 'Erro ao atualizar usuário', error: err.message });
    }
  };