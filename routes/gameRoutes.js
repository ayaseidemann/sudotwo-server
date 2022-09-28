const express = require('express');
const router = express.Router();
const { setupGame, addSocketId, readGame, getAllGames } = require('../controllers/gameControllers');

// set up a game
router.get('/setup-game/:roomId', setupGame);

// add socket ids to game
router.post('/add-socket-id/:roomId', addSocketId);

// get game
router.get('/read-game/:roomId', readGame);

// get full list of games
router.get('/all-games', getAllGames);

module.exports = router;