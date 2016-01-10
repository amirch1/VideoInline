'use strict';
(function($) {
	$(window).load(function() {
		var iOS = /iPhone|iPod/.test( navigator.userAgent );
		if (iOS) {
			var video = $('video[playsinline], video[webkit-playsinline]').get(0);
			var width = $(video).width();
			var height = $(video).height();
			var source = $(video).attr('src');

			var paused = true;
			var firstPlay = true;
			var renderIntervalID = null;
			var renderIntervalTime = 50;
			var sliderDragged = false;

			var hideControlsTimeout = 2500;
			var hideControlsTimeoutID = null;

			var inlinePlayer = $("<div></div>")
				.width(width)
				.height(height)
				.addClass("inlinePlayer");
			$(video).wrap(inlinePlayer);

			// add controls
			$('.inlinePlayer').append('<button class="playBtn">Play</button>');
			$('.inlinePlayer').append('<input class="slider" type="range" name="points" min="0" max="100" value="0">');

			// add audioPlayer
			var audioPlayer = document.createElement('audio');
			audioPlayer.src = source;

			// pause function
			var pause = function(){
				audioPlayer.pause();
				$(".playBtn").html("Play");
				if (renderIntervalID){
					clearInterval(renderIntervalID);
					renderIntervalID = null;
				}
			}

			// play function
			var play = function(){
				audioPlayer.play();
				$(".playBtn").html("Pause");
				renderIntervalID = setInterval(function(){
					video.currentTime = audioPlayer.currentTime;
					if (!sliderDragged && audioPlayer.duration){
						$(".slider").val(audioPlayer.currentTime/audioPlayer.duration*100);
					}
				},renderIntervalTime);
			}

			var hideControls = function(){
				if (hideControlsTimeoutID){
					clearTimeout(hideControlsTimeoutID);
					hideControlsTimeoutID = null;
				}
				if (paused || sliderDragged){
					return;
				}
				hideControlsTimeoutID = setTimeout(function(){
					$(".playBtn").fadeOut();
					$(".slider").fadeOut();
				},hideControlsTimeout)
			}

			// play button
			$(".playBtn").on("click", function(){
				if (firstPlay){
					firstPlay = false;
					video.load();
				}
				paused = !paused;
				if (paused){
					pause();
				}else{
					play();
				}
				hideControls();
			});

			// slider
			$(".slider").on("touchstart", function(){
				sliderDragged = true;
				if (hideControlsTimeoutID){
					clearTimeout(hideControlsTimeoutID);
					hideControlsTimeoutID = null;
				}
			});
			$(".slider").on("touchend", function(){
				if (audioPlayer.duration){
					audioPlayer.currentTime = $(".slider").val() / 100 * audioPlayer.duration;
				}
				video.currentTime = audioPlayer.currentTime;
				sliderDragged = false;
				hideControls();
			});

			// movie end
			$(audioPlayer).on("ended", function(){
				pause();
				paused = true;
				audioPlayer.currentTime = video.currentTime = 0; // rewind
				$(".slider").val(0);
				$(".playBtn").show();
				$(".slider").show();
			});

			// video click shows controls
			$(video).on("click", function(){
				$(".playBtn").fadeIn();
				$(".slider").fadeIn();
				hideControls();
			});
		}
	});
})(jQuery);