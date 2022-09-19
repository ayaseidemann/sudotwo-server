const express = require('express');
const router = express.Router();
const { setupGame, readSolution } = require('../controllers/gameControllers');

// get game based on difficulty
router.get('/game/:difficulty', setupGame);

// get solution
router.get('/solution/:roomId', readSolution);

module.exports = router;