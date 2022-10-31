const readlineSync = require('readline-sync');
const wcwidth = require('wcwidth');
const clear = require('clear');

function generateBoard(rows, cols, fill) {
	let data = new Array(rows*cols);
	if (fill == undefined){
		data.fill(null);
	}
	else {
		data.fill(fill);
	}
	var board = {
		data: data,
		rows: rows,
		cols: cols
	}
	return board;
}

function rowColToIndex(board, row, col) {
	return board.cols * row + col;
}

function indexToRowCol(board, i) {
	var rowCol = {
		row: Math.floor(i / board.rows),
		col: i % board.rows
	}
	return rowCol;
}

function setCell(board, row, col, value) {
	let index = rowColToIndex(board, row, col);
	let boardCopy = board.data.slice();
	boardCopy[index] = value;
	var board = {
		data: boardCopy,
		rows: board.rows,
		cols: board.cols,
	}
	return board;
}

function setCells(board, ...args) {
	let boardCopy = board;
	for (move of args) {
	    boardCopy = setCell(boardCopy, move.row, move.col, move.val);
	}
	return boardCopy;
}

function getWidest (board) {
	let widest = 0;
	for (let r = 0; r < board.rows; r++) {
	    for (let c = 0; c < board.cols; c++) {
	        let currentEmoji = board.data[rowColToIndex(board, r, c)];
	        if (wcwidth(currentEmoji) > widest) {
	        	widest = wcwidth(currentEmoji);
	    	}
	    }
	}
	return widest;
}

function getNumSpaces(num) {
	let spaces = "";
	for (let i = num; i > 0; i--) {
		spaces += " ";
	}
	return spaces;
}

function topBoardToString (board, widest) {
	const row = board.rows;
	const col = board.cols;
	let boardString = "";
	for (let r = 0; r < row; r++) {
	    for (let c = 0; c < col; c++) {
	        let currentEmoji = board.data[rowColToIndex(board, r, c)];
	        if (currentEmoji == null) {
	            currentEmoji = getNumSpaces(widest);
	            boardString += ("| " + currentEmoji + " ");
	        }
	        else if (wcwidth('currentEmoji') == widest) {
	            boardString += ("| " + currentEmoji + " ");
	        }
	        else {
	        	let currentEmojiWidth = wcwidth(currentEmoji);
	        	let widestWidth = widest + 2;
	            boardString += ("| " + currentEmoji + getNumSpaces(widestWidth - currentEmojiWidth - 1));
	        }
	    }
	    boardString += "|\n";
	}
	return boardString;
}

function makeDivider (widest) {
	let divider = "--";
	for (let i = widest; i > 0; i--) {
		divider += "-";
	}
	return divider;
}

function boardToString(board) {
	const row = board.rows;
	const col = board.cols;
	const widest = getWidest(board);
	let boardString = "";
	let divider = makeDivider(widest);
	let label = 'A';

	boardString = topBoardToString(board, widest);
	boardString += "|" + divider;

	for (let i = 0; i < col-1; i++) {
	    boardString += "+" + divider;
	}
	boardString += "|\n";
	for (let i = 0; i < col; i++) {
	    boardString += "| " + label + getNumSpaces(widest);
	    label = String.fromCharCode(label.charCodeAt(0) + 1);
	}
	boardString += "|";
	return boardString;
}

function letterToCol(letter) {
	if (letter.charCodeAt(0) < 'A'.charCodeAt(0) || letter.charCodeAt(0) > 'Z'.charCodeAt(0) || letter.length > 1) {
	    return null;
	}
	let col = letter.charCodeAt(0) - 'A'.charCodeAt(0);
	return col;
}

function getEmptyRowCol(board, letter, empty) {	
	let emptyRowCol = null;
	let col = letterToCol(letter);
	let r;

	if (col == null || col > board.cols - 1 || board.data[rowColToIndex(board, 0, col)] !== null) {
	    return null;
	}
	for (r = 0; r < board.rows; r++) {
	    if (board.data[rowColToIndex(board, r, col)] != null)
	        break;
	}
	emptyRowCol = {row: r - 1, col: col};
	return emptyRowCol;
}

function colToLetter(col) {
	let letter = String.fromCharCode(65+col)
	return letter;
}

function getAvailableColumns(board) {
	let availableColumns = [];
	for (let c = 0; c < board.cols; c++) {
		col = colToLetter(c);
		if (getEmptyRowCol(board, col) !== null) {
			availableColumns.push(col);
		}
	}
	return availableColumns;
}

