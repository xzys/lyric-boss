var game = new Phaser.Game(900, 600, Phaser.CANVAS, "game_div");

var COLORS = ['#FD2684', '#B907A5', '#3DC796', '#9FFE74', '#FF6361', '#222222', '#555555'];

var lines = [],
	markers = [],
	time_offset = 0;
var song;

var blocks = [],
	done;

var line_finished = false;

var cur_char,
	cur_index = 0,
	cur_line = 0;

var error,
	highlight;

var score, score_text;

// GROUPS 
var bottom_text,
	text_highight,
	error_highlight,
	top_text;

var font_style_set = false;

var NUM_BLOCKS_SHOWN = 15,
    FONT_WIDTH = 12,
    FONT_HEIGHT = 18,
    STARTX = 80,
    STARTY = 120;

var FONT = '18px "Telegrama"';
var FONT_STYLE = { // inactive
	font : FONT,
	fill : COLORS[6]
};
var FONT_STYLE2 = { // active (cur_char)
	font : FONT,
	fill : '#FFFFFF'
};
var FONT_STYLE3 = { // done
	font : FONT,
	fill : COLORS[2]
};
var FONT_STYLE4 = { // error
	font : FONT,
	fill : COLORS[4]
};


// LOADING STUFF
var BIG_FONT = '100px "Telegrama"';

var LOADING_STYLE = { // inactive
	font : BIG_FONT,
	fill : '#FFFFFF'
};
var LOADING_XSTYLES = [
	{ // inactive
		font : BIG_FONT,
		fill : COLORS[0]
	},
	{ // inactive
		font : BIG_FONT,
		fill : COLORS[1]
	},
	{ // inactive
		font : BIG_FONT,
		fill : COLORS[3]
	},
	{ // inactive
		font : BIG_FONT,
		fill : COLORS[2]
	}
];

var FONT_STYLEX = { // error
	font : FONT,
	fill : COLORS[4]
};

var TITLE_TARGET_Y = 100;

var load_text, load_textr, load_textb;
var load_count = 0;

// var song_titles = ["1. Can't Hold Us -- Macklemore & Ryan Lewis"];
var song_titles = ["1. Can't Hold Us -- Macklemore & Ryan Lewis"];
var song_group, song_sel_hl, song_list = [];
var song_enter;
var	song_selected = 0;

var loaded = false;

var load_state = {
	preload : function() {
		//game.load.bitmapFont('Munro-bitmap', '../fonts/Munro.png', '../fonts/Munro.fnt');
		game.load.audio('song', ['../audio/cantholdus.mp3']);
		game.load.text('lyrics', '../audio/cantholdus.lrc');
	},

	create : function() {
		game.stage.backgroundColor = COLORS[5];
		song = game.add.audio('song');

		load_textb = game.add.text(100, 108, "LOADING", LOADING_XSTYLES[1]);
		load_textr = game.add.text(100, 108, "LOADING", LOADING_XSTYLES[0]);
		load_text = game.add.text(100, 100, "LOADING", LOADING_STYLE);
		game.time.events.loop(Phaser.Timer.SECOND * 0.2, this.change_color, this);
		
		
		song_group = game.add.group();
		song_sel_hl = game.add.text(150, 0, song_titles[i], FONT_STYLEX);
		song_group.add(song_sel_hl);
		song_enter = game.add.text(500, 0, "[ PRESS ENTER ]", FONT_STYLE2)
		song_enter.setShadow(0, 3, COLORS[4], 0);
		song_group.add(song_enter);

		for(var i=0;i < song_titles.length;i++) {
			var s = game.add.text(150, 0, song_titles[i], FONT_STYLE2);
			song_list.push(s);
			song_group.add(s);
		}

		song_group.visible = false;

		load_text.x = game.width/2 - load_text.width/2;
		load_text.y = game.height/2 - load_text.height/2;
		this.set_text();
		
	},

	update : function() {
		if(!loaded && song.isDecoded) {
			// game.state.start('menu');
			// game.time.events.stop();
			load_text.setText("LYRIC BOSS");
			load_textr.setText(load_text.text);
			load_textb.setText(load_text.text);
			loaded = true;
			
			load_text.x = game.width/2 - load_text.width/2;
			this.set_text();
			
			song_group.visible = true;
		} else if(loaded) {
			var diff = load_text.y - TITLE_TARGET_Y;
			if(diff > 1) load_text.y -= diff * 0.1;
			this.set_text();

			var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	        space_key.onDown.add(this.start, this); 

		}
	},

	set_text : function() {
		load_textr.x = load_text.x;
		load_textr.y = load_text.y + 6;
		load_textb.x = load_text.x;
		load_textb.y = load_text.y + 10;

		for(var i=0;i < song_list.length;i++) {
			song_list[i].y = load_text.y + 120 + i * 80;
		}
		
		song_sel_hl.setText(song_list[song_selected].text);
		song_sel_hl.x = song_list[song_selected].x;
		song_sel_hl.y = song_list[song_selected].y + 3;
		song_enter.y = song_list[song_selected].y + 200;
	},

	change_color : function() {
		load_count++;
		load_textr.setStyle(LOADING_XSTYLES[load_count * 2 % LOADING_XSTYLES.length]);
		load_textb.setStyle(LOADING_XSTYLES[(1 + load_count * 2) % LOADING_XSTYLES.length]);
		
		if(!loaded){
			var text = "LOADING\n";
			for(var i = 0;i < load_count % 8;i++) text += ".";

			load_textr.setText(text);
			load_textb.setText(text);
			load_text.setText(text);
		}
	},

	start : function() {
		game.state.start('main');
	}
}