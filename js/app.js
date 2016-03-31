
var runningIn = "unknown";

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
	if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
		runningIn = "iOS";
	} else if(navigator.userAgent.match(/(Android)/)) {
		runningIn = "Android";
	}
	
	document.addEventListener("deviceready", function() { 
		//keep awake
		window.plugins.insomnia.keepAwake(); 

		document.getElementById("cardboardInstructions").style.display = "block";

		if(getParameterByName('viewMode') == "cardboard") {
			document.getElementById('veil').addEventListener('click', function(event) {
				//hide Cardboard instructions
				document.getElementById("cardboardInstructions").style.display = "none";

				//force landscape mode
				screen.lockOrientation('landscape');
				
				//get going
				var delay = setTimeout(onDeviceReady, 1000); //let orientation settle in before resize methods start getting called

				//remove listener
				this.removeEventListener('click',arguments.callee,false);
			});
		} else {
			//hide Cardboard instructions
			document.getElementById("cardboardInstructions").style.display = "none";

			//force landscape mode
			screen.lockOrientation('landscape');
			
			//get going
			var delay = setTimeout(onDeviceReady, 1000); //let orientation settle in before resize methods start getting called
		}
			
	
	}, false);
} else {
	console.log('running in browser...');
	runningIn = "browser";
	onDeviceReady(); //this is the browser
}
