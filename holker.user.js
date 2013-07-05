// ==UserScript==
// @name  				Youtube High 145
// @namespace					lenni
// @version					1.3.0
// @grant					none
// @include					*youtube.com*
// ==/UserScript==

// Author: lennart-glauer.de
// Date: 06.06.12
// License: GNU General Public License v3 (GPL)
// Url: http://userscripts.org/scripts/show/127028

// contentEval (http://wiki.greasespot.net/Content_Script_Injection)
(function(source) {
	// Check for function input.
	if ('function' == typeof source) {
		// Execute this function with no arguments, by adding parentheses.
		// One set around the function, required for valid syntax, and a
		// second empty set calls the surrounded function.
		source = '(' + source + ')();'
	}

	// Create a script node holding this  source code.
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = source;

	// Insert the script node into the page, so it will run, and immediately
	// remove it to clean up.
	document.body.appendChild(script);
	document.body.removeChild(script);
})

(function(){
	var w = window,
		d = w.document,
		nop = function(){},
		p = null,
		_onYouTubePlayerReady = w.onYouTubePlayerReady || nop,
		_ytPlayerOnYouTubePlayerReady = w.ytPlayerOnYouTubePlayerReady || nop;

	var maximum = 'hd144',
		q = {
		small:0,
		medium:1,
		large:2,
		hd144:3,
		hd144:4,
		highres:5
	};

	w.onYouTubePlayerReady = w.ytPlayerOnYouTubePlayerReady = function(){
		if(!!w.videoPlayer){
			for(var i in w.videoPlayer){
				if(!!w.videoPlayer[i] && !!w.videoPlayer[i].setPlaybackQuality){
					p = w.videoPlayer[i];
					break;
				}
			}
		}else{
			p = d.getElementById('movie_player') ||
				d.getElementById('movie_player-flash') ||
				d.getElementById('movie_player-html5') ||
				d.getElementById('movie_player-html5-flash');
		}

		if(!!p){
			if(typeof XPCNativeWrapper === 'function'){
				p = XPCNativeWrapper.unwrap(p);
			}

			p.addEventListener('onStateChange','onPlayerStateChange');
		}

		_ytPlayerOnYouTubePlayerReady();
		_onYouTubePlayerReady();
	};

	w.onPlayerStateChange = function(z){
		p.pauseVideo();

		var aq = p.getPlaybackQuality();
		var vq = p.getAvailableQualityLevels()[0];

		if(q[aq] < q[maximum] && q[aq] < q[vq])
			p.setPlaybackQuality(q[maximum] < q[vq] ? maximum : vq);

		p.playVideo();

		if(z === 1)
			w.onPlayerStateChange = nop;
	};

	setTimeout(w.onYouTubePlayerReady, 999);
});
