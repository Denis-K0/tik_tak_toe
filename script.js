"use strict";

const gameTikTakToe = function() {

    const selector = {
        player01Btn: document.querySelector(".player1Btn"),
        player02Btn: document.querySelector(".player2Btn"),
        bot1Btn: document.querySelector(".bot1Btn"),
        bot2Btn: document.querySelector(".bot2Btn"),
        gameModal: document.querySelector(".gameModal"),
        resultModal: document.querySelector(".resultModal"),
        closeBtn: document.querySelector(".closeBtn"),
        closeBtn02: document.querySelector(".closeBtn02"),
        startGameContainer: document.querySelector(".startGameContainer"),
        startBtn: document.createElement("button"),
        onScreenPlayerName01: document.querySelector(".playerName01"),
        onScreenPlayerName02: document.querySelector(".playerName02"),
        onScreenScore01: document.querySelector(".score01"),
        onScreenScore02: document.querySelector(".score02"),
        grid: document.querySelectorAll(".grid"),
        winnerMsg: document.querySelector(".winnerMsg"),
    }

    // Game-Ui-Settings
    const playerSelectionEvents = function() {
        //Remove the Player String, when User click on the Input & change the Color
        //Remove the Background color from the another selected Selector, like "Bot"
        function playerBtnClick (selector, selector2) {
            if(selector.value === "Player") {
                selector.value = "";
            }
            selector.classList.remove("backgroundGrey");
            selector2.classList.remove("backgroundYellow")
            selector.classList.add("backgroundYellow");
            addStartButton();
        }

        //When User dont typed anything, than the Input will change to default
        function playerBtnBlur (selector) {
            if(selector.value.replace(/\s/g, "") === "") {
                selector.value = "Player";
                selector.classList.remove("backgroundYellow");
                selector.classList.add("backgroundGrey");
                addStartButton();
            }
        }

        //Add Start Button, if 2 Players on both sides are selected, else remove it.
        function addStartButton () {
            if((selector.bot1Btn.classList.contains("backgroundYellow") || selector.player01Btn.classList.contains("backgroundYellow")) && 
            (selector.bot2Btn.classList.contains("backgroundYellow") || selector.player02Btn.classList.contains("backgroundYellow"))) {
                selector.startGameContainer.append(selector.startBtn);
                selector.startBtn.classList.add("startBtn");
                selector.startBtn.innerText = "Start";
                startGameEndGameEvents();
            } else {
                selector.startBtn.remove();
            }
        }

        selector.player01Btn.addEventListener("click", function() {
            playerBtnClick(selector.player01Btn, selector.bot1Btn);
        });
    
        selector.player02Btn.addEventListener("click", function() {
            playerBtnClick(selector.player02Btn, selector.bot2Btn);
        });
    
        selector.player01Btn.addEventListener("blur", function() {
            playerBtnBlur(selector.player01Btn, selector.bot1Btn);
        });
    
        selector.player02Btn.addEventListener("blur", function() {
            playerBtnBlur(selector.player02Btn, selector.bot2Btn);
        });

        selector.bot1Btn.addEventListener("click", function() {
            playerBtnClick(selector.bot1Btn, selector.player01Btn);
        })

        selector.bot2Btn.addEventListener("click", function() {
            playerBtnClick(selector.bot2Btn, selector.player02Btn);
        })
    }
    
    //Starting The Game
    const startGameEndGameEvents = function() {
        selector.startBtn.removeEventListener("click", startGame);        
        selector.startBtn.addEventListener("click", startGame);
    }

    function startGame() {
        selector.gameModal.showModal();
        theGame(selector.player01Btn, selector.player02Btn);    
    }

    //Creating the Player
    function createPlayer(playerSelection) {
        const name = playerSelection.classList.contains("backgroundYellow") ? playerSelection.value : 
                     playerSelection.classList.contains("player1Btn") ? "Bot No.1" : "Bot No.2";
        const points = 0;
        return {
            name,
            points,
        }
    }

    //The main Game
    function theGame(playerSelection, playerSelection02) {
        const gameParameters = {
            player01: createPlayer(playerSelection),
            player02: createPlayer(playerSelection02),
            turn: 1,
            round: 1,
            gameBoard: [],
            winningCombinations:[   [0, 1, 2], [3, 4, 5], [6, 7, 8],
                                    [0, 3, 6], [1, 4, 7], [2, 5, 8],
                                    [0, 4, 8], [2, 4, 6]],
            aiTurn: 0,
        }
        
        function showPointsOnScreen(player01, player02) {
            selector.onScreenPlayerName01.innerText = player01.name;
            selector.onScreenPlayerName02.innerText = player02.name;
            selector.onScreenScore01.innerText = player01.points;
            selector.onScreenScore02.innerText = player02.points;
            console.log(gameParameters.player01, gameParameters.player02);
        }
        showPointsOnScreen(gameParameters.player01, gameParameters.player02);

        function placeXorOShowWhoseTurnIs() {
            if (gameIsOver()) return;
            selector.onScreenPlayerName02.classList.remove("backgroundLightYellow");
            selector.onScreenPlayerName01.classList.add("backgroundLightYellow");
            //The AI does the first turn, when choose
            if((gameParameters.player01.name === "Bot No.1") && (gameParameters.turn === 1) && 
            (gameParameters.player02.name !== "Bot No.2")) {  
                selector.onScreenPlayerName02.classList.remove("backgroundLightYellow");
                selector.onScreenPlayerName01.classList.add("backgroundLightYellow");
                aiChoice();
                gameParameters.aiTurn++;
            }
            //If both Player AI, than AI starts playing
            if (gameParameters.player01.name === "Bot No.1" && gameParameters.player02.name === "Bot No.2") {
                return aiChoice();
                }
            selector.grid.forEach(grid => grid.addEventListener("click", placeXorO, { once: true }));
        } 

        function placeXorO() {
            if(gameParameters.turn % 2 === 0) {
                if (this.innerText !== "") return;
                this.innerText = "O";
                selector.onScreenPlayerName02.classList.remove("backgroundLightYellow");
                selector.onScreenPlayerName01.classList.add("backgroundLightYellow");
                return updateGameboard();
            } else {
                if (this.innerText !== "") return;
                this.innerText = "X";
                selector.onScreenPlayerName01.classList.remove("backgroundLightYellow");
                selector.onScreenPlayerName02.classList.add("backgroundLightYellow");
                return updateGameboard();
            }
        }
        
        function updateGameboard() {
            gameParameters.gameBoard = [];
            selector.grid.forEach(grid => gameParameters.gameBoard.push(grid.textContent));
            console.log(gameParameters.gameBoard);
            return checkWinnerOfRound();
        }

        function checkWinnerOfRound() {
            for(let combination of gameParameters.winningCombinations) {
                if (combination.map(index => gameParameters.gameBoard[index]).toString() === ["X", "X", "X"].toString()) {
                    gameParameters.player01.points++;
                    return gameReset();
                }
                if (combination.map(index => gameParameters.gameBoard[index]).toString() === ["O", "O", "O"].toString()) {
                    gameParameters.player02.points++;
                    return gameReset();
                }
            };
            
            //Unentschieden
            if (!gameParameters.gameBoard.includes("")) {
                gameParameters.turn = 1;
                return gameReset();
            }
            gameParameters.turn++;
            return checkAiIsPlayer();
        }

        function checkAiIsPlayer() {
            if (gameIsOver()) return;
            // If both Player are Ai Bots
            if (gameParameters.player01.name === "Bot No.1" && gameParameters.player02.name === "Bot No.2") {
                return aiChoice();
            }
            if (gameParameters.player01.name === "Bot No.1" || gameParameters.player02.name === "Bot No.2") {
                // Checking that Ai takes only one turn, when only one Player is Ai
                if (gameParameters.aiTurn % 2 === 0) {
                    gameParameters.aiTurn++;
                    return aiChoice();
                } else {
                    gameParameters.aiTurn++;
                    return
                }
            }
        }

        function aiChoice() {
            if (gameIsOver()) return;
            const randomChoice = Math.floor(Math.random() * 9);
            const selectedGrid = selector.grid[randomChoice];

            if(selectedGrid.innerText === "") {
                setTimeout(function() {
                    aiPlaceChoice(selectedGrid);
                }, 250);           
            } else return aiChoice();
        }

        function aiPlaceChoice(selectedGrid) {
            if (gameIsOver()) return;
            if(gameParameters.turn % 2 === 0) { //Checking what Choice Ai should take.
                selectedGrid.innerText = "O"; 
                selector.onScreenPlayerName02.classList.remove("backgroundLightYellow");
                selector.onScreenPlayerName01.classList.add("backgroundLightYellow");
            } else {
                selectedGrid.innerText = "X"; 
                selector.onScreenPlayerName01.classList.remove("backgroundLightYellow");
                selector.onScreenPlayerName02.classList.add("backgroundLightYellow");
            } 
            updateGameboard();  
        }

        function gameReset() {
            gameParameters.turn = 1;
            gameParameters.aiTurn = 0;
            gameParameters.round++;
            console.log(gameParameters.round)
            selector.grid.forEach(grid => grid.innerText = "");
            selector.grid.forEach(grid => grid.removeEventListener("click", placeXorO));
            showPointsOnScreen(gameParameters.player01, gameParameters.player02);
            return checkWinnerOfGame();
        }

        function checkWinnerOfGame() {
            if(gameParameters.player01.points === 3) return showWinningMessage(gameParameters.player01);
            if(gameParameters.player02.points === 3) return showWinningMessage(gameParameters.player02);
            return placeXorOShowWhoseTurnIs(); 
        }

        function showWinningMessage(player) {
            selector.resultModal.showModal();
            selector.closeBtn02.addEventListener("click", () => {
                resetDialog();
                selector.resultModal.close();
                selector.gameModal.close();
            })
            selector.winnerMsg.innerText = player.name;
            console.log("Winner: " + player.name);
            return
        }

        //Add Exit Button to the Dialog, that reset that too.
        selector.closeBtn.addEventListener("click", () => {
            resetDialog();
            selector.gameModal.close();
        });

        function resetDialog() {
            gameParameters.round = 1;
            gameParameters.turn = 1;
            gameParameters.player01.points = 3;
            gameParameters.player02.points = 3;
            gameParameters.aiTurn = 0;
            selector.grid.forEach(grid => grid.innerText = "");
            selector.grid.forEach(grid => grid.removeEventListener("click", placeXorO));
        }

        //Prevent further executions of functions, when the Game has ending.
        function gameIsOver() {
            return gameParameters.player01.points === 3 || gameParameters.player02.points === 3;
        }

        placeXorOShowWhoseTurnIs(); 
    }
    playerSelectionEvents();
}

gameTikTakToe();