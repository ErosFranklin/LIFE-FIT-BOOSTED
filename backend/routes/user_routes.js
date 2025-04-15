const express = require('express');
const { createUserController } = require('../controllers/user_controllers.js');

const router = express.Router();

router.post('/user/register', async (req, res) => {
    const data = req.body;

    if (!data || !data.name || !data.email || !data.password || !data.birthday_day || !data.number || !data.weight || !data.height) {
       return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
   }

   const result = await createUserController(data);
    return res.status(result.statusCode || 500).json(result);
}); 

module.exports = router;
