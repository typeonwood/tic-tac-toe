const gameBoard = (function() {
    let board = ['','','','','','','','','']
    return {board}
})()

const Player = function(name, side=true) {
    const move = (e) => {
        let square = e.target.id;
        let id = +square.slice(6);
        if (gameBoard.board[id] === '') gameBoard.board[id] = side
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
    create()
    display()
    return {display}
})()

const Game = (function() {
    const squares = document.querySelectorAll('.square')
    const announcement = document.querySelector('.announcement')
    const name1 = prompt('Enter name for Player 1')
    const name2 = prompt('Enter name for Player 2')
    const player1 = Player(name1)
    const player2 = Player(name2, false)
    let count = 0;
    const checker = () => {
        const board = gameBoard.board;
        for (i=1; i<8; i+=3) {
            if (board[i] === board[i-1] &&
                board[i-1] === board[i+1] &&
                board[i+1] !== '') {
                const winner = document.querySelector(`#square${i}`);
                winner.classList.add('winner')
                return true
            }
        }
        for (i=3; i<6; i++) {
            if (board[i] === board[i-3] &&
                board[i-3] === board[i+3] &&
                board[i+3] !== '') {
                const winner = document.querySelector(`#square${i}`);
                winner.classList.add('winner')
                return true
            }
        }
        if (board[0] === board[4] &&
            board[4] === board[8] &&
            board[8] !== '') {
            const winner = document.querySelector('#square4');
            winner.classList.add('winner')
            return true
        }
        if (board[2] === board[4] &&
            board[4] === board[6] &&
            board[6] !== '') {
            const winner = document.querySelector('#square4');
            winner.classList.add('winner')
            return true
        }
        else return false
    }
    const player1Turn = (e) => {
        player1.move(e);
        displayBoard.display();
        if (checker()) return endGame()
        count++;
        turns()
    }
    const player2Turn = (e) => {
        player2.move(e);
        displayBoard.display();
        if (checker()) return endGame()
        count++;
        turns()
    }
    const turns = () => {
        if (count % 2 === 0) {
            squares.forEach((square) => {
                square.addEventListener('click', player1Turn);
                square.removeEventListener('click', player2Turn)
            })
        }
        else {
            squares.forEach((square) => {
                square.addEventListener('click', player2Turn);
                square.removeEventListener('click', player1Turn)
            })
        }
    }
    const endGame = () => {
        const winner = document.querySelector('.winner')
        if (winner.textContent === 'X') {
            announcement.textContent = `Congratulations, ${player1.name}. You win!`
            squares.forEach((square) => {
                square.removeEventListener('click', player1Turn)
                square.removeEventListener('click', player2Turn)
            })
        }
        else {
            announcement.textContent = `Congratulations, ${player2.name}. You win!` 
            squares.forEach((square) => {
                square.removeEventListener('click', player2Turn)
                square.removeEventListener('click', player1Turn)
            })
        }
        winner.classList.remove()
    }
    const play = () => {
        gameBoard.board = ['','','','','','','','','']
        squares.forEach((square) => {
            square.textContent = ''
        })
        announcement.textContent = ''
        count = 0;
        turns()
    }
    const newGame = document.querySelector('.new-game');
    newGame.addEventListener('click', play)
    return {play}
})()