(function(){
	//show a message if webGL is not supported
	if(!Detector.webgl) {
		Detector.addGetWebGLMessage();
	} else {
		var spaceScene = new SpaceScene();
		spaceScene.goForth();
	}
})();