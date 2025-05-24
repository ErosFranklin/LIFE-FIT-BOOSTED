const express = require('express');
const { createUserController } = require('../controllers/user_controllers.js');
const {authenticateJWT} = require('../middleware/middleware_auth.js')

const router = express.Router();

router.post('/user/register', async (req, res) => {
    const data = req.body;

    if (!data || !data.name || !data.email || !data.password || !data.birthday_day || !data.number || !data.weight || !data.height) {
       return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
   }

   const result = await createUserController(data);
    return res.status(result.statusCode || 500).json(result);
}); 

router.put('/user/update-by/:id', authenticateJWT, async (req, res) => {
  try {
    return await updateUserController(req, res);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err.message);
    return res.status(500).json({ message: 'Erro interno ao atualizar usuário.' });
  }
});
  
module.exports = router;
