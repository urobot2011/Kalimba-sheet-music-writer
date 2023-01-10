var MidiPlayer = MidiPlayer;
var instrument;
var loadFile, loadDataUri, Player;
var AudioContext = window.AudioContext || window.webkitAudioContext || false;
var ac = new AudioContext || new webkitAudioContext;
var scalekeys = ["C0", "C#0", "Db0", "D0", "D#0", "Eb0", "E0", "F0", "F#0", "Gb0", "G0", "G#0", "Ab0", "A0", "A#0", "Bb0", "B0", "C1", "C#1", "Db1", "D1", "D#1", "Eb1", "E1", "F1", "F#1", "Gb1", "G1", "G#1", "Ab1", "A1", "A#1", "Bb1", "B1", "C2", "C#2", "Db2", "D2", "D#2", "Eb2", "E2", "F2", "F#2", "Gb2", "G2", "G#2", "Ab2", "A2", "A#2", "Bb2", "B2", "C3", "C#3", "Db3", "D3", "D#3", "Eb3", "E3", "F3", "F#3", "Gb3", "G3", "G#3", "Ab3", "A3", "A#3", "Bb3", "B3", "C4", "C#4", "Db4", "D4", "D#4", "Eb4", "E4", "F4", "F#4", "Gb4", "G4", "G#4", "Ab4", "A4", "A#4", "Bb4", "B4", "C5", "C#5", "Db5", "D5", "D#5", "Eb5", "E5", "F5", "F#5", "Gb5", "G5", "G#5", "Ab5", "A5", "A#5", "Bb5", "B5", "C6", "C#6", "Db6", "D6", "D#6", "Eb6", "E6", "F6", "F#6", "Gb6", "G6", "G#6", "Ab6", "A6", "A#6", "Bb6", "B6", "C7", "C#7", "Db7", "D7", "D#7", "Eb7", "E7", "F7", "F#7", "Gb7", "G7", "G#7", "Ab7", "A7", "A#7", "Bb7", "B7", "C8"];
var currentTime;
var timeoutId;
var timeoutId2;
var timeoutId3;
var bool1 = 0;
var tempo = 50;
var keynotes = scalekeys;
var notelengths = [];

var kalimbadiv = document.querySelector('#kalimba');


var tempodiv = document.querySelector('.tempo');
var tempodisplaydiv = document.querySelector('#tempo-display');
var lesson_modediv = document.querySelector('#lesson_mode');
var keydivs = document.querySelectorAll('.key');
var keynoteanimationdiv = document.querySelector('key-note-animation');
var loadingdiv = document.querySelector('#loading');
var selectfilediv = document.querySelector('#select-file');

var playbuttondiv = document.querySelector('#play-button');
var stopbuttondiv = document.querySelector('#stop-button');
var resetbuttondiv = document.querySelector('#reset-button');
var tempobuttondiv = document.querySelector('.tempo');

var shownumbersbuttondiv = document.querySelector('#show_numbers');
var keyboardlayoutbuttondiv = document.querySelector('#keyboard_layout');
var kalimbalayoutbuttondiv = document.querySelector('#kalimba_layout');

window.addEventListener("keydown", function (e) {
	var key = notetonote(keyboardtonote(e.key));
	if (keyboardlayoutbuttondiv.checked) {
		key = keyboardtonote(e.key);
	}
	console.log(key);
	var notediv = document.querySelector('[data-note="' + key + '"]');
	notediv.classList.add("key_active");
	instrument.play(key);
});

window.addEventListener("keyup", function (e) {
	var key = notetonote(keyboardtonote(e.key));
	if (keyboardlayoutbuttondiv.checked) {
		key = keyboardtonote(e.key);
	}
	console.log(key);
	var notediv = document.querySelector('[data-note="' + key + '"]');
	notediv.classList.remove("key_active");
});

var notetonumber = function(note) {
    	var notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6", "E6"];
    	var notenumbers = ["1",  "2",  "3",  "4",  "5",  "6",  "7",  "1",  "2",  "3",  "4",  "5",  "6",  "7",  "1",  "2",  "3"];
	return notenumbers[notes.indexOf(note)];
}

var keyboardtonote = function(keyboard) {
	var keyboards = ["`",  "1",  "2",  "3", "4", "5",  "6",  "7",  "8",  "9",  "0",  "-",  "=",  "Backspace",  "Insert",  "Home",  "PageUp"];
 var notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6", "E6"];
	return notes[keyboards.indexOf(keyboard)];
}

