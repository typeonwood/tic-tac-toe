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
            const displaySquare = document.querySelector(`#${index}`)
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

displayBoard.create()