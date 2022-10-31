const c = require("./connectmoji.js");
const readlineSync = require("readline-sync");
const clear = require("clear");

const moveString = process.argv[2];
let moves;
let board;
let numConsecutive;
let players;
let player1;
let player2;
let currentPlayer;
let game;

if (moveString != undefined) {
	moves = moveString.split(",");
	board = c.generateBoard(moves[2], moves[3]);
	numConsecutive = moves[4];
	result = c.autoplay(board, moves[1], moves[4]);
	readlineSync.question("Press <ENTER> to start your game");
	console.log(c.boardToString(result.board));

	if (result.winner != undefined) {
	    console.log("Winner is " + result.winner);
	    return;
	}
	board = result.board;
	information = Array.from(moves[1]);
	players = [information[0], information[1]];
	player1 = information[0];
	player2 = information[1];
	if (currentPlayer == player1) {
	    currentPlayer = player2;
	}
	else {
		currentPlayer = player1;
	}
	while (true) {
	    let column;
	    let moveSpace = null;
	    while (moveSpace == null) {
	        if (c.getAvailableColumns(board).length == 0) {
	            console.log("No winner. So sad 😭");
	            return;
	        }
	        if (currentPlayer == player1) {
	            column = readlineSync.question("Choose a column letter to drop your piece in\n>");
	        } 

	        else {
	            readlineSync.question("Press <ENTER> to see computer move");
	            let columns = c.getAvailableColumns(board);
	            column = columns[Math.floor(Math.random() * columns.length)];
	        }
	        moveSpace = c.getEmptyRowCol(board, column);
	        if (moveSpace == null) {
	            console.log("Oops, that is not a valid move, try again!");
	        }
	    }
	    console.log("...dropping in column " + column);
	    board = c.setCell(board, moveSpace.row, moveSpace.col, currentPlayer);
	    console.log(c.boardToString(board));
	    if (c.hasConsecutiveValues(board, moveSpace.row, moveSpace.col, numConsecutive)) {
	        console.log("Winner is " + currentPlayer);
	        return; 
	    }
	    if (currentPlayer == player1) {
	        currentPlayer = player2;
	    }
	    else {
	    	currentPlayer = player1;
	    }
	}
}

else {
	game = readlineSync.question("Enter the number of rows, columns, and consecutive 'pieces' for win (all separated by commas... for example: 6,7,4)\n>").split(",");
	board = c.generateBoard(game[0], game[1]);
	numConsecutive = game[2];
	console.log("Using row, col and consecutive: " + board.rows + " " + board.cols + " " + numConsecutive + "\n");
	players = readlineSync.question("Enter two characters that represent the player and computer (separated by a comma... for example: P,C)\n>").split(",");
	player1 = players[0];
	player2 = players[1];
	currentPlayer = player1;
	console.log("Using player and computer characters: " + players[0] + " " + players[1] + "\n");
	let firstPlayer = readlineSync.question("Who goes first, (P)layer or (C)omputer?\n>");
	if (firstPlayer == "P") {
		console.log("Player is going first");
	} 
	else {
		console.log("Computer is going first");
	    if (currentPlayer == player1) {
	        currentPlayer = player2;
	    }
	    else {
	    	currentPlayer = player1;
	    }
	}
	readlineSync.question("Press <ENTER> to start your game");
	console.log(c.boardToString(board));

    while (true) {
	    let column;
	    let moveSpace = null;
	    while (moveSpace == null) {
	        if (c.getAvailableColumns(board).length == 0) {
	            console.log("No winner. So sad 😭");
	            return;
	        }
	        if (currentPlayer == player1) {
	            column = readlineSync.question("Choose a column letter to drop your piece in\n>");
	        } 

	        else {
	            readlineSync.question("Press <ENTER> to see computer move");
	            let columns = c.getAvailableColumns(board);
	            column = columns[Math.floor(Math.random() * columns.length)];
	        }
	        moveSpace = c.getEmptyRowCol(board, column);
	        if (moveSpace == null) {
	            console.log("Oops, that is not a valid move, try again!");
	        }
	    }
	    console.log("...dropping in column " + column);
	    board = c.setCell(board, moveSpace.row, moveSpace.col, currentPlayer);
	    console.log(c.boardToString(board));
	    if (c.hasConsecutiveValues(board, moveSpace.row, moveSpace.col, numConsecutive)) {
	        console.log("Winner is " + currentPlayer);
	        return; 
	    }
	    if (currentPlayer == player1) {
	        currentPlayer = player2;
	    }
	    else {
	    	currentPlayer = player1;
	    }
	}
}

