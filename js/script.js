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

    const makeMove = function (move) {
        // Check if the move is legal
        if (move.length === 2 && move[0] >= 0 && move[0] <= 2 && move[1] >= 0 && move[1] <= 2) {
            // If the move hasn't been played, make it, else tell them to pick another
            if (board[move[0]][move[1]] === "EMPTY") {
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

    return {board, turnPlayer, makeMove, clearBoard};
})();