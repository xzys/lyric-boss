var game = new Phaser.Game(640, 640, Phaser.CANVAS, "game_div");

var lines = ['ok where did you go', 'hell fucking yea', 'outlaws we dont justify'];

var blocks = [];
var done;
var cur_char;
var cur_index;
var cur_line;

var border;
var highlight;

var NUM_BLOCKS_SHOWN = 2;
var FONT_WIDTH = 14;
var FONT_HEIGHT = 24;

var FONT_STYLE = {
	font : '24px Courier New',
	fill : '#555555'
};
var FONT_STYLE2 = {
	font : '24px Courier New',
	fill : '#FFFFFF'
};
var FONT_STYLE3 = {
	font : '24px Courier New',
	fill : '#FFFF00'
};
var FONT_STYLE4 = {
	font : '24px Courier New',
	fill : '#FF00FF'
};



var test;
var test2;

var main_state = {
	preload : function() {

	},

	create : function() {
		
		for(var i=0;i < NUM_BLOCKS_SHOWN;i++) {
			blocks.push(game.add.text(10, 10 + FONT_HEIGHT * i, lines[i], FONT_STYLE));
		}
		blocks[0].setStyle(FONT_STYLE2);

		done = game.add.text(10, 10, '', FONT_STYLE3);
		
		cur_char = game.add.text(10, 10, '', FONT_STYLE4)
		reset_cur();
		


		border = game.add.graphics(0, 0);
		border.lineStyle(1, 0xffffff, 1);
		border.beginFill(0x000000, 0);

		highlight = game.add.graphics(10, 10);
		highlight.lineStyle(1, 0x00FF00, 1);
		highlight.beginFill(0x00FF00, .1);
		highlight.drawRect(0, 0, FONT_WIDTH, FONT_HEIGHT);
		

		game.input.keyboard.addCallbacks(game.context, process_keydown, null)

	},

	update : function() {

	}
}

function pop_blocks() {
	// pass down text
	for(var i=1;i < blocks.length;i++) {
		if(i + cur_line < lines.length) {
			blocks[i-1].setText(lines[i + cur_line]);
			blocks[i-1].setText('');
		} else {
		}
	}
	cur_line++;
}

function reset_cur() {
	cur_char.setText(blocks[0].text.substr(0, 1));
	cur_char.x = 10;

	cur_index = 0;
}

function process_keydown(event) {
	
	if(event.keyCode == cur_char.text.toUpperCase().charCodeAt(0)) {
		cur_index++;
		cur_char.x += FONT_WIDTH;
		cur_char.setText(blocks[0].text.substr(cur_index, 1));
		done.setText(blocks[0].text.substr(0, cur_index));

		highlight.x = cur_char.x;
		highlight.y = cur_char.y;

		console.log(done.text);
	} else {
		console.log('WRONG');
	}

	return false;
}


game.state.add('main', main_state);
game.state.start('main');

