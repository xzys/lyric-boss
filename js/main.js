var game = new Phaser.Game(640, 640, Phaser.CANVAS, "game_div");

var lines = ['ok where did you go', 'hell fucking yea', 'outlaws we dont justify'];

var blocks = [];
var done;
var cur_char;
var cur_index;
var cur_line = 0;

var error,
	highlight;

var NUM_BLOCKS_SHOWN = 3,
    FONT_WIDTH = 14,
    FONT_HEIGHT = 24,
    STARTX = 10,
    STARTY = 10;


var FONT_STYLE = { // inactive
	font : '24px Courier New',
	fill : '#555555'
};
var FONT_STYLE2 = { // active (cur_char)
	font : '24px Courier New',
	fill : '#FFFFFF'
};
var FONT_STYLE3 = { // done
	font : '24px Courier New',
	fill : '#00FF00'
};
var FONT_STYLE4 = { // error
	font : '24px Courier New',
	fill : '#FF0000'
};

// groups
var bottom_text,
	text_highight,
	error_highlight,
	top_text;

var main_state = {
	preload : function() {

	},

	create : function() {
		bottom_text = game.add.group()
		text_highight = game.add.group()
		error_highlight = game.add.group();
		top_text = game.add.group()

		for(var i=0;i < NUM_BLOCKS_SHOWN;i++) {
			var newline = game.add.text(STARTX, STARTY + FONT_HEIGHT * i, lines[i], FONT_STYLE);
			blocks.push(newline);
			bottom_text.add(newline);
		}

		blocks[0].setStyle(FONT_STYLE2);

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

		game.input.keyboard.addCallbacks(game.context, process_keydown, null)

	},

	update : function() {
		//console.log(cur_char.x);
	}
}

function pop_blocks() {
	// pass down text
	cur_line++;
	for(var i=0;i < blocks.length;i++) {
		//console.log(blocks[i].text + ' ' + lines[i + cur_line]);		
		if(i + cur_line < lines.length) {
			blocks[i].setText(lines[i + cur_line]);
		} else {
			blocks[i].setText('');
		}
	}
	reset_cur();
}

function reset_cur() {
	cur_char.setText(blocks[0].text.substr(0, 1));
	cur_char.x = STARTX;
	cur_char.update();
	cur_index = 0;
	done.text = '';
}

function process_keydown(event) {
	// console.log();
	// ENTER and the line is done
	if(done.text.length == blocks[0].text.length) {
		if(event.keyCode == 13) {
			pop_blocks();
			update_highlights();
		}
	// correct letter
	} else if(event.keyCode == cur_char.text.toUpperCase().charCodeAt(0)) {
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
	} else if(!(/[^A-Za-z0-9 ]/.test(String.fromCharCode(event.keyCode)))) {
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

