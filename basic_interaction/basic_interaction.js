//Define the function
function hashtagMtn(mtnTop) {
	var hash = "#";

	for (var i = 0; i < mtnTop; i++) {
	  console.log(hash);
	  hash += "#";
	}
}

//Call the function
// hashtagMtn(10);

//Define the function
function fizzBuzz(totalNum) {
	for (var i = 0; i < totalNum; i++) {

		if (((i % 3) == 0) && ((i % 5) == 0)) {
			console.log("FizzBuzz");
		}

		else if ((i % 3) == 0) {
			console.log("Fizz");
		}

		else if ((i % 5) == 0) {
			console.log("Buzz");
		}

		else {
			console.log(i);
		}
	}
}

//Call the function
// fizzBuzz(100);

//Define the function
function makeBoard(rows, cols) {
	var string = "";

	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {

			if ((i + j) % 2 == 0) {
				string += "#";
			}

			else {
				string += " ";
			}
		}

		string += "\n";
		string += "<br>";
	}

	//console.log(string);
	return string;
}


//Call the function
var myChessBoard = makeBoard(10, 20);

//PURE JAVASCRIPT

// // var chessBoard = document.getElementById("chessBoard");
// // chessBoard.innerHTML = myChessBoard;

// var myBoardContainer = document.createElement("div");
// myBoardContainer.id = "myBoardContainer";
// myBoardContainer.innerHTML = myChessBoard;
// chessBoard.appendChild(myBoardContainer);

//JQUERY

// window.onload = function() {

// 	console.log("Loaded!");
// 	$("#chessBoard").html(myChessBoard);
// }

// console.log("Not loaded yet!");

function notify() {
	console.log("You clicked me!");
}

$(document).ready(function() {
	//Write my events

	console.log("Loaded!");
	// $("#chessBoard").html(myChessBoard);
	// $("#chessBoard").addClass("myChessBoardStyle");

	//JAVASCRIPT

	// document.getElementById("chessBoardButton").addEventListener('click', function() {
	// notify();
	// $("#chessBoard").append(myChessBoard);
	// $("#chessBoard").addClass("myChessBoardStyle");

	// }, false);

	//JQUERY

	$("#chessBoardButton").click(function() {
		// notify();
		// $("#chessBoard").append(myChessBoard);
		// $("#chessBoard").addClass("myChessBoardStyle");

		$("#searchTerm").html('');
		$("#searchResults").html('');

		var inputTerm = $("#inputBox").val();
		getData(inputTerm);

	});

});

console.log("Not loaded yet!");

function getData(curSearchTerm) {
	//Write AJAX code

		var myURL = "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";
		var searchTerm = curSearchTerm;

		$.ajax({
			url: myURL + searchTerm,
			type: 'GET',
			dataType: 'jsonp',
			error: function(msg) {
				console.log(msg);
			},
			success: function(data) {
				console.log("It worked!");
				console.log(data);

				console.log(data[0]);

				var mySearchTerm = data[0];
				$("#searchTerm").html(mySearchTerm);

				console.log(data[1]);
				var searchResults = data[1];
				for (var i = 0; i < searchResults.length; i++) {
					$("#searchResults").append("<p>" + searchResults[i] + "</p>");
				}
			}

		});
}






