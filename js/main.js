var main_state = {
	create : function() {
		song = game.add.audio('song');
		var html = game.cache.getText('lyrics');
 	    var text = html.split('\n');

 	    for(var i=0;i < text.length;i++) {
 	    	lines.push(text[i].substring(10).replace(/ $/, '')
 	    									.replace(/\n/, ''));
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
			var newline = game.add.text(STARTX, STARTY + (FONT_HEIGHT + 8) * i,
										lines[i], FONT_STYLE);

			blocks.push(newline);
			bottom_text.add(newline);
		}



		done = game.add.text(STARTX, STARTY, '', FONT_STYLE3);
		done.setShadow(0, 3, COLORS[2], 0);
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
		
		highlight.lineStyle(1, 0x3DC796, 1);
		highlight.beginFill(0x3DC796, 1);
		highlight.drawRect(0, 0, FONT_WIDTH, FONT_HEIGHT);

		score = 0;
		
		score_text = game.add.text(720, 50, "MISSES: 0", FONT_STYLE2);

		game.input.keyboard.addCallbacks(game.context, process_keydown, null);
		
	},

	update : function() {
		// console.log(time_offset + song.currentTime / 1000);
		// console.log((song.currentTime / 1000) + '\t' + (markers[cur_line + 1]));

		if((time_offset + song.currentTime / 1000) > markers[cur_line + 1]) {
			//console.log('m');
			
			if(line_finished) {
				pop_blocks();
			} else {	
				song.stop();
				song.play('', markers[cur_line]);
				time_offset = markers[cur_line];

				score++;
				score_text.setText("MISSES: " + score);
			}

		}

		if(song.isDecoded && !song.isPlaying) song.play();
	},

	render : function() {
		// game.debug.soundInfo(song, 10, 200);
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
	line_finished = false;
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

function line_completed() {
	return blocks[0].text.length < 2 || done.text.length == blocks[0].text.length - 1;
}

function process_keydown(event) {
	// console.log(event);
	// ENTER and the line is done
	if(!line_completed()) {
		// correct letter
		if(event.keyCode == cur_char.text.toUpperCase().charCodeAt(0) ||
			(event.keyCode == 222 && cur_char.text == "'") ||
			(event.keyCode == 188 && cur_char.text == ",")
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
	} 
	// CHECK AGAIN
	//console.log(done.text.length + ' ' + (blocks[0].text.length - 1));
	if(line_completed()) {
		line_finished = true;
		//console.log('fin');
	}

	// error or not
	if(cur_char.text == '<') {
		text_highight.visible = false;
		error_highlight.visible = true;
		blocks[0].setStyle(FONT_STYLE4)
		blocks[0].setShadow(0, 3, COLORS[4], 0);
	} else {
		text_highight.visible = true;
		error_highlight.visible = false;
		blocks[0].setStyle(FONT_STYLE2);
		blocks[0].setShadow(0, 3, COLORS[2], 0);
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


game.state.add('load', load_state);  
game.state.add('main', main_state);
game.state.start('load');

