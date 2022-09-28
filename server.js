const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config();

const io = require('socket.io')(server, {
    cors: {
        origin: [process.env.CLIENT_URL] 
    }
});

const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');


// connect socket.io
io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`);
    
    socket.on('tile-change', data => {
        socket.to(data.roomId).emit('receive-tile-change', {board: data.board, inputBoard: data.inputBoard})
    });
    socket.on('create-game', game => {
        // console.log('the game received is: ', game);
        // console.log('the id of the game received is: ', socket.id);
        socket.broadcast.emit(game);
    });

    socket.on('join-room', roomId => {
        console.log('user', socket.id,  'joined room', roomId);
        socket.join(roomId);
        // get map object of all users in all rooms, count number in current room
        const roomMap = io.of("/").adapter.sids;
        let count = 0;
        roomMap.forEach(element => {
            if(element.has(roomId)) {
                count++;
            }
        });
        if (count === 2) {
            // send to all in room including self
            io.in(roomId).emit('go-to-game', {roomId: roomId, player2Id: socket.id});
        } else if (count > 2) {
            // send back just to self (last entered user)
            io.to(socket.id).emit('no-entry', roomId);
        }
    });

    socket.on('time-change', data =>{
        socket.to(data.roomId).emit('receive-time', data.timer);
    })

    socket.on('tile-selected', (data) => {
        socket.to(data.roomId).emit('receive-tile', data.tileCoords);
    });

    socket.on('send-name', (data) => {
        console.log('data.sendName', data.sendName);
        socket.to(data.roomId).emit('receive-name', data.sendName);
    });

    socket.on('emoji-change', data => {
        socket.to(data.roomId).emit('receive-emoji', data.emojiBoard);
    });

    socket.on('stop-timer', roomId => {
        socket.to(roomId).emit('receive-stop-timer');
    })

    socket.on('won-game', roomId => {
        console.log(roomId, 'won the game!');
        socket.to(roomId).emit('receive-won-game');
    });

    socket.on("disconnect", () => {
        console.log(socket.id, 'user disconnected');
        // loop through rooms, find room with an id matching socket.id
        // socket emit to other player that they've been kicked out
        // delete room and repush all rooms to json
    });

    // socket.on('user-disconnected', roomId => {
    //     console.log('a user disconnected in room:', roomId);
    //     socket.to(roomId).emit('receive-user-disconnected');
    // });

    // socket.on("disconnect", async () => {
    //     console.log('starring disconnect func');
    //     const sockets = await io.in(computeUserId(socket)).fetchSockets();
    //     if (sockets.length === 0) {
    //         console.log(socket.id, 'user has disconnected');
    //       // no more active connections for the given user
    //     }
    // });
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

server.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
})