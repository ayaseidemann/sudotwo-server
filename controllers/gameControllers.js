const { default: axios } = require('axios');
const fs = require('fs');
const { writeGameToJson, readRoomsData } = require('../models/gameModels');


async function setupGame(req, res) {
    try {
        const roomId = req.params.roomId;
        // const {data: axiosBoard} = await axios.get(`http://scottalonzo.local:8080/board?difficulty=easy`);
        // const {data: axiosBoard} = await axios.get(`http://chookie.local:8080/sugoku-api/board?difficulty=easy`);
        // const {data: axiosBoard} = await axios.get(`https://sugoku.herokuapp.com/board?difficulty=easy`);
        const {data: axiosBoard} = await axios.get(`http://localhost:8090/board?difficulty=easy`);
        const board = axiosBoard.board;
        const encodedBoard = new URLSearchParams({ board: JSON.stringify(board) })
        // const {data: axiosSolution} = await axios.post(`http://scottalonzo.local:8080/solve`, encodedBoard.toString());
        // const {data: axiosSolution} = await axios.post(`http://chookie.local:8080/sugoku-api/solve`, encodedBoard.toString());
        // const {data: axiosSolution} = await axios.post(`https://sugoku.herokuapp.com/solve`, encodedBoard.toString());
        const {data: axiosSolution} = await axios.post(`http://localhost:8090/solve`, encodedBoard.toString());
        const solution = axiosSolution.solution;
        readRoomsData((err, data) => {
            if (err) {
                console.log('error in reading rooms data');
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
    readGame,
    getAllGames
}