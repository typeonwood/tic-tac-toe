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
    let name1 = ''
    let name2 = ''
    const modal = document.querySelector('dialog');
    let player1 = {}
    let player2 = {}
    let count = 0;
    const selectWinner = (num1, num2, num3) => {
        const winner1 = document.querySelector(`#square${num1}`)
        const winner2 = document.querySelector(`#square${num2}`)
        const winner3 = document.querySelector(`#square${num3}`);
        winner1.classList.add('winner')
        winner2.classList.add('winner')
        winner3.classList.add('winner');
        return true
    }
    const checker = () => {
        const board = gameBoard.board;
        for (i=1; i<8; i+=3) {
            if (board[i] === board[i-1] &&
                board[i-1] === board[i+1] &&
                board[i+1] !== '') return selectWinner(i-1, i, i+1)
        }
        for (i=3; i<6; i++) {
            if (board[i] === board[i-3] &&
                board[i-3] === board[i+3] &&
                board[i+3] !== '') return selectWinner(i-3, i, i+3)
        }
        if (board[0] === board[4] &&
            board[4] === board[8] &&
            board[8] !== '') return selectWinner(0, 4, 8)
        if (board[2] === board[4] &&
            board[4] === board[6] &&
            board[6] !== '') return selectWinner(2, 4, 6)
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
        const winner = document.querySelector('.winner');
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
    }
    const play = () => {
        if (document.querySelector('.winner')) {
            const winners = document.querySelectorAll('.winner')
            winners.forEach((winner) => {
                winner.classList.remove('winner')
            })
        }
        gameBoard.board = ['','','','','','','','','']
        squares.forEach((square) => {
            square.textContent = ''
        })
        announcement.textContent = ''
        count = 0
        modal.showModal();
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            name1 = document.querySelector('#p1-name')
            name2 = document.querySelector('#p2-name');
            player1 = Player(name1.value)
            player2 = Player(name2.value, false)
            modal.close();
            turns()
        })
    }
    const newGame = document.querySelector('.new-game');
    newGame.addEventListener('click', play)
    return {play}
})()