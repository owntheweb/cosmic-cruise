document.addEventListener('deviceready', function() { 
    //keep app awake using insomnia plugin (added in config.xml)
    window.plugins.insomnia.keepAwake();

	var start = function() {
	    //show a message if webGL is not supported
		if(!Detector.webgl) {
			Detector.addGetWebGLMessage();
		} else {
			var spaceScene = new SpaceScene();
			spaceScene.goForth();
		}
	};

	//temporary delay to start for PhoneGap Build troubleshooting purposes
	var tempStartDelay = setTimeout(start, 5000);

} , false);