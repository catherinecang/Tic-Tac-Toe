//value is value for the player who just played
$(function (){
	var solns;
	var move;
	var curr_board = '+++++++++';
	var toggleTutor = false;
	
	$("#tutor").click(function(){
		toggleTutor = !toggleTutor;
		if (toggleTutor==false){
			removeAllClass(".square", true);
		}
		else{
			labelVal();
		}
	})
	$(".btn").click(function(){
		index = parseInt($(this)[0].id) - 1;
		if(curr_board[index]==='+'){
			$(this).text('X');
			removeAllClass(this, true);
			curr_board = curr_board.substring(0, index) + 'x' + curr_board.substring(index + 1);
			checkWin();	
		doComputerMove();
	}
	});
	function getMove(){
		$.ajax({
			type: "GET",
			url: 'http://nyc.cs.berkeley.edu:8081/ttt/getNextMoveValues?',
			dataType: 'json',
			data: {board: curr_board},
			async: false,
		}).done(function (resp) {
			solns = resp;
			//this next line below might be an issue
			move = filterRemote(filterValue(resp['response']))['move'];
		});
	}
	function doComputerMove(){
		getMove();
		var index = parseInt(move)-1
		curr_board = curr_board.substring(0, index) + 'o' + curr_board.substring(index + 1);
		move = "#" + String(move);
		$(move).text('O');
		removeAllClass(move, true);
		checkWin();
		if(toggleTutor){
		labelVal();}
	}
	function genButton(){
		var b = $('<button/>', {
			text: "Restart",
			click: function(){
				location.reload();
			}
		})
		return b;
	}

	function labelVal(){
		getMove();
		console.log(solns["response"])
		for (var i in solns["response"]){
			button_num = "#" + String(solns["response"][i]["move"]);
			soln_val = solns["response"][i]["value"];
			removeAllClass(button_num), false;
			if (soln_val==="tie"){
				$(button_num).addClass("btn-outline-warning");
			}
			else if (soln_val==="lose"){
				$(button_num).addClass("btn-outline-primary");
			}
			else if (soln_val==="win") {
				$(button_num).addClass("btn-outline-danger");
			}
		}
	}
	function removeAllClass(button, normal){
		$(button).removeClass("btn-outline-dark btn-outline-warning btn-outline-primary btn-outline-danger");
		if(normal===true){
			$(button).addClass("btn-outline-dark");
		}
	}
	function checkWin(){
	var win = '';
	if (
        (curr_board[0] === 'x' && curr_board[1] === 'x' && curr_board[2] === 'x') ||
        (curr_board[3] === 'x' && curr_board[4] === 'x' && curr_board[5] === 'x') ||
        (curr_board[6] === 'x' && curr_board[7] === 'x' && curr_board[8] === 'x') ||
        (curr_board[0] === 'x' && curr_board[3] === 'x' && curr_board[6] === 'x') ||
        (curr_board[1] === 'x' && curr_board[4] === 'x' && curr_board[7] === 'x') ||
        (curr_board[2] === 'x' && curr_board[5] === 'x' && curr_board[8] === 'x') ||
        (curr_board[0] === 'x' && curr_board[4] === 'x' && curr_board[8] === 'x') ||
        (curr_board[2] === 'x' && curr_board[4] === 'x' && curr_board[6] === 'x') 
    ) {
        win = 'x';
    } else if (
        (curr_board[0] === 'o' && curr_board[1] === 'o' && curr_board[2] === 'o') ||
        (curr_board[3] === 'o' && curr_board[4] === 'o' && curr_board[5] === 'o') ||
        (curr_board[6] === 'o' && curr_board[7] === 'o' && curr_board[8] === 'o') ||
        (curr_board[0] === 'o' && curr_board[3] === 'o' && curr_board[6] === 'o') ||
        (curr_board[1] === 'o' && curr_board[4] === 'o' && curr_board[7] === 'o') ||
        (curr_board[2] === 'o' && curr_board[5] === 'o' && curr_board[8] === 'o') ||
        (curr_board[0] === 'o' && curr_board[4] === 'o' && curr_board[8] === 'o') ||
        (curr_board[2] === 'o' && curr_board[4] === 'o' && curr_board[6] === 'o') 
    ) {
        win = 'o';
    } else if (curr_board.indexOf('+') === -1) {
        win = '+';
    }
   if (win!=''){
   		if(win === '+'){
   			$("#result").html("It's a Tie!");
   		}else{
			$("#result").html("WINNER: " + win);
   		}
   		b = genButton();
		$("#restart").append(b);
		$('.btn').unbind('click');
	}
}

})
function filterRemote(filtered){
	var val = filtered[0]['value']
	var remotes = [];
	for (var i in filtered){
		remotes.push(filtered[i]['remoteness'])
	}
	if (val === 'lose'){
		var minMax = Math.min.apply(Math, remotes)
	} else {
		var minMax = Math.max.apply(Math, remotes)
	}

	filtered = filtered.filter(function (i){
			return i['remoteness'] == minMax
		})

	random = Math.floor(Math.random()*filtered.length)
	return filtered[random];
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




