var onDeviceReady = function() {
	console.log('starting...');

	//show a message if webGL is not supported
	if(!Detector.webgl) {
		Detector.addGetWebGLMessage();
	} else {
		var spaceScene = new SpaceScene();
		spaceScene.goForth();
	}
};

//thanks: http://stackoverflow.com/questions/8068052/phonegap-detect-if-running-on-desktop-browser
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
	console.log('running in app...');
	//window.plugins.insomnia.keepAwake();
	document.addEventListener("deviceready", onDeviceReady, false);
} else {
	console.log('running in browser...');
	onDeviceReady(); //this is the browser
}
