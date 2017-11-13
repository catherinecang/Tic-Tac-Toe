//value is value for the player who just played
$(function (){
	var solns;
	var next_board;
	var move;
	var curr_board = '+++++++++';
	
	$(".btn").click(function(){
		index = parseInt($(this)[0].id) - 1;
		if(curr_board[index]==='+'){
			$(this).text('X');
			curr_board = curr_board.substring(0, index) + 'x' + curr_board.substring(index + 1);
			end = checkWin(curr_board);
			if (checkWin(curr_board)!=''){
				$("#result").text("WINNER: " + checkWin(curr_board) + " stop playing");
				console.log(checkWin(curr_board));
			}
			doComputerMove();

		}
	});

	function doComputerMove(){
		$.ajax({
			type: "GET",
			url: 'http://nyc.cs.berkeley.edu:8081/ttt/getNextMoveValues?',
			dataType: 'json',
			data: {board: curr_board},
			async: false,
		}).done(function (resp) {
			$("#current").html("Current Board State: " + curr_board)
			solns = resp;
			var filter = filterRemote(filterValue(resp['response']))
			move = filter['move'];
			$("#one").html("Next Move: " + move);
			next_board = filter['board'];
			$("#two").html("Next Board State: " + next_board);
		});
		var index = parseInt(move)-1
		curr_board = curr_board.substring(0, index) + 'o' + curr_board.substring(index + 1);
		move = "#" + String(move);
		console.log("second board" + curr_board)
		$(move).text('O');
		if (checkWin(curr_board)!=''){
			$("#result").text("WINNER: " + checkWin(curr_board) + " stop playing");
			console.log(checkWin(curr_board));
		}
	}

	function restart(){
		$(".btn").text("");
		curr_board = '+++++++++';
	}

})
function filterRemote(filtered){
	var val = filtered[0]['value']
	var remotes = [];
	for (var i in filtered){
		remotes.push(filtered[i]['remoteness'])
	}
	if (val === 'lose'){
		var min = Math.min.apply(Math, remotes)
		filtered = filtered.filter(function (i){
			return i['remoteness'] == min
		})
	}
	else {
		var max = Math.max.apply(Math, remotes)
		filtered = filtered.filter(function (i){
			return i['remoteness'] == max
		})
	}
	return filtered[0];
}

function filterValue(solns){
	soln_win = solns.filter(function (i){
		return i['value'] != 'win'
	});
	if (soln_win.length != 0){
		solns = soln_win
	}
	soln_tie = solns.filter(function(i){
		return i['value']!= 'tie'
	});
	if (soln_tie.length != 0){
		solns = soln_tie
	}
	return solns

}

function checkWin(curr_board){
	if (
        (curr_board[0] === 'x' && curr_board[1] === 'x' && curr_board[2] === 'x') ||
        (curr_board[3] === 'x' && curr_board[4] === 'x' && curr_board[5] === 'x') ||
        (curr_board[6] === 'x' && curr_board[7] === 'x' && curr_board[8] === 'x') ||
        (curr_board[0] === 'x' && curr_board[3] === 'x' && curr_board[6] === 'x') ||
        (curr_board[1] === 'x' && curr_board[4] === 'x' && curr_board[7] === 'x') ||
        (curr_board[2] === 'x' && curr_board[5] === 'x' && curr_board[8] === 'x') ||
        (curr_board[0] === 'x' && curr_board[4] === 'x' && curr_board[8] === 'x') ||
        (curr_board[2] === 'x' && curr_board[4] === 'x' && curr_board[7] === 'x') 
    ) {
        return 'x';
    } else if (
        (curr_board[0] === 'o' && curr_board[1] === 'o' && curr_board[2] === 'o') ||
        (curr_board[3] === 'o' && curr_board[4] === 'o' && curr_board[5] === 'o') ||
        (curr_board[6] === 'o' && curr_board[7] === 'o' && curr_board[8] === 'o') ||
        (curr_board[0] === 'o' && curr_board[3] === 'o' && curr_board[6] === 'o') ||
        (curr_board[1] === 'o' && curr_board[4] === 'o' && curr_board[7] === 'o') ||
        (curr_board[2] === 'o' && curr_board[5] === 'o' && curr_board[8] === 'o') ||
        (curr_board[0] === 'o' && curr_board[4] === 'o' && curr_board[8] === 'o') ||
        (curr_board[2] === 'o' && curr_board[4] === 'o' && curr_board[7] === 'o') 
    ) {
        return 'o';
    } else if (curr_board.indexOf('+') === -1) {
        return '+';
    }
    return '';
}


