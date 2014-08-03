// the playlist is just a JSON-style object.
var playlist = [{
	url: "assets/audio/eva/fly me to the moon.mp3",
	title: "fly me to the moon"
}];

$(document).ready(function() {
	var aud = $('#musicbox .aud').get(0);
	aud.pos = -1;
	$('#musicbox .play').bind('click', function(evt) {
		evt.preventDefault();
		if (aud.pos < 0) {
			$('#musicbox .next').trigger('click');
		} else {
			aud.play();
		}
	});
	$('#musicbox .pause').bind('click', function(evt) {
		evt.preventDefault();
		aud.pause();
	});
	$('#musicbox .next').bind('click', function(evt) {
		evt.preventDefault();
		aud.pause();
		aud.pos++;
		if (aud.pos == playlist.length) aud.pos = 0;
		aud.setAttribute('src', playlist[aud.pos].url);
		$('#musicbox .info').html(playlist[aud.pos].title);
		aud.load();
	});
	$('#musicbox .prev').bind('click', function(evt) {
		evt.preventDefault();
		aud.pause();
		aud.pos--;
		if (aud.pos < 0) aud.pos = playlist.length - 1;
		aud.setAttribute('src', playlist[aud.pos].url);
		$('#musicbox .info').html(playlist[aud.pos].title);
		aud.load();
	});
	// JQuery doesn't seem to like binding to these HTML 5
	// media events, but addEventListener does just fine
	aud.addEventListener('progress', function(evt) {
		var width = parseInt($('#musicbox').css('width'));
		var percentLoaded = Math.round(evt.loaded / evt.total * 100);
		var barWidth = Math.ceil(percentLoaded * (width / 100));
		$('#musicbox .load-progress').css('width', barWidth);
	});
	aud.addEventListener('timeupdate', function(evt) {
		var width = parseInt($('#musicbox').css('width'));
		var percentPlayed = Math.round(aud.currentTime / aud.duration * 100);
		var barWidth = Math.ceil(percentPlayed * (width / 100));
		$('#musicbox .play-progress').css('width', barWidth);
	});
	aud.addEventListener('canplay', function(evt) {
		$('#musicbox .play').trigger('click');
	});
	aud.addEventListener('ended', function(evt) {
		$('#musicbox .next').trigger('click');
	});
	$('#musicbox .info').html(playlist[0].title);
});