const Gameboard = (function () {
    const board = [
        ["EMPTY", "EMPTY", "EMPTY"],
        ["EMPTY", "EMPTY", "EMPTY"],
        ["EMPTY", "EMPTY", "EMPTY"]
    ];

    // Determine what player has the turn
    const turnPlayer = function () {
        let emptyFields = 0;

        for (const row of board) {
            for (const field of row) {
                if (field === "EMPTY") {
                    emptyFields++;
                }
            }
        }

        // If the number of empty fields is odd, it's O's turn
        if (emptyFields % 2 === 1) {
            return "O";
        } else {
            return "X";
        }
    };

    // Returns a list of all available moves
    const getAvailableMoves = function () {
        const availableMoves = [];

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (Gameboard.board[i][j] !== "EMPTY") {
                    availableMoves.push([i, j]);
                }
            }
        }

        return availableMoves;
    }

    const makeMove = function (move) {
        // Check if the move is legal
        if (move.length === 2 && move[0] >= 0 && move[0] <= 2 && move[1] >= 0 && move[1] <= 2) {
            // If the move is available, make it, else tell them to pick another
            if (getAvailableMoves().includes(board[move[0]][move[1]])) {
                console.log(`Player ${turnPlayer()} has made a move.`);
                board[move[0]][move[1]] = turnPlayer();
            } else {
                console.log("That move has already been played. Pick another one.");
            }
        } else {
            console.log("Please provide a legal move.");
        }
    };

    const clearBoard = function () {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                board[i][j] = "EMPTY";
            }
        }
    };

    return {board, turnPlayer, getAvailableMoves, makeMove, clearBoard};
})();

const Game = (function () {
    const newGame = function () {
        Gameboard.clearBoard();
        console.log("Starting new game...\nMake the first move.");
    };

    const isGameOver = function () {
        // If there is a winner, return it
        // Check every row and column for 3 in a row
        for (let i = 0; i < 2; i++) {
            if (Gameboard.board[i][0] === Gameboard.board[i][1] && Gameboard.board[i][1] === Gameboard.board[i][2]) {
                console.log(`The winner is ${Gameboard.board[i][0]}.`);
                return Gameboard.board[i][0];
            } else if (Gameboard.board[0][i] === Gameboard.board[1][i] && Gameboard.board[1][i] === Gameboard.board[2][i]) {
                console.log(`The winner is ${Gameboard.board[0][i]}.`);
                return Gameboard.board[0][i];
            }
        }

        // Check diagonals for 3 in a row
        if ((Gameboard.board[0][0] === Gameboard.board[1][1] && Gameboard.board[1][1] === Gameboard.board[2][2])
            || (Gameboard.board[2][0] === Gameboard.board[1][1] && Gameboard.board[1][1] === Gameboard.board[0][2])) {
                return Gameboard.board[1][1];
        }

        // If there aren't available moves, the game is done
        if (!getAvailableMoves()) {
            return true;
        } else {
            // Else the game hasn't finished
            return false;
        }
    }

    const playRound = function () {
        const potentialWinner = isGameOver();

        // Check if the round is over
        if (potentialWinner) {
            // Either announce the winner or a tie
            if (["X", "O"].includes(potentialWinner)) {
                console.log(`The winner is ${potentialWinner}.`);
            } else {
                console.log("It's a tie!");
            }
        } else {
            console.log(`${Gameboard.turnPlayer()}, it's your turn.`);

            // Continuously prompt the user for a move, until it's a valid one
            while (true) {
                playerMove = prompt("Please input your move in following format: 1, 2").split(", ");
                if (playerMove.length === 2 && Gameboard.getAvailableMoves().includes(playerMove)) {
                    break;
                }
            }

            Gameboard.makeMove(playerMove);
        }
    };

    return {newGame, isGameOver, playRound};
})();