var notetonote = function(note) {
    	var notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6", "E6"];
    	var notes1 = ["D6",  "B5",  "G5",  "E5",  "C5",  "A4",  "F4",  "D4",  "C4",  "E4",  "G4",  "B4",  "D5",  "F5",  "A5",  "C6",  "E6"];
	return notes1[notes.indexOf(note)];
}

var keyToNote = [];
var noteToKey = [];
(function() {
	//first note : 0x15 == 33
	//last note : 0x6C == 264
  var keys = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  var keys2 = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	for (var i = 33; i <= 264; i++) {
		var octave = (i - 12) / 12 >> 0;
		var name = keys2[i % 12] + octave;
		keyToNote[name] = i;
		noteToKey[i] = name;
	}
})();

var changeTempo = function(tempo) {
	Player.tempo = tempo;
}

var play = function() {
	Player.play();
	playbuttondiv.innerHTML = 'Pause';
}

var pause = function() {
	Player.pause();
	playbuttondiv.innerHTML = 'Play';
}

var stop = function() {
	if (lesson_modediv.checked) {
		lesson_modediv.checked = false;
		clearTimeout(timeoutId);
		clearTimeout(timeoutId2);
		clearTimeout(timeoutId3);
		setTimeout(function() {
			stop();
			keydivs.forEach((key) => {
				key.classList.remove("key_active");
			});
		}, 8000);
	}
	Player.stop();
	playbuttondiv.innerHTML = 'Play';
}

var reset = function() {
	keydivs.forEach((key) => {
		key.classList.remove("key_active");
	});
	tempodisplaydiv.innerHTML = tempo;
	tempodiv.value = tempo;
}

playbuttondiv.addEventListener("click", function(e) {
	Player.isPlaying() ? pause() : play();
});

stopbuttondiv.addEventListener("click", function(e) {
	stop();
});

resetbuttondiv.addEventListener("click", function(e) {
	reset();
});

tempobuttondiv.addEventListener("change", function(e) {
	Player.setTempo(this.value);
	document.getElementById('tempo-display').innerHTML = this.value;
});

kalimbalayoutbuttondiv.addEventListener("click", function(e) {
	console.log(e);
	if(kalimbalayoutbuttondiv.checked) {
		keyboardlayoutbuttondiv.checked = 1;
		kalimbadiv.innerHTML = `
					<!--<kalimba-key>-->
				<div class="key" data-note="C4"></div>
				<div class="key" data-note="D4"></div>
				<div class="key" data-note="E4"></div>
				<div class="key" data-note="F4"></div>
				<div class="key" data-note="G4"></div>
				<div class="key" data-note="A4"></div>
				<div class="key" data-note="B4"></div>
				<div class="key" data-note="C5"></div>
				<div class="key" data-note="D5"></div>
				<div class="key" data-note="E5"></div>
				<div class="key" data-note="F5"></div>
				<div class="key" data-note="G5"></div>
				<div class="key" data-note="A5"></div>
				<div class="key" data-note="B5"></div>
				<div class="key " data-note="C6"></div>
				<div class="key" data-note="D6"></div>
				<div class="key last-key" data-note="E6"></div>
			<!--</kalimba-key>-->
			<bottom-pad></bottom-pad>
			<top-pad></top-pad>
			<bottom-pad class="last-pad"></bottom-pad>
			<div class="logo">Kalimba sheet music writer<br>1.0.3</div>
		`;
		keydivs = document.querySelectorAll('.key');
		keydivs.forEach((key) => {
	key.innerHTML = '<span class="key-text">' + key.getAttribute("data-note").substring(0, 1) + '<br>' + notetonumber(key.getAttribute("data-note")) + '</span>';
});
	} else {
		keyboardlayoutbuttondiv.checked = 0;
		kalimbadiv.innerHTML = `
					<!--<kalimba-key>-->
				<div class="key" data-note="D6"></div>
				<div class="key" data-note="B5"></div>
				<div class="key" data-note="G5"></div>
				<div class="key" data-note="E5"></div>
				<div class="key" data-note="C5"></div>
				<div class="key" data-note="A4"></div>
				<div class="key" data-note="F4"></div>
				<div class="key" data-note="D4"></div>
				<div class="key" data-note="C4"></div>
				<div class="key" data-note="E4"></div>
				<div class="key" data-note="G4"></div>
				<div class="key" data-note="B4"></div>
				<div class="key" data-note="D5"></div>
				<div class="key" data-note="F5"></div>
				<div class="key " data-note="A5"></div>
				<div class="key" data-note="C6"></div>
				<div class="key last-key" data-note="E6"></div>
			<!--</kalimba-key>-->
			<bottom-pad></bottom-pad>
			<top-pad></top-pad>
			<bottom-pad class="last-pad"></bottom-pad>
			<div class="logo">Kalimba sheet music writer<br>1.0.3</div>
		`;
		keydivs = document.querySelectorAll('.key');
		keydivs.forEach((key) => {
	key.innerHTML = '<span class="key-text">' + key.getAttribute("data-note").substring(0, 1) + '<br>' + notetonumber(key.getAttribute("data-note")) + '</span>';
});
	}
});

