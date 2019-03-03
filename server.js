/**
 * server.js : The socket manager. When two connections are connecting to port 5000, the game can start. 
    Responsible for sending data between the two players.
 */
const io = require('socket.io')(); // creating a socket.io instance
const size = 10; // size of the board component (10 X 10)
const port = 5000; // port to listen on
let board = null;

// symbols to appear on the board for distinguishing between the two players
const players = {
  'X': null,
  'O': null
};

// names to attach to each user, null until siging at the initial Login page and making the first move.
const usernames = {
  'X': null,
  'O': null
};

let player = 'X'; // first user to login gets the 'X' symbol

reset();
io.listen(port); // listening on port 5000
console.log(`Listening on port ${port}`)

/**
 * Resets all previous board symbols and usernames etc.
 * In order to set the next game for new players on this channel.
 */
function reset() {
  board = Array(size).fill(0).map(x => Array(size).fill('')) // initialize an empty board (remove all previous symbols)
  players['X'] = null
  players['O'] = null
  usernames['X'] = null
  usernames['O'] = null
  player = 'X'
}

/**
 * Check if current row/column coordinates are located within the boardgame.
 * 
 * @param {*} row   an index on the board representing row number
 * @param {*} col   an index on the board representing column number
 * @return true or false
 */
function isValid(row, col) {
  return (row >= 0 && row < size && col >= 0 && col < size)
}

/**
 * Logic for calculating winner.
 * 
 * Check if there are 5 in a row from the same symbol on the boardgame after every move of each player.
 * 
 * @param {*} row      the row index of the clicked cell on the board UI
 * @param {*} col      the column index of the clicked cell on the board UI
 * @param {*} board    current boardgame
 */
function calculateWinner(row, col, board) {
  var winnerCells = []

  const directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 }
  ];

  let currentPlayer = board[row][col] // get symbol from clicked place

  // continue looping for next possible direction if no winner was found already
  for (let index = 0;
    (index < directions.length) && (winnerCells.length === 0); index++) {
    let addRow = directions[index].x
    let addCol = directions[index].y

    for (let j = 0; j < 5 && (winnerCells.length === 0); j++) {
      let potentialWinner = true

      for (let k = 0; k < 5 && potentialWinner; k++) {
        let currentRow = row + (addRow * (j - k))
        let currentCol = col + (addCol * (j - k))

        potentialWinner = isValid(currentRow, currentCol) && (board[currentRow][currentCol] === currentPlayer)

        winnerCells.push({
          row: currentRow,
          col: currentCol
        })
      }

      if (!potentialWinner) {
        winnerCells = [];
      }
    }
  }

  return winnerCells;
}


io.on('connection', (socket) => {
  if (players['X'] == null) {
    players['X'] = socket // attach first logged-in user to the 'X' symbol
    socket.emit('playertype', 'X')
  } else if (players['O'] == null) {
    players['O'] = socket // attach second logged-in user to the 'O' symbol
    socket.emit('playertype', 'O');
    io.emit('turn', usernames['X'])
  } else {
    socket.disconnect() // not allowing third player's login
  }

  socket.on('login', (username) => {
    if (players['X'] === socket) {
      usernames['X'] = username
    } else if (players['O'] === socket) {
      usernames['O'] = username
    }
  });

  socket.on('disconnect', () => {
    if (players['X'] === socket) {
      players['X'] = null
    } else if (players['O'] === socket) {
      players['O'] = null
    }

    board = Array(size).fill(0).map(x => Array(size).fill('')) // clear boardgame after a player disconnects
  });

  socket.on('click', (row, column) => {
    // Ignore players clicking when it's not their turn
    if (players[player] !== socket) {
      console.log('Click from wrong player: ' + (player === 'X' ? 'O' : 'X'))
      return
    }

    // Ignore clicks on an occupied place
    if (board[row][column] !== '') {
      console.log(`Illegal place: ${row}, ${column}`)
      return
    }

    // Ignore clicks before both players are connected
    if ((players['X'] == null) || (players['O'] == null)) {
      console.log('Need to wait for another player')
      return
    }

    board[row][column] = player;
    io.emit('board', board) // emit an updated board to all players

    // Check fow winner (only current player can win)
    if (calculateWinner(row, column, board).length != 0) {
      console.log(calculateWinner(row, column, board))
      io.emit('victory', player)
      // Disconnect players
      players['X'].disconnect()
      players['O'].disconnect()
      reset()
      return
    }

    // Toggle between players
    player = player === 'X' ? 'O' : 'X'
    io.emit('turn', usernames[player])
  })
})