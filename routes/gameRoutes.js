const express = require('express');
const router = express.Router();
const { setupGame, readGame } = require('../controllers/gameControllers');

// get game based on difficulty
router.get('/setup-game/:roomId', setupGame);

// get solution
router.get('/read-game/:roomId', readGame);

module.exports = router;