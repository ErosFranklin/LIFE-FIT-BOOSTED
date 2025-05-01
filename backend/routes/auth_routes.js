const express = require('express');
const { loginController, getUserData} = require('../controllers/auth_controllers.js')
const {authenticateJWT} = require('../middleware/middleware_auth.js')

const router = express.Router()

router.post('/user/login', async (req, res) => {
    const data = req.body;

    if (!data || !data.email || !data.password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await loginController(data); 
    return res.status(result.statusCode || 500).json(result); 
});


router.get('/data_user', authenticateJWT, async (req, res) => {
    try {
        const response = await getUserData(req.user);
        return res.status(200).json(response); 
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;