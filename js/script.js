const Player = function (name, icon) {
    if (icon !== "X" && icon !== "O") {
        throw new Error("Please choose a valid icon. Either 'X' or 'O'.");
    } else {
        return {name, icon};
    }
};

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
            return window.playerO;
        } else {
            return window.playerX;
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
            if (getAvailableMoves().some(availableMove => availableMove[0] === move[0] && availableMove[1] === move[1])) {
                board[move[0]][move[1]] = turnPlayer().icon;
                displayController.render();
            } else {
                alert("That move has already been played. Pick another one.");
            }
        } else {
            alert("Out of bounds move. Please provide a legal one.");
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

    const isGameOver = function () {
        // If there is a winner, return it
        // Check every row and column for 3 in a row
        for (let i = 0; i < 3; i++) {
            if (Gameboard.board[i][0] === Gameboard.board[i][1] && Gameboard.board[i][1] === Gameboard.board[i][2] && Gameboard.board[i][0] !== "EMPTY") {
                return Gameboard.board[i][0];
            } else if (Gameboard.board[0][i] === Gameboard.board[1][i] && Gameboard.board[1][i] === Gameboard.board[2][i]  && Gameboard.board[0][i] !== "EMPTY") {
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

    const playRound = function (playerMove) {
        // Make the move
        Gameboard.makeMove(playerMove);

        // Stop the message from showing up if the game is won.
        if (!isGameOver()) {
            alert(`${Gameboard.turnPlayer().name}, it's your turn.`);

        }
    };

    const playGame = function () {
        // Initiate the start of a new game
        Gameboard.clearBoard();
        displayController.render();
        alert("Starting new game...");
        alert(`${window.playerO.name} goes first.`);

        gameDisplay.addEventListener("click", function roundHandler(event) {
            event.stopPropagation();
            playRound(event.target.dataAttribute.split(",").map(stringNumber => parseInt(stringNumber)));

            if (isGameOver()) {
                gameDisplay.removeEventListener("click", roundHandler);
                const playerIcons = ["X", "O"];

                // If there is a winner, announce him, else it's a tie
                // The isGameOver() function returns a winner if existing
                const winnerAnnouncementDiv = document.querySelector(".winner-announcement");
                if (playerIcons.includes(isGameOver())) {
                    let winner;
                    if (isGameOver() === "O") {
                        winner = window.playerO;
                    } else {
                        winner = window.playerX;
                    }
                    winnerAnnouncementDiv.textContent = `The winner is ${winner.name}!`;
                    alert(`The winner is ${winner.name}!`);
                } else {
                    winnerAnnouncementDiv.textContent = "It's a tie.";
                    alert("It's a tie.");
                }
            }
        });
    };

    return {playGame, playRound, isGameOver};
})();

const gameDisplay = document.querySelector(".game-display");

const displayController = (function () {
    const render = function () {
        // Clear the current display
        gameDisplay.innerHTML = "";

        // Print every field
        for (let i = 0; i < Gameboard.board.length; i++) {
            for (let j = 0; j < Gameboard.board[i].length; j++) {
                const newFieldDiv = document.createElement("div");
                newFieldDiv.dataAttribute = `${i},${j}`;

                if (Gameboard.board[i][j] !== "EMPTY") {
                    newFieldDiv.textContent = Gameboard.board[i][j];
                }

                gameDisplay.appendChild(newFieldDiv);
            }
        }
    };

    return {render};
})();

// When the new game button is clicked, prompt the users for names
startGameModal = document.querySelector(".start-game-modal");
const modalForm = document.querySelector(".start-game-modal > form");
const newGameButton = document.querySelector(".new-game-btn");
newGameButton.addEventListener("click", () => {
    startGameModal.showModal();
});

// Allow users to close the modal
closeModalBtn = startGameModal.querySelector(".close-modal-btn");
closeModalBtn.addEventListener("click", () => {
    modalForm.reset();
    startGameModal.close();
});


const startGameButton = document.querySelector(".start-game-btn");
startGameButton.addEventListener("click", (event) => {
    // Clear the result announcement of the last round
    const winnerAnnouncementDiv = document.querySelector(".winner-announcement");
    winnerAnnouncementDiv.textContent = "";

    // Stop the form from submitting and capture input for names
    event.preventDefault();
    window.playerO = Player(modalForm.querySelector("#playerOName").value, "O");
    window.playerX = Player(modalForm.querySelector("#playerXName").value, "X");

    // Clear the form for future use and start the game
    modalForm.reset();
    startGameModal.close();
    gameDisplay.style.visibility = "visible";
    Game.playGame();
});

