class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = 'EMPTY';
    }
}

class Player {
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }
}

class Game {
    constructor(options) {
        this.rows = options.rows;
        this.columns = options.columns;
        this.players = [
            new Player(1, options.player1Color),
            new Player(2, options.player2Color)
        ];
        this.currentPlayerIndex = 0;
        this.board = [];
        this.initializeBoard();
        this.renderBoard();
    }

    initializeBoard() {
        for (let y = 0; y < this.rows; y++) {
            const row = [];
            for (let x = 0; x < this.columns; x++) {
                row.push(new Cell(x, y));
            }
            this.board.push(row);
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.style.gridTemplateColumns = `repeat(${this.columns}, 60px)`;
        }
    }

    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.style.gridTemplateColumns = `repeat(${this.columns}, 60px)`;

        gameBoard.innerHTML = '';
        this.board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                if (cell.state !== 'EMPTY') {
                    const player = this.players.find(player => player.id === cell.state);
                    cellDiv.classList.add(player.id === 1 ? 'player1' : 'player2');
                }
                gameBoard.appendChild(cellDiv);
            });
        });
    }

    setupListeners() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.addEventListener('click', this.handleBoardClick.bind(this));
    }

    handleBoardClick(event) {
        const cells = Array.from(document.getElementsByClassName('cell'));
        const index = cells.indexOf(event.target);
        if (index >= 0) {
            const rowIndex = Math.floor(index / this.columns);
            const columnIndex = index % this.columns;
            this.dropPiece(columnIndex);
        }
    }

    dropPiece(columnIndex) {
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y][columnIndex].state === 'EMPTY') {
                this.board[y][columnIndex].state = this.players[this.currentPlayerIndex].id;

                const hasWon = this.checkForWin(this.players[this.currentPlayerIndex].id);
                const isFull = this.isBoardFull();

                if (hasWon) {
                    setTimeout(() => {
                        alert(`Player ${this.players[this.currentPlayerIndex].id} wins!`);
                        this.resetBoard();
                    }, 10);
                    return;
                } else if (isFull) {
                    setTimeout(() => {
                        alert("It's a draw!");
                        this.resetBoard();
                    }, 10);
                    return;
                }
                this.switchPlayer();
                this.renderBoard();
                return;
            }
        }
    }

    switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    checkForWin(playerId) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                if (this.checkVertical(x, y, playerId) ||
                    this.checkHorizontal(x, y, playerId) ||
                    this.checkDiagonalRight(x, y, playerId) ||
                    this.checkDiagonalLeft(x, y, playerId)) {
                    return true;
                }
            }
        }
        return false;
    }

    checkVertical(column, row, playerId) {
        if (row > this.rows - 4) return false;
        for (let i = 0; i < 4; i++) {
            if (this.board[row + i][column].state !== playerId) {
                return false;
            }
        }
        return true;
    }

    checkHorizontal(column, row, playerId) {
        if (column > this.columns - 4) return false;
        for (let i = 0; i < 4; i++) {
            if (this.board[row][column + i].state !== playerId) {
                return false;
            }
        }
        return true;
    }

    checkDiagonalRight(column, row, playerId) {
        if (column > this.columns - 4 || row > this.rows - 4) return false;
        for (let i = 0; i < 4; i++) {
            if (this.board[row + i][column + i].state !== playerId) {
                return false;
            }
        }
        return true;
    }

    checkDiagonalLeft(column, row, playerId) {
        if (column < 3 || row > this.rows - 4) return false;
        for (let i = 0; i < 4; i++) {
            if (this.board[row + i][column - i].state !== playerId) {
                return false;
            }
        }
        return true;
    }

    isBoardFull() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                if (this.board[y][x].state === 'EMPTY') {
                    return false;
                }
            }
        }
        return true;
    }

    resetBoard() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                this.board[y][x].state = 'EMPTY';
            }
        }
        this.currentPlayerIndex = 0;

        this.renderBoard();
    }
}

function createGameSetup() {
    let setupHtml = `
        <div id="setup">
            Number of Rows: <input type="number" id="numRows" value="6"><br>
            Number of Columns: <input type="number" id="numColumns" value="7"><br>
            Player 1 Color: <input type="color" id="player1Color"><br>
            Player 2 Color: <input type="color" id="player2Color"><br>
            <button id="startGame">Start Game</button>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', setupHtml);
}

function initializeConnectFourGame() {
    createGameSetup();

    document.addEventListener('DOMContentLoaded', () => {
        const startButton = document.getElementById('startGame');
        startButton.addEventListener('click', () => {
            const numRows = document.getElementById('numRows').value;
            const numColumns = document.getElementById('numColumns').value;
            const player1Color = document.getElementById('player1Color').value;
            const player2Color = document.getElementById('player2Color').value;

            if (player1Color === player2Color) {
                alert("Please choose different colors for each player.");
                return;
            }

            const options = {
                rows: parseInt(numRows, 10),
                columns: parseInt(numColumns, 10),
                players: [
                    { id: 1, color: player1Color },
                    { id: 2, color: player2Color }
                ]
            };

            const game = new Game(options);
            game.setupListeners();
            document.getElementById('setup').style.display = 'none';
            document.getElementById('gameBoard').style.display = 'grid';
        });
    });
}
export { initializeConnectFourGame };