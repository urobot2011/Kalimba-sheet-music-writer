var MidiPlayer = MidiPlayer;
var instrument;
var loadFile, loadDataUri, Player;
var AudioContext = window.AudioContext || window.webkitAudioContext || false;
var ac = new AudioContext || new webkitAudioContext;
var currentTime;
var timeoutId;
var timeoutId2;
var timeoutId3;
var bool1 = 0;
var tempo = 50;

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
	if(lesson_modediv.checked){
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

var playmidi = function(event) {
	if (bool1 == 0) {
		tempo = Player.tempo;
		bool1 = 1;
	}
	Player.setTempo(tempodiv.value);
	if (event.name == 'Note on' && event.velocity > 0) {
		//$('key-note-animation').append('<div data-key-note="' + event.noteName + '"></div>');
		keynoteanimationdiv.insertAdjacentHTML("afterbegin", `
		<div data-key-note="` + event.noteName + `"></div>
		`);
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
	if(lesson_modediv.checked){
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
	if(!lesson_modediv.checked){
		clearTimeout(timeoutId);
		clearTimeout(timeoutId2);
		clearTimeout(timeoutId3);
	}
}

keydivs.forEach((key) => {
	key.innerHTML = '<span class="key-text">' + key.getAttribute("data-note").substring(0, 1) + '<br>' + key.getAttribute("data-key") + '</span>';
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
