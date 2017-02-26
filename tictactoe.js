/* ---------------------------------------------------------
// TICTACTOE.JS
// This is a simple JavaScript Tic Tac Toe game that's 
// played in the browser console. Human input is received
// using alert prompts.
// -------------------------------------------------------*/


/* ---------------------------------------------------------
// GLOBAL VARIABLES
// -------------------------------------------------------*/


// board is an object that holds the current state of each cell in the "value" 
// property. I could have made it a simple 9-value array instead of an object
// so that I would be able to add additional properties later on when I add
// the computer as a player. I envision adding a property -- something like
// "linesQty" -- that would indicate how many lines a given cell intersects.
var board = {
	"1": {
		"value": null,
	},
	"2": {
		"value": null,
	},
	"3": {
		"value": null,
	},
	"4": {
		"value": null,
	},
	"5": {
		"value": null,
	},
	"6": {
		"value": null,
	},
	"7": {
		"value": null,
	},
	"8": {
		"value": null,
	},
	"9": {
		"value": null,
	}
};

// player is a variable that tracks the current player: Player X or Player O.
// When I add the computer as a player, player O could always be the computer player.
// Initially, player is assigned a random value of "X" or "O".
var player = randomStartingPlayer();

// nineMoves is a variable that tracks how many moves have been played.
var nineMoves = 0;

// winnerMessage is a variable that contains a message to the winner, after a winning move has been played.
var winnerMessage = false;


/* ---------------------------------------------------------
// PROGRAM CORE
// -------------------------------------------------------*/


// Run the unit tests (at the bottom of this program) and display which are failing, or if all are passing.
runUnitTests();

// Display the instructions and opening conditions of the game to the user.
openTheGame();

// The core of the program repeats the sequence of 1) find out which cell the player wants to play
// 2) write that choice to board 3) display the updated board 4) incrememt nineMoves 5) check if there's
// a winner and 6) switch to the next player.
// The program exits from the while loop if any of these conditions are true: a winning move has been
// played, nine moves have been played, or an error is received from testValidCell (if the user presses
// "Q" to quit the game).
while (nineMoves < 9 && winnerMessage === false) {
	// Try to get user input. If an error is received (thrown by testValidCell), quit the game.
	try {
		// Find out which cell the current player wants to play by calling getUserInput and passing it the current player.
		// The core program never receives an invalid cell choice, because getUserInput only returns valid cell choices.
		var cellToPlace = getUserInput(player);
		// Set the value property of the board cell to "X" or "O" (the value of player variable).
		board[cellToPlace]["value"] = player;
		// Incrememnt nineMoves, as a move has been played.
		nineMoves++;
		// Thank player and display the current board.
		console.log("Thanks for your move, Player " + player + ". (move #" + nineMoves + ")\n\n" + formatBoardForDisplay());
		// Check whether a winning move has been played. If not, checkForWinner keeps winnerMessage set to false.
		winnerMessage = checkForWinner(player);
		// Switch to the next player.
		player = switchToNextPlayer(player);
	}
	// If an error is received (expected to only be from testValidCell when a user wants to quit the game),
	// set winnerMessage to the error message so that it will be displayed below.
	// Increase nineMoves to 9 in order to exit the while loop.
	catch(error) {
		winnerMessage = error;
		nineMoves = 9;
	}
}
// If winnerMessage is still false then it means that there was no winner, so set winnerMessage to tie message.
if (winnerMessage === false) winnerMessage = "This game ended in a tie.";
// winnerMessage has a value under all circumstances, so display it.
console.log(winnerMessage);

// The core program ends here. Everything below is helper functions and unit tests.


/* ---------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------*/


// openTheGame displays the instructions and starting conditions of the game.
// This function does not have any unit tests because it is simply a series of console.log calls.
function openTheGame() {
	// Display the instructions for the game.
	console.log("\n\nInstructions for Play:\n======================\nNumbers denote unfilled cells. Xs and Os denote cells that have already been played.");

	// Display the starting board.
	console.log(formatBoardForDisplay());

	// Display the starting player: Player X or Player O.
	console.log("The starting player is Player " + player + ".\n\n");	
}