var playmidi = function(event) {
	if (bool1 == 0) {
		tempo = Player.tempo;
		bool1 = 1;
	}
	Player.setTempo(tempodiv.value);
	if (event.name == 'Note on' && event.velocity > 0) {
		//$('key-note-animation').append('<div data-key-note="' + event.noteName + '"></div>');
		if(keynotes[event.noteName] == 1) {
			keynotes[event.noteName] = 0;
		} else {
			keynotes[event.noteName] = 1;
		}
		notelengths[event.noteName] = ac.currentTime;
		if (shownumbersbuttondiv.checked) {
			if(kalimbalayoutbuttondiv.checked) {
				keynoteanimationdiv.insertAdjacentHTML("afterbegin", `<div data-key-note="` + notetonote(event.noteName) + `"><span class="key-text">` + notetonumber(event.noteName) + `</span></div>`);
			} else {
				keynoteanimationdiv.insertAdjacentHTML("afterbegin", `<div data-key-note="` + event.noteName + `"><span class="key-text">` + notetonumber(event.noteName) + `</span></div>`);
			}															
		} else {
			if(kalimbalayoutbuttondiv.checked) {
				keynoteanimationdiv.insertAdjacentHTML("afterbegin", `<div data-key-note="` + notetonote(event.noteName) + `"></div>`);
			} else {
				keynoteanimationdiv.insertAdjacentHTML("afterbegin", `<div data-key-note="` + event.noteName + `"></div>`);
			}
		}
	}
	if (event.name == 'Note off') {
		//height: 30px;
		var notediv = document.querySelector('[data-key-note="' + event.noteName + '"]');
		//notediv.setAttribute('height', notelengths[event.noteName] + "px");
		console.log("event: notediv, " + notediv);
		try {
  		//notediv.setAttribute('style', "height: " + (((ac.currentTime - notelengths[event.noteName])*10) > 50 ? (ac.currentTime - notelengths[event.noteName]) : ((ac.currentTime - notelengths[event.noteName])*10) < 20 ? ((ac.currentTime - notelengths[event.noteName])*30) : ((ac.currentTime - notelengths[event.noteName])*10)) + "px");
		} catch (error) {
  		console.error(error);
		}
		notelengths[event.noteName] = 0;
	}
	setTimeout(function() {
		if (event.name == 'Note on') {
			instrument.play(event.noteName, ac.currentTime, {
				gain: event.velocity / 100
			});
			var notediv = document.querySelector('[data-note="' + event.noteName.replace(/C-1/gi, 'NO') + '"]');
			notediv.classList.add("key_active");
			console.log("event: " + event.name + ", " + event.noteName.replace(/C-1/gi, 'NO'));
		}
		if (event.name == 'Note off') {
			var notediv = document.querySelector('[data-note="' + event.noteName.replace(/C-1/gi, 'NO') + '"]');
			notediv.classList.remove("key_active");
			console.log("event: " + event.name + ", " + event.noteName.replace(/C-1/gi, 'NO'))
		}
	}, 1800);
	tempodisplaydiv.innerHTML = Player.tempo;
}

var lesson_mode = function(event) {
	if (lesson_modediv.checked) {
		playmidi(event);
		timeoutId = setTimeout(function() {
			pause();
		}, 1500);
		timeoutId1 = setTimeout(function() {
			playmidi(event);
		}, 3000);
		// setTimeout(function() {
		// 	playmidi(event);
		// }, 9000);
		// setTimeout(function() {
		// 	playmidi(event);
		// }, 12000);
		timeoutId2 = setTimeout(function() {
			play();
		}, 7500);
	}
	if (!lesson_modediv.checked) {
		clearTimeout(timeoutId);
		clearTimeout(timeoutId2);
		clearTimeout(timeoutId3);
	}
}

