
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
		//force landscape mode
		var so = cordova.plugins.screenorientation;
       	so.setOrientation(so.Orientation.LANDSCAPE);
		
		//keep awake
		window.plugins.insomnia.keepAwake(); 

		//get going
		onDeviceReady(); 
	}, false);
} else {
	console.log('running in browser...');
	
	onDeviceReady(); //this is the browser
}
