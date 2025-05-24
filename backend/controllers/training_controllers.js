const User = require('../models/user');
const logger = require('../utils/logger');

// Criar ou atualizar o split do
exports.setTrainingSplit = async (req, res) => {
  try {
    const { userId } = req.params;
    const { training_split } = req.body;

    logger.info(`Solicitação de SET de split para usuário: ${userId}`);

    if (!['ABC', 'ABCD', 'ABCDE'].includes(training_split)) {
      logger.warn(`Divisão inválida recebida: ${training_split}`);
      return res.status(400).json({ error: 'Divisão de treino inválida.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`Usuário não encontrado ao tentar SET split: ${userId}`);
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.training_split !== null) {
      logger.warn(`Usuário ${userId} já possui split definido.`);
      return res.status(400).json({ error: 'Split de treino já definido.' });
    }

    user.training_split = training_split;
    await user.save();

    logger.info(`Split definido com sucesso para usuário: ${userId}`);
    res.status(200).json({ message: 'Split definido com sucesso.', user });
  } catch (err) {
    logger.error(`Erro ao setar split para usuário ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao definir o split de treino.', details: err.message });
  }
};

// Atualizar apenas o tipo de split (ABC, ABCD, ABCDE)
exports.updateSplitOnly = async (req, res) => {
  try {
    const { userId } = req.params;
    const { training_split } = req.body;

    logger.info(`Solicitação de PATCH (split) para usuário: ${userId}`);

    if (!['ABC', 'ABCD', 'ABCDE'].includes(training_split)) {
      logger.warn(`Divisão inválida no PATCH: ${training_split}`);
      return res.status(400).json({ error: 'Divisão de treino inválida.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { training_split },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      logger.warn(`Usuário não encontrado ao atualizar apenas o split: ${userId}`);
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    logger.info(`Split de treino atualizado para usuário: ${userId}`);
    res.status(200).json(updatedUser);
  } catch (err) {
    logger.error(`Erro ao atualizar split para usuário ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao atualizar o split.', details: err.message });
  }
};

// Obter divisão de treino
exports.getTrainingSplit = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`Solicitação GET de treino para usuário: ${userId}`);

    const user = await User.findById(userId, 'training_split training_days trainings_of_week');

    if (!user) {
      logger.warn(`Usuário não encontrado ao buscar treino: ${userId}`);
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    logger.info(`Treino retornado com sucesso para usuário: ${userId}`);
    res.status(200).json(user);
  } catch (err) {
    logger.error(`Erro ao buscar treino para usuário ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao buscar a divisão de treino.', details: err.message });
  }
};

// Deletar (resetar) divisão de treino
exports.deleteTrainingSplit = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`Solicitação DELETE de treino para usuário: ${userId}`);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        training_split: null,
        training_days: [],
        trainings_of_week: {}
      },
      { new: true }
    );

    if (!user) {
      logger.warn(`Usuário não encontrado ao tentar deletar treino: ${userId}`);
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    logger.info(`Treino removido com sucesso para usuário: ${userId}`);
    res.status(200).json({ message: 'Divisão de treino removida com sucesso.', user });
  } catch (err) {
    logger.error(`Erro ao deletar treino para usuário ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao remover a divisão de treino.', details: err.message });
  }
};

//Dias dos treinos 

const validDays = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];
const splitLimits = {
  ABC: 3,
  ABCD: 4,
  ABCDE: 5
};

// Criar ou atualizar dias de treino
exports.setTrainingDays = async (req, res) => {
  try {
    const { userId } = req.params;
    const { training_days } = req.body;

    logger.info(`SET training_days para usuário: ${userId}`);

    if (!Array.isArray(training_days) || training_days.some(day => !validDays.includes(day))) {
      logger.warn(`Dias inválidos informados: ${JSON.stringify(training_days)}`);
      return res.status(400).json({ error: 'Dias inválidos informados.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      logger.warn(`Usuário não encontrado: ${userId}`);
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const allowedDays = splitLimits[user.training_split];
    if (!allowedDays) {
      logger.warn(`Usuário ${userId} ainda não definiu um training_split`);
      return res.status(400).json({ error: 'Training split ainda não definido.' });
    }

    if (training_days.length !== allowedDays) {
      return res.status(400).json({ error: `Você deve escolher exatamente ${allowedDays} dias para o split ${user.training_split}.` });
    }

    user.training_days = training_days;
    await user.save();

    logger.info(`Dias de treino definidos para usuário ${userId}: ${training_days}`);
    res.status(200).json({ training_days, rest_days: validDays.filter(day => !training_days.includes(day)) });
  } catch (err) {
    logger.error(`Erro ao definir training_days para ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao definir os dias de treino.', details: err.message });
  }
};

// Obter dias de treino e descanso
exports.getTrainingDays = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`GET training_days para usuário: ${userId}`);

    const user = await User.findById(userId, 'training_days');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const rest_days = validDays.filter(day => !user.training_days.includes(day));

    res.status(200).json({ training_days: user.training_days, rest_days });
  } catch (err) {
    logger.error(`Erro ao buscar training_days para ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao buscar os dias de treino.', details: err.message });
  }
};

// Atualizar dias de treino
exports.updateTrainingDays = async (req, res) => {
  // reutiliza lógica de setTrainingDays
  exports.setTrainingDays(req, res);
};

// Deletar dias de treino (zera o array)
exports.deleteTrainingDays = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`DELETE training_days para usuário: ${userId}`);

    const user = await User.findByIdAndUpdate(
      userId,
      { training_days: [] },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Dias de treino removidos.', training_days: [], rest_days: validDays });
  } catch (err) {
    logger.error(`Erro ao deletar training_days para ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao remover os dias de treino.', details: err.message });
  }
};

//Divisão de treinos 

const validMuscleGroups = [
  'Peito', 'Costas', 'Quadriceps', 'Posterior da Coxa', 'Glúteos', 'Panturrilhas',
  'Ombros', 'Bíceps', 'Tríceps', 'Abdômen', 'Trapézio', 'Antebraços'
];

// Setar treinos da semana
exports.setTrainingByDay = async (req, res) => {
  try {
    const { userId, day } = req.params;
    const { groups } = req.body;

    logger.info(`SET treino do dia '${day}' para usuário: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`Usuário não encontrado: ${userId}`);
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (!user.training_days.includes(day)) {
      return res.status(400).json({ error: `Dia '${day}' não está definido nos dias de treinos selecionados.` });
    }

    if (!Array.isArray(groups)) {
      return res.status(400).json({ error: `Formato inválido para os grupos do dia ${day}.` });
    }

    for (const group of groups) {
      if (!Array.isArray(group.muscleArea) || group.muscleArea.length === 0) {
        return res.status(400).json({ error: `Grupo muscular inválido no dia ${day}.` });
      }

      if (!Array.isArray(group.exercise) || group.exercise.length === 0) {
        return res.status(400).json({ error: `Exercícios inválidos no dia ${day}.` });
      }

      if (
        !ex.name || typeof ex.name !== 'string' ||
        typeof ex.series !== 'number' ||
        !ex.equipment || typeof ex.equipment !== 'string'
      ) {
        return res.status(400).json({ error: `Exercício mal formatado no dia ${day}. Campos obrigatórios: name, series, equipment.` });
      }
    }

   // Atualiza apenas o dia específico de forma segura
if (!(user.trainings_of_week instanceof Map)) {
  user.trainings_of_week = new Map();
}

user.trainings_of_week.set(day, groups);

await user.save();
logger.info(`Treino do dia '${day}' atualizado para usuário: ${userId}`);
res.status(200).json({ [day]: user.trainings_of_week.get(day) });

  } catch (err) {
    logger.error(`Erro ao definir treino do dia ${req.params.day} para ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao definir o treino do dia.', details: err.message });
  }
};


// Obter treinos da semana
exports.getTrainingsOfWeek = async (req, res) => {
  try {
    const { userId } = req.params;

    logger.info(`GET trainings_of_week para usuário: ${userId}`);

    const user = await User.findById(userId, 'trainings_of_week');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(user.trainings_of_week);
  } catch (err) {
    logger.error(`Erro ao buscar trainings_of_week: ${err.message}`);
    res.status(500).json({ error: 'Erro ao buscar os treinos da semana.', details: err.message });
  }
};
// Obter treinos do dia
exports.getTrainingByDay = async (req, res) => {
  try {
    const { userId, day } = req.params;

    logger.info(`GET treino do dia '${day}' para usuário: ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const trainingDay = user.trainings_of_week.get(day);

    if (!trainingDay) {
      return res.status(404).json({ error: `Nenhum treino encontrado para o dia '${day}'.` });
    }

    res.status(200).json({ day, trainings: trainingDay });
  } catch (err) {
    logger.error(`Erro ao buscar treino do dia '${req.params.day}' para usuário ${req.params.userId}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao buscar treino do dia.', details: err.message });
  }
};

// Atualizar treinos de um dia específico
exports.updateTrainingDay = async (req, res) => {
  try {
    const { userId, day } = req.params;
    const { groups } = req.body;

    logger.info(`UPDATE treino do dia '${day}' para usuário: ${userId}`);

    const user = await User.findById(userId);

    if (!user || !user.training_days.includes(day)) {
      return res.status(404).json({ error: 'Usuário não encontrado ou dia inválido.' });
    }

    if (!Array.isArray(groups)) {
      return res.status(400).json({ error: 'Formato inválido para grupos.' });
    }

    // validações iguais à criação
    for (const group of groups) {
      const { muscleArea, exercise } = group;

      if (!Array.isArray(muscleArea) || muscleArea.some(m => !validMuscleGroups.includes(m))) {
        return res.status(400).json({ error: `Grupo(s) musculares inválidos no dia ${day}.` });
      }

      if (!Array.isArray(exercise) || exercise.length < 4 || exercise.length > 7) {
        return res.status(400).json({ error: `Cada grupo muscular no dia ${day} deve ter entre 4 e 7 exercícios.` });
      }

      if (
        !ex.name || typeof ex.name !== 'string' ||
        typeof ex.series !== 'number' ||
        !ex.equipment || typeof ex.equipment !== 'string'
      ) {
        return res.status(400).json({ error: `Exercício mal formatado no dia ${day}. Campos obrigatórios: name, series, equipment.` });
      }
    }

    user.trainings_of_week.set(day, groups);
    await user.save();

    res.status(200).json({ message: `Treinos do dia '${day}' atualizados.` });
  } catch (err) {
    logger.error(`Erro ao atualizar treino do dia ${req.params.day}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao atualizar treino do dia.', details: err.message });
  }
};

// Deletar treino de um dia
exports.deleteTrainingDay = async (req, res) => {
  try {
    const { userId, day } = req.params;

    logger.info(`DELETE treino do dia '${day}' para usuário: ${userId}`);

    const user = await User.findById(userId);

    if (!user || !user.trainings_of_week.has(day)) {
      return res.status(404).json({ error: 'Treino do dia não encontrado.' });
    }

    user.trainings_of_week.delete(day);
    await user.save();

    res.status(200).json({ message: `Treino do dia '${day}' removido.` });
  } catch (err) {
    logger.error(`Erro ao deletar treino do dia ${req.params.day}: ${err.message}`);
    res.status(500).json({ error: 'Erro ao remover treino do dia.', details: err.message });
  }
};