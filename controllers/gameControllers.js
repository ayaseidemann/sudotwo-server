const { default: axios } = require('axios');
const fs = require('fs');
const { writeGameToJson } = require('../models/gameModels');
const { v4: uuidv4 } = require('uuid');


// function getGame(req, res) {
//     const difficulty = req.params.difficulty;
//     axios.get(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
//         .then(response => {
//             const roomId = uuidv4();
//             const board = response.data.board;
//             const solution = getSolution(board);
//             console.log('the solution is: ', solution);
//             res.json(board);
//             // writeGameToJson(roomId, board, solution);
//         })
//         .catch(err => console.log(err))
// }

async function getGame(req, res) {
    try {
        const difficulty = req.params.difficulty;
        const {data: getBoard} = await axios.get(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`);
        const board = getBoard.board;
        console.log(board);
        const roomId = uuidv4();
        const {data: getSolution} = await axios.post(`https://sugoku.herokuapp.com/solve`, { "board": board });
        const solution = getSolution.solution;
        // console.log('the solution is: ', solution);
        res.json(solution);
        writeGameToJson(roomId, board, solution);
    }
    catch(err) {
        console.log(err)
    }
}

function getSolution(board) {
    console.log('in the get solution function');
    // console.log(board);
    axios.post(`https://sugoku.herokuapp.com/solve`, { "board": board })
    .then(response => {
        console.log('in the get solution .then')
        return(response.data.solution);
    })
}

// function getSolution(req, res) {
//     console.log('in the get solution function');
//     const board2 = [[2,0,0,0,0,7,0,1,5],[1,0,5,0,0,0,6,7,8],[7,0,0,0,5,0,0,0,0],[3,1,0,4,0,0,7,8,0],[0,5,7,8,0,0,3,0,0],[6,9,8,0,0,0,0,5,1],[5,0,0,6,0,0,0,9,0],[0,7,0,9,1,0,5,0,0],[0,0,0,0,7,0,0,0,0]];
//     axios.post(`https://sugoku.herokuapp.com/solve`, { "board": board2 })
//     .then(response => {
//         console.log('in the get solution .then')
//         res.send(response.data.solution);
//     })
// }


module.exports = {
    getGame, 
    getSolution
}


    // // function geting board from sudoku
    // function getBoard() {
    //     axios.get(boardApiURL)
    //         .then(response => {
    //             setBoard(response.data.board);
    //         })
    //         .then(response => {
    //             axios.post(solutionApiURL, {"board": board})
    //                 .then(response => {
    //                     console.log(response.data.solution);
    //                     setSolution(response.data.solution);
    //                 })
    //         })
    //         .catch(err => console.log(err));
    // }