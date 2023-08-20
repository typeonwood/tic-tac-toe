const gameBoard = (function() {
    let board = ['','','','','','','','','']
    return {board}
})()

const Player = function(name, side=true) {
    const move = (e) => {
        let square = e.target.id;
        gameBoard.board[square] = side
    }
    return {name, side, move}
}

const displayBoard = (function() {
    const create = () => {
        const container = document.querySelector('.container')
        for (i=0; i<9; i++) {
            const square = document.createElement('div');
            square.classList.add('square')
            square.setAttribute('id', `square${i}`)
            container.appendChild(square)
        }
    }
    const display = () => {
        gameBoard.board.forEach((square, index) => {
            const displaySquare = document.querySelector(`#square${index}`)
            if (square === true) {
                displaySquare.textContent = 'X'
            }
            else if (square === false) {
                displaySquare.textContent = 'O'
            }
        })
    }
    return {create, display}
})()

const Game = (function() {
    const checker = () => {
        const board = gameBoard.board
        for (i=1; i<8; i+=3) {
            if (board[i] === board[i-1] === board[i+1]) return true
        }
        for (i=3; i<6; i++) {
            if (board[i] === board[i-3] === board[i+3]) return true
        }
        if (board[0] === board[4] === board[8]) return true
        if (board[2] === board[4] === board[6]) return true
        else return false
    }
    const play = () => {
        const name1 = prompt('Enter name for Player 1')
        const name2 = prompt('Enter name for Player 2')
        const player1 = Player(name1)
        const player2 = Player(name2, false)
        const squares = document.querySelectorAll('.square')
        let count = 0;
        while (!checker()) {
            if (count % 2 === 0) {
                squares.forEach((square) => {
                    square.addEventListener('click', player1.move)
                })
            }
            else {
                squares.forEach((square) => {
                    square.addEventListener('click', player2.move)
                })
            }
            displayBoard.display()
        }
    }
    return {play}
})()

displayBoard.create()
displayBoard.display()