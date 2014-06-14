var game = new Phaser.Game(900, 600, Phaser.CANVAS, "game_div");

var lines = [],
	markers = [];
var song;

var blocks = [],
	done,
	cur_char;

var cur_index = 0,
	cur_line = 0;

var error,
	highlight;

var NUM_BLOCKS_SHOWN = 3,
    FONT_WIDTH = 16,
    FONT_HEIGHT = 28,
    STARTX = 10,
    STARTY = 10;

var FONT = '24px "Telegrama"';
var FONT_STYLE = { // inactive
	font : FONT,
	fill : '#555555'
};
var FONT_STYLE2 = { // active (cur_char)
	font : FONT,
	fill : '#FFFFFF'
};
var FONT_STYLE3 = { // done
	font : FONT,
	fill : '#00FF00'
};
var FONT_STYLE4 = { // error
	font : FONT,
	fill : '#FF0000'
};

// groups
var bottom_text,
	text_highight,
	error_highlight,
	top_text;

var font_style_set = false;

// function decideRepeat() {
	
// 	if(!song.isPlaying) {
// 		song.stop();
// 	} else {
// 		song.restart('0');
// 	}

// 	console.log('booyah');
// 	//song.onMarkerComplete.add(decideRepeat, song.context);
// }


var main_state = {
	preload : function() {
		//game.load.bitmapFont('Munro-bitmap', '../fonts/Munro.png', '../fonts/Munro.fnt');
		game.load.audio('song', ['../audio/cant_hold_us.mp3']);
		game.load.text('lyrics', '../audio/cant_hold_us.lrc');

	},

	create : function() {
		song = game.add.audio('song');
		var html = game.cache.getText('lyrics');
 	    var text = html.split('\n');

 	    for(var i=0;i < text.length;i++) {
 	    	lines.push(text[i].substring(10).replace(/ $/, ''));
 	    	markers.push(parseTime(text[i]));

 	    	// var start = parseTime(text[i]);
 	    	// var end = i + 1 < text.length ? parseTime(text[i + 1]) : song.duration;
 	    	// console.log(start + ', ' + end);
 	    	// song.addMarker((i).toString(), start, end - start); 

 	    }

 	    //song.onMarkerComplete.add(decideRepeat, song.context);


		bottom_text = game.add.group()
		text_highight = game.add.group()
		error_highlight = game.add.group();
		top_text = game.add.group()

		for(var i=0;i < NUM_BLOCKS_SHOWN;i++) {
			var newline = game.add.text(STARTX, STARTY + FONT_HEIGHT * i,
										lines[i], FONT_STYLE);
			blocks.push(newline);
			bottom_text.add(newline);
		}


		done = game.add.text(STARTX, STARTY, '', FONT_STYLE3);
		cur_char = game.add.text(STARTX, STARTY, '', FONT_STYLE2)
		top_text.add(done);
		top_text.add(cur_char);
		reset_cur();

		error = game.add.graphics(STARTX, STARTY);
		error_highlight.add(error);
		error_highlight.visible = false;
		highlight = game.add.graphics(STARTX, STARTY);
		text_highight.add(highlight);
		
		error.lineStyle(1, 0xFF0000, 1);
		error.beginFill(0xFF0000, 1);
		error.drawRect(0, 0, FONT_WIDTH, FONT_HEIGHT);
		
		highlight.lineStyle(1, 0x00FF00, 1);
		highlight.beginFill(0x00FF00, 1);
		highlight.drawRect(0, 0, FONT_WIDTH, FONT_HEIGHT);

		game.input.keyboard.addCallbacks(game.context, process_keydown, null);
		
	},

	update : function() {
		if((song.currentTime / 1000) > markers[cur_line + 1]) {
			song.stop();
			song.play('', markers[cur_line + 1]);
			console.log(song.currentTime / 1000);
			
		}

		//console.log(done.text.length + ' ' + blocks[0].text.length);


	},

	render : function() {
		game.debug.soundInfo(song, 10, 200);

	}


}








function parseTime(st) {
	return parseFloat(st.substr(1,2)) * 60 + parseFloat(st.substr(4,5));
}


function pop_blocks() {
	// pass down text
	cur_line++;
	for(var i=0;i < blocks.length;i++) {
		if(i + cur_line < lines.length) {
			blocks[i].setText(lines[i + cur_line]);
		} else {
			blocks[i].setText('');
		}
	}
	line_fininshed = false
	reset_cur();
	update_highlights();
}

function reset_cur() {
	cur_char.setText(blocks[0].text.substr(0, 1));
	cur_char.x = STARTX;
	cur_char.update();
	cur_index = 0;
	done.text = '';
}

function process_keydown(event) {
	
	// ENTER and the line is done
	if(blocks[0].text.length == 1 || done.text.length == blocks[0].text.length - 1) {
		line_fininshed = true;
		// if(event.keyCode == 13) pop_blocks();
	// correct letter
	} else if(event.keyCode == cur_char.text.toUpperCase().charCodeAt(0) ||
		(event.keyCode == 222 && cur_char.text == "'")
		) {
		cur_index++;
		cur_char.x += FONT_WIDTH;
		update_text();
	// BACK
	} else if(event.keyCode == 8) {
		if(cur_index > 0) {
			cur_index--;
			cur_char.x -= FONT_WIDTH;
			
			if(cur_char.text == '<') {
				// if you're back to the right letter
				if(cur_index == done.text.length) {
					update_text();
				// else keep it like that
				} else {
					error.x = cur_char.x;
					error.y = cur_char.y;
				}
			} else {
				update_text();
			}
		}
	// not f1 - f12 keys and an alphanumeric WRONG
	} else if(/[A-Za-z0-9' ]/.test(String.fromCharCode(event.keyCode))) {
		// console.log('WRONG');
		cur_index++;
		cur_char.x += FONT_WIDTH;
		cur_char.setText('<');

		update_highlights();
	}


	//console.log(!(/[^A-Za-z0-9 ]/.test(String.fromCharCode(event.keyCode))));

	// error or not
	if(cur_char.text == '<') {
		text_highight.visible = false;
		error_highlight.visible = true;
		blocks[0].setStyle(FONT_STYLE4);
	} else {
		text_highight.visible = true;
		error_highlight.visible = false;
		blocks[0].setStyle(FONT_STYLE2);
	}

	if (event.keyCode == 8 || event.keyCode == 32) {
		event.returnValue = false;
	}
}

function update_text() {
	cur_char.setText(blocks[0].text.substr(cur_index, 1));
	done.setText(blocks[0].text.substr(0, cur_index));
	update_highlights();
}

function update_highlights() {
	highlight.x = cur_char.x;
	highlight.y = cur_char.y;
	error.x = cur_char.x;
	error.y = cur_char.y;
}

game.state.add('main', main_state);
game.state.start('main');

