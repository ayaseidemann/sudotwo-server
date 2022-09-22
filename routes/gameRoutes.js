const express = require('express');
const router = express.Router();
const { setupGame, readGame, getAllGames } = require('../controllers/gameControllers');

// get game based on difficulty
router.get('/setup-game/:roomId', setupGame);

// get game
router.get('/read-game/:roomId', readGame);

// get full list of games
router.get('/all-games', getAllGames);

module.exports = router;