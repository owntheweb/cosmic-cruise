
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var onDeviceReady = function() {
	console.log('starting...');

	//show a message if webGL is not supported
	if(!Detector.webgl) {
		Detector.addGetWebGLMessage();
	} else {
		var spaceScene = new SpaceScene(getParameterByName('viewMode'));
		spaceScene.goForth();
	}
};

//thanks: http://stackoverflow.com/questions/8068052/phonegap-detect-if-running-on-desktop-browser
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
	console.log('running in app...');
	
	document.addEventListener("deviceready", function() { 
		//keep awake
		window.plugins.insomnia.keepAwake(); 

		if(screen.orientation.indexOf("portrait") > -1) {
			//hide Cardboard instructions
			document.getElementById("cardboardInstructions").style.display = "block";

			//watch for orientation change (cordova plugin bug?: orientation won't change, watch for width changes instead)
			var debugInt = 0;
			var watchForOrientationChange = setInterval(function() {
				document.getElementById("debug").innerHTML = "width: " + window.innerWidth + ", height: " + window.innerHeight + ", int: " + debugInt;

				if(window.innerWidth >= window.innerHeight) { //assume landscape mode
					//hide Cardboard instructions
					document.getElementById("cardboardInstructions").style.display = "none";

					//force landscape mode
					screen.lockOrientation('landscape');
					
					//get going
					var delay = setTimeout(onDeviceReady, 1000); //let orientation settle in before resize methods start getting called

					//stop watching orientation
					clearInterval(watchForOrientationChange);
				}
			}, 200);

		} else {
			//force landscape mode
			screen.lockOrientation('landscape');
			
			//get going
			var delay = setTimeout(onDeviceReady, 1000); //let orientation settle in before resize methods start getting called
		}
	
	}, false);
} else {
	console.log('running in browser...');
	
	onDeviceReady(); //this is the browser
}
