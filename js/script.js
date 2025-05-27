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

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (Gameboard.board[i][j] === "EMPTY") {
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
            if (getAvailableMoves().some(availableMove => availableMove[0] === playerMove[0] && availableMove[1] === playerMove[1])) {
                console.log(`Player ${turnPlayer()} has made a move.`);
                board[move[0]][move[1]] = turnPlayer();
            } else {
                console.log("That move has already been played. Pick another one.");
            }
        } else {
            console.log("Out of bounds move. Please provide a legal one.");
        }
    };

    const clearBoard = function () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = "EMPTY";
            }
        }
    };

    return {board, turnPlayer, getAvailableMoves, makeMove, clearBoard};
})();

const Game = (function () {
    
    const newGame = function () {
        Gameboard.clearBoard();
        console.log("Starting new game...");
        playGame();
    };

    const isGameOver = function () {
        // If there is a winner, return it
        // Check every row and column for 3 in a row
        for (let i = 0; i < 3; i++) {
            if (Gameboard.board[i][0] === Gameboard.board[i][1] && Gameboard.board[i][1] === Gameboard.board[i][2] && Gameboard.board[i][0] !== "EMPTY") {
                console.log(`The winner is ${Gameboard.board[i][0]}.`);
                return Gameboard.board[i][0];
            } else if (Gameboard.board[0][i] === Gameboard.board[1][i] && Gameboard.board[1][i] === Gameboard.board[2][i]  && Gameboard.board[0][i] !== "EMPTY") {
                console.log(`The winner is ${Gameboard.board[0][i]}.`);
                return Gameboard.board[0][i];
            }
        }

        // Check diagonals for 3 in a row
        if (Gameboard.board[1][1] !== "EMPTY") {
            if ((Gameboard.board[0][0] === Gameboard.board[1][1] && Gameboard.board[1][1] === Gameboard.board[2][2])
                || (Gameboard.board[2][0] === Gameboard.board[1][1] && Gameboard.board[1][1] === Gameboard.board[0][2])) {
                    return Gameboard.board[1][1];
            }
        }

        // If there aren't available moves, the game is done through tie
        if (Gameboard.getAvailableMoves().length === 0) {
            return true;
        } else {
            // Else the game hasn't finished
            return false;
        }
    }

    const playRound = function () {
        console.log(`${Gameboard.turnPlayer()}, it's your turn.`);

        // Prompt the user continuosly for the move in a valid format
        while (true) {
            playerMove = prompt("Please input your move in following format: 1,2").split(",").map(stringNumber => parseInt(stringNumber));
            if (playerMove.length === 2) {
                break;
            }

            console.log("This move doesn't exist. Make sure to respect the format - '0,0', '1,0'...");
        }

        // Show the board result of the round
        console.clear();
        Gameboard.makeMove(playerMove);
        console.table(Gameboard.board);
    };

    const playGame = function () {
        // While the game isn't done, play a round
        while (!isGameOver()) {
            playRound();
        }

        const playerIcons = ["X", "O"];

        // If there is a winner, announce him, else it's a tie
        // The isGameOver() function returns a winner if existing
        if (playerIcons.includes(isGameOver())) {
            console.log(`The winner is ${isGameOver()}!`);
        } else {
            console.log("It's a tie.");
        }
    };

    return {newGame};
})();

const displayController = (function () {
    const gameDisplay = document.querySelector(".game-display");

    const render = function () {
        // Clear the current display
        gameDisplay.innerHTML = "";

        // Print every field
        for (const row of Gameboard.board) {
            for (const field of row) {
                const newFieldDiv = document.createElement("div");

                if (field !== "EMPTY") {
                    newFieldDiv.textContent = field;
                }

                gameDisplay.appendChild(newFieldDiv);
            }
        }
    };

    return {render};
})();