// displayBoard formats the board for display as a string that's ready for console logging.
// Numbers denote unfilled cells, Xs and Os denote cells filled in by the X or O player.
function formatBoardForDisplay() {
	// formattedBoard holds the formatted board as a string with spaces separating cells and \n separating rows.
	var formattedBoard = "";
	// Loop through the 9 cells in the board.
	for (var i = 1; i <= 9; i++) {
		// Hold the value of the cell in cellValue.
		var cellValue = board[i]["value"];
		// If cell value is null, display the cell's number and a space.
		if (cellValue === null) {
			formattedBoard += i + " ";
		// Otherwise, display the cell's value ("X" or "O") and a space.
		} else {
			formattedBoard += cellValue + " ";
		}
		// After each three cells, insert a new-line character ("\n").
		if (i === 3 || i === 6 || i === 9) {
			formattedBoard += "\n";
		}
	}
	return formattedBoard;
}

// randomStartingPlayer returns "X" or "O", chosen at random
function randomStartingPlayer() {
	// Generate a random number that is either 0 or 1.
	var randomNumber = Math.round(Math.random());
	// If the number is 0, return "O".
	if (randomNumber === 0) return "O";
	// Otherwise, return "X".
	return "X";
}

// getUserInput accepts a player ("X" or "O") and gets and returns the numbered cell which that player wants to move in.
// NOTE: getUserInput is not covered by a unit test as I could think of a way to test it given its use of the prompt function.
// getUserInput does not handle "Q" (the quit command) from a user -- that is handled by testValidCell.
function getUserInput(player) {
	// messageToPlayer holds the message that will be displayed to the player using the prompt function.
	var messageToPlayer = "Player " + player + ", which numbered cell do you want to make an '" + player + "' in?\n\nEnter 'Q' to quit the game.";
	// validFlag tracks if a valid cell has been chosen.
	var validFlag = false;
	// This while loop keeps repeating until the player picks a valid cell (until validFlag becomes true).
	while (!validFlag) {
		// Prompt the user using the message stored in messageToPlayer and store the response in inputtedValue.
		var inputtedValue = prompt(messageToPlayer);
		// Call testValidCell to test that inputtedValue refers to a valid cell.
		// If it does, set validFlag to true so that the function will exit the while loop.
		if (testValidCell(inputtedValue)) validFlag = true;
	}
	return inputtedValue;
}

// testValidCell tests two things: whether the user entered "Q" to quit the game, and whether the user's response is a valid cell choice.
function testValidCell(inputtedValue) {
	// Check if the user entered "q" or "Q" to quit the game and, if so, throw an error.
	// However, first the inputtedValue must be tested if it's a string, because you can't use toLowerCase() method on null.
	if (typeof inputtedValue === 'string' || inputtedValue instanceof String) {  // Hat tip to http://stackoverflow.com/a/9436948 for the logical test on this line.
		if (inputtedValue.toLowerCase() === "q") throw "You have quit the game. Goodbye."
	}
	// If inputtedValue is not a string between "1" and "9" log an error message and return false.
	if (["1","2","3","4","5","6","7","8","9"].indexOf(inputtedValue) === -1) {
		console.log("Sorry, please pick one of the numbered cells.");
		return false;
	}
	// If inputtedValues refers to a cell that has already been played log an error message and return false.
	if (board[inputtedValue]["value"] !== null) {
		console.log("Sorry, that cell has already been played.");
		return false;
	}
	return true;
}

// switchToNextPlayer returns "X" if given "O" and "O" if given "X"
function switchToNextPlayer(player) {
	if (player === "X") return "O";
	return "X";
}

