const express = require('express');
const router = express.Router();
const { getGame, getSolution } = require('../controllers/gameControllers');

// get game based on difficulty
router.get('/:difficulty', getGame);

// get solution
router.get('/game/solution', getSolution);

module.exports = router;