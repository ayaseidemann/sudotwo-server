const express = require('express');
const app = express();
// get dotenv working
require('dotenv').config();
const { PORT } = process.env;
const gameRoutes = require('./routes/gameRoutes');

// give access to req.body
app.use(express.json());

// set game route
app.use('/', gameRoutes);

app.get('/', (req, res) => {
    res.send('You are in the server woohoo!');
});


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})