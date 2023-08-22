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
    let name1 = ''
    let name2 = ''
    const squares = document.querySelectorAll('.square')
    const announcement = document.querySelector('.announcement')
    const modal = document.querySelector('dialog');
    let player1 = {}
    let player2 = {}
    let winnerX = true
    let mode = 'pvp'
    let bestBoard
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
    const checker = (board, game=true) => {
        let squaresLeft = 0;
        gameBoard.board.forEach((slot) => {
            if (slot === '') squaresLeft++
        })
        for (i=1; i<8; i+=3) {
            if (board[i] === board[i-1] &&
                board[i-1] === board[i+1] &&
                board[i+1] !== '') {
                winnerX = board[i];
                if (game) return selectWinner(i-1, i, i+1)  
                else return true
            }
        }
        for (i=3; i<6; i++) {
            if (board[i] === board[i-3] &&
                board[i-3] === board[i+3] &&
                board[i+3] !== '') {
                winnerX = board[i];
                if (game) return selectWinner(i-3, i, i+3)  
                else return true
            }
        }
        if (board[0] === board[4] &&
            board[4] === board[8] &&
            board[8] !== '') {
                winnerX = board[i];
                if (game) return selectWinner(0, 4, 8)  
                else return true
            }
        if (board[2] === board[4] &&
            board[4] === board[6] &&
            board[6] !== '') {
                winnerX = board[i];
                if (game) return selectWinner(2, 4, 6)  
                else return true
            } 
        else if (squaresLeft === 0) {
                winnerX = 'draw';
                return true
            }    
        else return false
    }
    const gameChecker = () => {
        return checker(gameBoard.board)
    }
    const pvpTurn = (e) => {
        player1.move(e);
        displayBoard.display();
        if (gameChecker() === true) return endGame()
        count++;
        turns()
    }
    const player2Turn = (e) => {
        player2.move(e);
        displayBoard.display();
        if (gameChecker() === true) return endGame()
        count++;
        turns()
    }
    const staticValue = (depth) => {
        let result = 0;
        if (winnerX === true) {
            result = 10 - depth
        }
        else if (winnerX === false) {
            result = -10 + depth
        }
        return result
    }
    const childPositions = (list, side) => {
        let position = [...list]
        let positions = [];
        list.forEach((slot, index) => {
            if (slot === '') {
                position = [...list];
                position[index] = side;
                positions.push(position)
            }
        })
        return positions
    }
    const minimax = (position, depth, maxTurn=false) => {
        if (checker(position, false)) return staticValue(depth)
        else if (maxTurn) {
            let positions = childPositions(position, maxTurn)
            let maxValue = -100
            let bestPosition = []
            let i = 0;
            while (i < positions.length) {
                let random = Math.floor(Math.random() * 2)
                let value = minimax(positions[i], depth + 1, false);
                if (value > maxValue) {
                    maxValue = value;
                    bestPosition = [...positions[i]]
                }
                else if (value === maxValue && random === 1) {
                    bestPosition = [...positions[i]]
                }
                i++
            }
            bestBoard = [...bestPosition]
            return maxValue
        }
        else {
            let positions = childPositions(position, maxTurn)
            let minValue = 100
            let bestPosition = []
            let i = 0;
            while (i < positions.length) {
                let random = Math.floor(Math.random() * 2)
                let value = minimax(positions[i], depth + 1, true);
                if (value < minValue) {
                    minValue = value;
                    bestPosition = [...positions[i]]
                }
                else if (value === minValue && random === 1) {
                    bestPosition = [...positions[i]]
                }
                i++
            }
            bestBoard = [...bestPosition]
            return minValue
        }
    }
    const computerTurn = (num) => {
        setTimeout(() => {
            minimax(gameBoard.board, num);
            let bestMove;
            bestBoard.forEach((item, index) => {
                if (item !== gameBoard.board[index]) bestMove = index
            })
            let choice = document.querySelector(`#square${bestMove}`)
            let evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true, 
                view: window
            })
            choice.dispatchEvent(evt)
        }, 500);
    }
    const pvcTurn = (e) => {
        pvpTurn(e);
        if (checker(gameBoard.board, false)) return 
        let num = 0;
        gameBoard.board.forEach((slot) => {
            if (slot !== '') num += 1
        })
        computerTurn(num)
    }
    const turns = () => {
        let fx;
        if (mode === 'pvp') fx = pvpTurn
        else fx = pvcTurn;
        if (count % 2 === 0) {
                squares.forEach((square) => {
                    square.addEventListener('click', fx);
                    square.removeEventListener('click', player2Turn)
                })
            }
        else {
            squares.forEach((square) => {
                square.addEventListener('click', player2Turn);
                square.removeEventListener('click', fx)
            })
        }
    }
    const endGame = () => {
        let winner = document.querySelector('.winner');
        if (!winner) {
            announcement.textContent = 'Draw! Play again?'
            squares.forEach((square) => {
                square.removeEventListener('click', pvpTurn)
                square.removeEventListener('click', pvcTurn)
                square.removeEventListener('click', player2Turn)
        })
        }
        else if (winner.textContent === 'X') {
            announcement.textContent = `Congratulations, ${player1.name}. You win!`
        }
        else if (winner.textContent === 'O') {
            announcement.textContent = `Congratulations, ${player2.name}. You win!` 
        }
    }
    const play = () => {
        if (document.querySelector('.winner')) {
            const winners = document.querySelectorAll('.winner');
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
            const modes = document.getElementsByName('mode');
            modes.forEach((item) => {
                if (item.checked) mode = item.id
            })
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
    return {minimax}
})()