// checkForWinner tests whether either player has won, by checking whether there are three "X"s or three "O"s in any line.
function checkForWinner(player) {
	// lines variable contains the 8 different three-cell lines which are the 8 ways to win a Tic Tac Toe game.
	var lines = [
					["1","2","3"],	// The first horizontal line
					["4","5","6"],	// The second horizontal line
					["7","8","9"],	// The third horizontal line
					["1","4","7"],	// The first vertical line
					["2","5","8"],	// The second vertical line
					["3","6","9"],	// The third vertical line
					["1","5","9"],	// The upper-left to bottom-right diagonal line
					["3","5","7"]	// The upper-right to bottom-left diagonal line
				];
	// Loop through each of the 8 possible ways to win in the lines variable.
	for (linesCounter = 0; linesCounter < lines.length; linesCounter++) {
		// Set linesPosition0, linePosition1 and linePosition2 to equal the values on board for each of those positions.
		// For example, if "X"s were played in cells "1", "2", and "3", then on the first iteration of this for loop, all three linesPosition variables would equal "X".
		var linesPosition0 = board[lines[linesCounter][0]]["value"];
		var linesPosition1 = board[lines[linesCounter][1]]["value"];
		var linesPosition2 = board[lines[linesCounter][2]]["value"];
		// Check whether the three linesPosition variables all have the values "X" or "O".
		if ((linesPosition0 === "X" && linesPosition1 === "X" && linesPosition2 === "X") || (linesPosition0 === "O" && linesPosition1 === "O" && linesPosition2 === "O")) {
			// If they do (i.e. a winning move was played), then set winnerMessageStr to the winning message.
			var winnerMessageStr = "Congratulations, Player " + player + "! You won with " + player + "s in the following numbered cells: " + lines[linesCounter][0] + ", " + lines[linesCounter][1] + ", and " + lines[linesCounter][2] + ".";
			// Return winnerMessageStr (which will be displayed by the core program). 
			return winnerMessageStr;
		}
	}
	// If no winning move was played, then return false.
	return false;
}


/* ---------------------------------------------------------
// UNIT TESTS
// -------------------------------------------------------*/


