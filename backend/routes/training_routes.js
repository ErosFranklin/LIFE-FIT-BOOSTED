const express = require('express');
const router = express.Router();
const  trainingController  = require('../controllers/training_controllers.js');

// SPLIT
router.post('/:userId/create/training/split', trainingController.setTrainingSplit);
router.patch('/:userId/update/training/split', trainingController.updateSplitOnly);
router.get('/:userId/training/split', trainingController.getTrainingSplit);
router.delete('/:userId/split/training', trainingController.deleteTrainingSplit);

// TRAININGS OF WEEK
router.get('/:userId/training/week', trainingController.getTrainingsOfWeek);

// TRAINING DAYS
router.post('/:userId/create/training/days', trainingController.setTrainingDays);
router.patch('/:userId/update/training/days', trainingController.updateTrainingDays);
router.get('/:userId/training/days', trainingController.getTrainingDays);
router.delete('/:userId/delete/training/days', trainingController.deleteTrainingDays);

// TRAINING BY DAY
router.post('/:userId/create/training/:day', trainingController.setTrainingByDay);
router.get('/:userId/training/:day', trainingController.getTrainingByDay);
router.patch('/:userId/update/training/:day', trainingController.updateTrainingDay);
router.delete('/:userId/delete/training/:day', trainingController.deleteTrainingDay);



module.exports = router;