function hasConsecutiveValues(board, row, col, n) {
	const value = board.data[rowColToIndex(board, row, col)];
	let r = row;
	let c = col;

	let vertical = 1;
	r = row;
	while (r > 0) {
	    if (board.data[rowColToIndex(board, r-1, col)] == board.data[rowColToIndex(board, r, col)] && board.data[rowColToIndex(board, r, col)] == value) {
	        vertical++;
	        if (vertical == n) {
	            return true;
	        }
	    }
	    r--;
	}
	r = row;
	while (r < board.rows) {
	    if (board.data[rowColToIndex(board, r+1, col)] == board.data[rowColToIndex(board, r, col)] && board.data[rowColToIndex(board, r, col)] == value) {
	        vertical++;
	        if (vertical == n) {
	            return true;
	        }
	    }
	    r++;
	}

	let horizontal = 1;
	c = col;
	while (c > 0) {
	    if (board.data[rowColToIndex(board, row, c-1)] == board.data[rowColToIndex(board, row, c)] && board.data[rowColToIndex(board, row, c)] == value) {
	        horizontal++;
	        if (horizontal == n) {
	            return true;
	        }
	    }
	    c--;
	}
	c = col;
	while (c < board.cols) {
	    if (board.data[rowColToIndex(board, row, c+1)] == board.data[rowColToIndex(board, row, c)] && board.data[rowColToIndex(board, row, c)] == value) {
	        horizontal++;
	        if (horizontal == n) {
	            return true;
	        }
	    }
	    c++;
	}  

	let majorDiagonal = 1;
	r = row;
	c = col;
	while (r > 0 && c > 0) {
	    if (board.data[rowColToIndex(board, r-1, c-1)] == board.data[rowColToIndex(board, r, c)] && board.data[rowColToIndex(board, r, c)] == value) {
	        majorDiagonal++;
	        if (majorDiagonal == n) {
	            return true;
	        }
	    }
	    r--;
	    c--;
	}
	r = row;
	c = col;
	while (r < board.rows && c < board.cols) {
	    if (board.data[rowColToIndex(board, r+1, c+1)] == board.data[rowColToIndex(board, r, c)] && board.data[rowColToIndex(board, r, c)] == value) {
	        majorDiagonal++;
	        if (majorDiagonal == n) {
	            return true;
	        }
	    }
	    r++;
	    c++;
	}

	let minorDiagonal = 1;
	r = row;
	c = col;
	while (r !== 0 && c !== board.cols) {
	    if (board.data[rowColToIndex(board, r-1, c+1)] == board.data[rowColToIndex(board, r, c)] && board.data[rowColToIndex(board, r, c)] == value) {
	        minorDiagonal++;
	        if (minorDiagonal == n) {
	            return true;
	        }
	    }
	    r--;
	    c++;
	}

	r = row;
	c = col;
	while (r !== board.rows && c !== 0) {
	    if (board.data[rowColToIndex(board, r+1, c-1)] == board.data[rowColToIndex(board, r, c)] && board.data[rowColToIndex(board, r, c)] == value) {
	        minorDiagonal++;
	        if (minorDiagonal == 1) {
	            return true;
	        }
	    }
	    r++;
	    c--;
	}
	return false;
}

function autoplay(board, s, numConsecutive) {
	const information = Array.from(s);
	var player1 = information[0];
	var player2 = information[1];
	const players = [player1, player2];
	let moves = information.slice(2);
	var lastPiece = player1;
	var nextPiece = player2;
	var temp = null;
	let num = 0;
	let i = 0;
	let move = null;

	while (i < moves.length) {
	    num++;
	    move = getEmptyRowCol(board, moves[i]);
	    if (move == null) {
	        return {
	            board: null,
	            pieces: players,
	            lastPieceMoved: lastPiece,
	            error: {num: num, val: lastPiece, col: moves[i]}
	        };
	    }
		board = setCell(board, move.row, move.col, lastPiece);
		temp = lastPiece;
		lastPiece = nextPiece;
		nextPiece = temp;
	    i++;
	    if (hasConsecutiveValues(board, move.row, move.col, numConsecutive) == true) {
	        if (i < moves.length) {
	        	num++;
	            return {
	                board: null,
	                pieces: players,
	                lastPieceMoved: lastPiece,
	                error: {num: num, val: lastPiece, col: moves[i]},
	            };
	        }
	        else {         	
				temp = lastPiece;
				lastPiece = nextPiece;
				nextPiece = temp;
		        return {
		            board: board,
		            pieces: players,
		            lastPieceMoved: lastPiece,
		            winner: lastPiece,
		        };
	    	}
	    }
	}

	temp = lastPiece;
	lastPiece = nextPiece;
	nextPiece = temp;

	return {
	    board: board,
	    pieces: players,
	    lastPieceMoved: lastPiece,
	};
}

module.exports = {
	generateBoard: generateBoard,
	rowColToIndex: rowColToIndex,
	indexToRowCol: indexToRowCol,
	setCell: setCell,
	setCells: setCells,
	boardToString: boardToString,
	letterToCol: letterToCol,
	getEmptyRowCol: getEmptyRowCol,
	getAvailableColumns: getAvailableColumns,
	hasConsecutiveValues: hasConsecutiveValues,
	autoplay: autoplay
}
