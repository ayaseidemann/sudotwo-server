const fs = require('fs');
const axios = require('axios');

// read games from json
function loadVideosData(callback) {
    fs.readFile('./data/games.json', 'utf8', callback)
}

// function to write a game to json
function writeGameToJson(roomId, board, solution) {
    const game = {
        roomId: roomId,
        board: board,
        solution: solution
    }
    fs.writeFile('./data/games.json', JSON.stringify(game), (err) => {
        if (err) {
            console.log('there is an error in writeing game to json', err)
        }
    })
}

// function getSolution(board) {
//     console.log('in the get solution function');
//     axios.post(`https://sugoku.herokuapp.com/solve`, { "board": board })
//     .then(response => {
//         console.log('in the get solution .then')
//         console.log(response.data.solution);
//         return(response.data.solution);
//     })
// }

module.exports = {
    writeGameToJson
    // getSolution
}