const { default: axios } = require('axios');
const fs = require('fs');
const { writeGameToJson, readRoomsData } = require('../models/gameModels');


async function setupGame(req, res) {
    try {
        const roomId = req.params.roomId;
        const {data: axiosBoard} = await axios.get(`${process.env.API_SERVER_URL}/board?difficulty=easy`);
        const board = axiosBoard.board;
        const encodedBoard = new URLSearchParams({ board: JSON.stringify(board) });
        const {data: axiosSolution} = await axios.post(`${process.env.API_SERVER_URL}/solve`, encodedBoard.toString());
        const solution = axiosSolution.solution;
        readRoomsData((err, data) => {
            if (err) {
                console.log('error in reading rooms data in setup game function');
            } else {
                const rooms = JSON.parse(data);
                const game = {
                    roomId: roomId,
                    board: board,
                    solution: solution
                }
                rooms.push(game);
                writeGameToJson(JSON.stringify(rooms));
                res.json(game);
            }
        })
    }
    catch(err) {
        console.log(err)
    }
}

function addSocketId(req, res) {
    console.log('in add socket id function');
    readRoomsData((err, data) => {
        if (err) {
            console.log('error in reading rooms data in add socket id function');
        } else {
            const rooms = JSON.parse(data);
            const roomId = req.params.roomId;
            const player1Id = req.body.player1Id;
            const player2Id = req.body.player2Id;
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].roomId === roomId) {
                    rooms[i].players = [player1Id, player2Id];
                    rooms.splice(i, 1, rooms[i]);
                    break;
                }
            }
            writeGameToJson(JSON.stringify(rooms));
        }
        res.send('finished');
    })
}

function readGame(req, res) {
    const roomId = req.params.roomId;
    console.log(roomId);
    readRoomsData((err, data) => {
        if (err) {
            console.log('error in reading from file');
        } else {
            const rooms = JSON.parse(data);
            const activeRoom = rooms.find(room => room.roomId === roomId);
            res.json(activeRoom);
        }
    })
}

function getAllGames(req, res) {
    readRoomsData((err, data) => {
        if (err) {
            console.log('error in reading from file');
        } else {
            const rooms = JSON.parse(data);
            res.json(rooms);
        }
    })
}

module.exports = {
    setupGame,
    addSocketId,
    readGame,
    getAllGames
}