keydivs.forEach((key) => {
	key.innerHTML = '<span class="key-text">' + key.getAttribute("data-note").substring(0, 1) + '<br>' + notetonumber(key.getAttribute("data-note")) + '</span>';
});

Soundfont.instrument(ac, 'kalimba').then(function(instrumentnow) {
	instrument = instrumentnow;
	loadingdiv.style.display = 'none';
	selectfilediv.style.display = 'block';
	
	keydivs.forEach((key) => {
		key.addEventListener("click", function(e) {
			instrument.play(e.target.dataset.note.replace(/C-1/gi, 'C4')); //.replace(/C-1/gi, 'C4')
		});
	});
	
	loadFile = function() {
		Player.stop();
		var file = document.querySelector('input[type=file]').files[0];
		var reader = new FileReader();
		if (file) reader.readAsArrayBuffer(file);
		reader.addEventListener("load", function() {
			bool1 = 0;
			Player = new MidiPlayer.Player(function(event) {
				playmidi(event);
				lesson_mode(event);
			});
			
			Player.loadArrayBuffer(reader.result);
			
			playbuttondiv.removeAttribute('disabled');
			
			play();
		}, false);
	}
	
	loadDataUri = function(dataUri) {
		bool1 = 0;
		Player = new MidiPlayer.Player(function(event) {
			playmidi(event);
			lesson_mode(event);
		});
		
		Player.loadDataUri(dataUri);
		
		playbuttondiv.removeAttribute('disabled');
		
	}
	loadDataUri(We_Wish_Merry_Christma);
});

