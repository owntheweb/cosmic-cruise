document.addEventListener('deviceready', function() { 
    //keep app awake using insomnia plugin (added in config.xml)
    window.plugins.insomnia.keepAwake();

    //show a message if webGL is not supported
	if(!Detector.webgl) {
		Detector.addGetWebGLMessage();
	} else {
		var spaceScene = new SpaceScene();
		spaceScene.goForth();
	}

} , false);