// runUnitTests runs all of the unit tests and reports if any failed.
// It is called at the top of this program so that errors are detected at the beginning.
// Design decisions: place runUnitTests at bottom of program for clarity.
function runUnitTests() {

	// unitTests is an object that holds all of the unit tests. I used an object so that all the tests can be run by using a for-in loop.
	// All of the functions in unitTests are named after the functions that they test. For example, testFormatBoardForDisplay tests formatBoardForDisplay.
	var unitTests = {

		testFormatBoardForDisplay: function() {
			// Set the board to a set of test values.
			board = {
				"1": {
					"value": "X",
				},
				"2": {
					"value": "O",
				},
				"3": {
					"value": null,
				},
				"4": {
					"value": null,
				},
				"5": {
					"value":"O",
				},
				"6": {
					"value": null,
				},
				"7": {
					"value": "X",
				},
				"8": {
					"value": null,
				},
				"9": {
					"value": null,
				}
			};
			var testResult = formatBoardForDisplay();
			var countX = 0;
			var countO = 0;
			var countLineBreak = 0;
			var countSpace = 0;
			// Count the characters in the testResult string and make sure that it contains the following:
			// "X": <= 5
			// "O": <= 5
			// "\n": 3
			// space: 9
			for (var i = 0; i <= testResult.length; i++) {
				var characterValue = testResult.charAt(i);
				if (characterValue === "X") countX++;
				if (characterValue === "O") countO++;
				if (characterValue === "\n") countLineBreak++;
				if (characterValue === " ") countSpace++;
			}
			if (countX <= 5 && countO <= 5 && countLineBreak === 3 && countSpace === 9) return true;
			return false;
		},

		// There is a 0.003% chance (i.e. less than one in 10,000) that this unit test will incorrectly return false (i.e. report failing code) 
		// when randomStartingPlayer is actually working correctly.
		testRandomStartingPlayer: function() {
			var countX = 0;
			var countO = 0;
			var countErrors = 0;
			// Run randomStartingPlayer 15 times and count the number of times it returns "X", "O", or any other value.
			for (var i = 0; i < 15; i++) {
				var testResult = randomStartingPlayer();
				if (testResult === "X") countX++;
				else if (testResult === "O") countO++;
				else countErrors++;
			}
			// If there was at least 1 "X" and 1 "O" returned and no other values returned, then the test passes. 
			// This test will incorrectly fail less than 1 in 10,000 times due to the rare possibility that randomStartingPlayer
			// will randomly return 15 "X"s or 15 "O"s.
			if (countErrors === 0 && countX >= 1 && countO >= 1) {
				return true;
			} else {
				console.log("countErrors:",countErrors,"countO:",countO,"countX:",countX);
				return false;
			}
		},

		// I could not think of a way to test getUserInput, so I'm just leaving this here as a placeholder to show that it's not actually tested.
		testGetUserInput: function() {
			return true;
		},

		testTestValidCell: function() {
			// Set test values on board.
			board = {
				"1": {
					"value": "X",
				},
				"2": {
					"value": null
				}
			};
			// Test that "Q" throws an error, if it doesn't throw that error message then return false.
			try {
				testValidCell("q");
			}
			catch(error) {
				if (error !== "You have quit the game. Goodbye.") return false;
			}
			// Test for invalid inputted values: null, "e", "0", "10", and "1" when the "1" cell has been played.
			// Test for valid inputted values: "2" when the "2" cell has not been played.
			// testValidCell should return false for the invalid values and true for the valid value.
			// The JavaScript prompt command only returns null or string values, so do not need to test number values.
			//
			// Before running this test, disable console.log so that the messages don't show up in the console during testing.
			disableConsoleLog();
			// Okay, here's the actual test:
			if (!testValidCell(null) && !testValidCell("e") && !testValidCell("0") && !testValidCell("10") && !testValidCell("1") && testValidCell("2")) {
				// Reenable console.log before the return statement.
				enableConsoleLog();
				return true;
			}
			// Reenable console.log before the return statement.
			enableConsoleLog();
			return false;
			// disableConsoleLog and enableConsoleLog are two helper functions for testTestValidCell.
			// Hat tip to http://stackoverflow.com/a/1215400 for this approach that I've used.
			var oldConsoleLog = null;
			function disableConsoleLog() {
				oldConsoleLog = console.log;
				window['console']['log'] = function() {};
			}

			function enableConsoleLog() {
				window['console']['log'] = oldConsoleLog;
			}

		},

		testSwitchToNextPlayer: function() {
			if (switchToNextPlayer("X") === "O" && switchToNextPlayer("O") === "X") return true;
			return false;
		},

		testCheckForWinner: function() {
			// Set null test values on board.
			board = {
				"1": {
					"value": null,
				},
				"2": {
					"value": null,
				},
				"3": {
					"value": null,
				},
				"4": {
					"value": null,
				},
				"5": {
					"value": null,
				},
				"6": {
					"value": null,
				},
				"7": {
					"value": null,
				},
				"8": {
					"value": null,
				},
				"9": {
					"value": null,
				}
			};
			// With all nulls, checkForWinner should return false, so if it returns true then the test has failed.
			if (checkForWinner("X") !== false) return false;

			// Set test values on board which should return true.
			board["1"]["value"] = "X";
			board["2"]["value"] = "X";
			board["3"]["value"] = "X";
			// With 3 "X"s in line 123, checkForWinner should return a string beginning with "Congratulations, Player".
			var returnMessage = checkForWinner("X");
			returnMessage = returnMessage.slice(0,25);
			if (returnMessage !== "Congratulations, Player X") return false;

			// Set test values on board which should return true.
			board["2"]["value"] = null;
			board["3"]["value"] = null;
			board["1"]["value"] = "O";
			board["5"]["value"] = "O";
			board["9"]["value"] = "O";
			// With 3 "O"s in line 159, checkForWinner should return a string beginning with "Congratulations, Player".
			var returnMessage = checkForWinner("O");
			returnMessage = returnMessage.slice(0,25);
			if (returnMessage !== "Congratulations, Player O") return false;

			// If we've made it this far, then all of the tests of checkForWinner have passed, so return true.
			return true;
		}
	};

	console.log("Unit Tests Results:\n===================");

	var allTestResults = [];
	// Loop through all of the "test" keys in the unitTests object, which is where the unit test functions are stored.
	for (var test in unitTests) {
		// Call each test and save the result it returns (true or false) in testResult
		var testResult = unitTests[test]();
		// If testResult is false...
		if (!testResult) {
			// ... then push the name of the failing test into the array allTestResults.
			allTestResults.push(test);
		}
	}

	// If the array allTestResults is empty, then there were no test errors.
	if (allTestResults.length === 0) {
		console.log("No errors found.\n\n");
	// Otherwise, if there were errors, display them as a comma-separated list.
	} else {
		console.log("Errors found in these tests:",allTestResults.join(", "),"\n\n");
	}

	// Reset board back to its starting values, as some different values were set during the tests above.
	board["1"]["value"] = null;
	board["2"]["value"] = null;
	board["3"]["value"] = null;
	board["4"]["value"] = null;
	board["5"]["value"] = null;
	board["6"]["value"] = null;
	board["7"]["value"] = null;
	board["8"]["value"] = null;
	board["9"]["value"] = null;
}