var We_Wish_Merry_Christma = 'data:audio/midi;base64,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AAAAkUVGAJEAAHeBQQAAgUUAAIEAAACBAAABkQAAAJEAAACRQUYAkUVGd4FBAACBRQAAgQAAAIEAAACBAAAAgQAAAZEAAACRAAAAkQAAAJEAAACRQ0YAkUdGAJEAAHiBAAB3gUMAAIFHAACBAAAAgQAAAIEAAAGxQAAAkQAAAJEAAACRAAAAkQAAO4EAAAGRAAA7gQAAAIEAAACBAAAAgQAAAbFAeACRAAAAkQAAAJFARgCRAAB3gUAAAIEAAACBAAABkQAAAJEAAACRQ0YAkUdGd4FDAACBRwAAgQAAAIEAAAGRAAAAkQAAAJFDRgCRR0Z3gQAAAIFHAACBAAAAgQAAAIEAAACBQwABkQAAAJEAAACRAAAAkQAAAJFFRgCRSEYAkQAAeIEAAHeBSAAAgUUAAIEAAACBAAAAgQAAAbFAAACRAAAAkQAAAJEAAACRAAA7gQAAAZEAADuRAAAAgQAAAIEAAACBAAAAgQAAAbFAeACRAAAAkUFGAJEAAACRAAB3gQAAeIFBAACBAAAAgQAAAZEAAACRAAAAkUNGd4EAAACBAAAAgUMAAZEAAACRPEYAkUNGAJEAAACRAAB4gQAAd4E8AACBQwAAgQAAAIEAAACBAAABsUAAAJEAAACRAAAAkQAAAJEAADuBAAABkQAAO4EAAACBAAAAgQAAAIEAAAGxQHgAkQAAAJEAAACRPEYAkQAAd4E8AACBAAAAgQAAAZFDRgCRAAAAkQAAAJFARneBQAAAgUMAAIEAAACBAAABkQAAAJEAAACRQEYAkUNGd4EAAACBQwAAgUAAAIEAAACBAAAAgQAAAZEAAACRAAAAkQAAAJEAAACRQUYAkUVGAJEAAHiBAAB3gUEAAIFFAACBAAAAgQAAAIEAAAGxQAAAkQAAAJEAAACRAAAAkQAAO4EAAAGRAAA7gQAAAIEAAACBAAAAgQAAAbFAeACRAAAAkQAAAJE+RgCRAAB3gQAAAIEAAACBPgABkQAAAJEAAACRQUYAkUVGd4FBAACBRQAAgQAAAIEAAAGRAAAAkQAAAJFBRgCRRUZ3gUEAAIFFAACBAAAAgQAAAIEAAACBAAABkQAAAJEAAACRAAAAkQAAAJEAAACRR0YAkUNGeIEAAHeBQwAAgUcAAIEAAACBAAAAgQAAAbFAAACRAAAAkQAAAJEAAACRAAA7gQAAAZEAADuBAAAAgQAAAIEAAACBAAABsUB4AJEAAACRAAAAkUBGAJEAAHeBQAAAgQAAAIEAAAGRAAAAkQAAAJFDRgCRR0Z3gUMAAIFHAACBAAAAgQAAAZFDRgCRAAAAkUdGAJEAAHeBAAAAgUMAAIFHAACBAAAAgQAAAIEAAAGRAAAAkQAAAJEAAACRAAAAkUVGAJFIRgCRAAB4gQAAd4FFAACBSAAAgQAAAIEAAACBAAABsUAAAJEAAACRAAAAkQAAAJEAADuBAAABkQAAO5EAAACBAAAAgQAAAIEAAACBAAABsUB4AJEAAACRAAAAkUFGAJEAAHeBAAB4gUEAAIEAAACBAAABkQAAAJEAAACRQ0Z3gQAAAIFDAACBAAABkQAAAJEAAACRPEYAkUNGAJEAAHiBAAB3gTwAAIFDAACBAAAAgQAAAIEAAAGxQAAAkQAAAJEAAACRAAAAkQAAO4EAAAGRAAA7gQAAAIEAAACBAAAAgQAAAIEAAACBAAABsUB4AJEAAACRAAAAkTxGAJEAAACRAAAAkQAAd4E8AAGRQEYAkUNGd4FAAACBQwABkUBGAJFDRneBQAAAgUMAAIEAAACBAAABkQAAAJEAAACRQ0YAkQAAeIEAAHeBQwAAgQAAAIEAAACBAAABsUAAAJEAAACRAAAAkQAAAJEAADuBAAABkQAAO5EAAACBAAAAgQAAAIEAAACBAAABsUB4AJEAAACRAAAAkUFGAJFFRgCRAAB3gQAAeIFBAACBRQAAgQAAAIEAAAGRAAAAkQAAAJEAADuBAAABkQAAO4EAAACBAAAAgQAAAZEAAACRAAAAkTxGd4EAAACBPAAAgQAAAIEAAAGxQAAAkQAAAJEAAACRAAAAkUBGd4FAAACBAAAAgQAAAIEAAAGxQHgAkQAAAJEAAACRQEYAkUNGAJEAAHeBQAAAgUMAAIEAAACBAAAAgQAAAIEAAAGRAAAAkQAAAJEAAACRAAAAkUVGAJEAAHiBAAB3gUUAAIEAAACBAAAAgQAAAIEAAACBAAAAgQAAAZEAAACRAAAAkQAAAJEAAACRAAAAkQAAAJEAADuBAAABkQAAO4EAAACBAAAAgQAAAIEAAACBAAABkQAAAJEAAACRAAAAkUBGAJEAAACRAAB4gQAAd4FAAACBAAAAgQAAAIEAAAGxQAAAkQAAAJEAAACRAAAAkQAAO4EAAAGRAAA7kQAAAIEAAACBAAAAgQAAAIEAAAGxQHgAkUFGAJEAAACRAAAAkQAAd4EAAHiBQQAAgQAAAIEAAAGRAAAAkQAAAJFDRneBQwAAgQAAAIEAAAGRAAAAkQAAAJE8RgCRQ0YAkQAAeIEAAHeBPAAAgUMAAIEAAACBAAAAgQAAAbFAAACRAAAAkQAAAJEAAACRAAA7gQAAAZEAADuBAAAAgQAAAIEAAACBAAABsUB4AJEAAACRAAAAkTxGAJEAAHeBPAABkUBGAJFDRneBQAAAgUMAAZFARgCRQ0Z3gUAAAIFDAACBAAAAgQAAAZEAAACRAAAAkUNGAJEAAHiBAAB3gUMAAIEAAACBAAAAgQAAAbFAAACRAAAAkQAAAJEAAACRAAA7gQAAAZEAADuRAAAAgQAAAIEAAACBAAAAgQAAAbFAeACRAAAAkUVGAJEAAACRAAAAkUFGd4EAAHiBQQAAgUUAAIEAAACBAAABkQAAAJEAAACRAAA7gQAAAZEAADuBAAAAgQAAAIEAAAGRAAAAkQAAAJE8RneBPAAAgQAAAIEAAACBAAABsUAAAJEAAACRAAAAkUBGAJEAAHeBQAAAgQAAAIEAAACBAAABsUB4AJFARgCRQ0YAkQAAAJEAAACRAAB3gQAAAIFAAACBQwAAgQAAAIEAAACBAAABkQAAAJEAAACRAAAAkQAAAJFFRgCRAAB4gQAAd4FFAACBAAAAgQAAAIEAAACBAAAAgQAAAIEAAAGRAAAAkQAAAJEAAACRAAAAkQAAAJEAAACRAAA7gQAAAZEAADuBAAAAgQAAAIEAAACBAAAAgQAAAZEAAACRAAAAkQAAAJFARgCRAAAAkQAAeIEAAHeBAAAAgUAAAIEAAACBAAABsUAAAJEAAACRAAAAkQAAAJEAADuBAAABkQAAO5EAAACBAAAAgQAAAIEAAACBAAABsUB4AJFBRgCRAAAAkQAAAJEAAHeBAAB4gQAAAIFBAACBAAABkQAAAJEAAACRQ0Z3gUMAAIEAAACBAAABkQAAAJEAAACRPEYAkUNGAJEAAHiBAAB3gTwAAIFDAACBAAAAgQAAAIEAAAGxQAAAkQAAAJEAAACRAAAAkQAAO4EAAAGRAAA7gQAAAIEAAACBAAAAgQAAAbFAeACRAAAAkQAAAJE8RgCRAAB3gTwAAIEAAACBAAABkQAAAJFARgCRQ0YAkQAAd4FAAACBQwAAgQAAAIEAAAGRAAAAkQAAAJFARgCRQ0Z3kQAAAIFDAACBAAAAgQAAAIEAAACBAAAAgQAAAIFAAACBAAABsUAAALFAeACRAAAAkQAAAJEAAACRAAAAkQAAAJFFRgCRAAAAkUFGd4EAAHiBQQAAgUUAAIEAAACBAAAAgQAAAbFAAACRAAAAkQAAAJEAAACRAAA7gQAAAZEAADuBAAAAgQAAAIEAAACBAAABsUB4AJEAAACRAAAAkQAAAJE+RneBPgAAgQAAAIEAAAGRAAAAkQAAAJFBRgCRRUZ3gUEAAIFFAACBAAAAgQAAAZEAAACRAAAAkUFGAJFFRneRAAAAgUUAAIEAAACBAAAAgQAAAIEAAACBAAAAgQAAAIFBAAGxQAAAsUB4AJEAAACRAAAAkQAAAJFDRgCRR0YAkQAAAJEAAACRAAB3gQAAeIFDAACBRwAAgQAAAIEAAACBAAABsUAAAJEAAACRAAAAkQAAAJEAADuBAAABkQAAO4EAAACBAAAAgQAAAIEAAAGxQHgAkQAAAJFARgCRAAAAkQAAd4FAAACBAAAAgQAAAZEAAACRAAAAkUNGAJFHRneBQwAAgUcAAIEAAACBAAABkQAAAJEAAACRQ0YAkUdGd5EAAACBQwAAgUcAAIEAAACBAAAAgQAAAIEAAACBAAAAgQAAAbFAAACxQHgAkQAAAJEAAACRRUYAkUhGAJEAAACRAAAAkQAAAJEAAHeBAAB4gQAAAIFIAACBAAAAgUUAAIEAAAGxQAAAkQAAAJEAAACRAAAAkQAAO4EAAAGRAAA7kQAAAIEAAACBAAAAgQAAAIEAAAGxQHgAkQAAAJEAAACRQUYAkQAAd4EAAHiBQQAAgQAAAIEAAAGRAAAAkQAAAJFDRneRAAAAgQAAAIEAAACBAAAAgQAAAIFDAAGxQAAAsUB4AJEAAACRAAAAkTxGAJFDRgCRAAAAkQAAd4EAAHiBPAAAgUMAAIEAAACBAAAAgQAAAbFAAACRAAAAkQAAAJEAAACRAAA7gQAAAZEAADuBAAAAgQAAAIEAAAGRAAAAkQAAAJEAADuBAAABkQAAO4EAAAD/LwA=';
