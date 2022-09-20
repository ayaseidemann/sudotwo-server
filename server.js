const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const io = require('socket.io')(server, {
    cors: {
        origin: ['http://localhost:3000'] 
    }
});

const cors = require('cors');
require('dotenv').config();
const { PORT } = process.env;
const gameRoutes = require('./routes/gameRoutes');


// connect socket.io
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('tile-change', value => {
        console.log('tile change to: ', value);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// set up cors
app.use(cors());

// give access to req.body
app.use(express.json());

// set game route
app.use('/', gameRoutes);

app.get('/', (req, res) => {
    res.send('You are in the server woohoo!');
});

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})