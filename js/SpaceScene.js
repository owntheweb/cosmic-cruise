function SpaceScene() {

	var _self = this;

	//class vars
	_self.debug = true;
	_self.debugPaintText = '';
	_self.sceneInitiated = false;
    _self.sceneStopAnimating = false;
	
	//files
	_self.images = {};
	_self.fileCount = 0; //gets tallied later
	_self.filesLoaded = 0;
	_self.allFilesLoaded = false;

	//three.js scene
	_self.container;
	_self.scene;
	_self.sceneSkybox;
	_self.camera;
	_self.renderer;
	_self.effect;
	_self.element;
	_self.controls;
	_self.clock;

	//stats
	_self.stats;

	//audio
	_self.musicLoaded = false;
	_self.musicPlaying = false;
	_self.music;

	//load files for scene
	_self.loadFiles = function() {

		//skybox
		_self.queueFile('./img/skybox/backSm.jpg', 'backSrc');
		_self.queueFile('./img/skybox/downSm.jpg', 'downSrc');
		_self.queueFile('./img/skybox/frontSm.jpg', 'frontSrc');
		_self.queueFile('./img/skybox/topSm.jpg', 'upSrc');
		_self.queueFile('./img/skybox/rightSm.jpg', 'rightSrc');
		_self.queueFile('./img/skybox/leftSm.jpg', 'leftSrc');
	};

	//add file to the queue
	_self.queueFile = function(src, name) {
		var image;
		
		image = new Image();
		//image.onload = function() { console.log(name + ' loaded'); this.onFileLoaded(); }.bind(this); //!!! temp
		image.onload = function() { console.log(name + ' loaded'); _self.onFileLoaded(); };
		image.src = src;
		_self.images[name] = image;
		_self.fileCount++;
	};

	//count files as they are loaded, init scene when all are loaded
	_self.onFileLoaded = function() {
		_self.filesLoaded++;
		if(_self.filesLoaded >= _self.fileCount) {
			console.log('all images loaded');
			_self.allFilesLoaded = true;
			_self.initScene();
		}
	};

	//request to go full screen
	//!!! note: disabled for now as not needed for app envirnment, also interferes with interface overlay at the moment
	//!!! keep here for now in case this can be used online as web-app
	/*
	_self.fullscreen = function() {
		if(_self.container.requestFullscreen) {
			_self.container.requestFullscreen();
		} else if (_self.container.msRequestFullscreen) {
			_self.container.msRequestFullscreen();
		} else if (self.container.mozRequestFullScreen) {
			_self.container.mozRequestFullScreen();
		} else if (_self.container.webkitRequestFullscreen) {
			_self.container.webkitRequestFullscreen();
		}
	};
	*/

	_self.onResize = function() {
		var width = window.innerWidth;
	    var height = window.innerHeight;

	    _self.camera.aspect = width / height;
	    _self.camera.updateProjectionMatrix();
	    _self.renderer.setSize(width, height);
	    _self.effect.setSize(width, height);
	};

	//put the scene together
	_self.initScene = function() {
		var i;

	    _self.clock = new THREE.Clock();

		//three.js container
		_self.container = document.getElementById("viewerContainer");

		///////////
	    // SCENE //
	    ///////////

	    _self.scene = new THREE.Scene();
	    _self.sceneSkybox = new THREE.Scene();

	    ////////////
	    // CAMERA //
	    ////////////

	    var screenW = window.innerWidth;
	    var screenH = window.innerHeight;   
	    var viewAngle = 90;
	    var aspectRatio = screenW / screenH;
	    var near = 0.001;
	    var far = 10000;
	    _self.camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
	    _self.camera.position.set(0,0,0);
	    _self.camera.lookAt(_self.scene.position);

	    //////////////
	    // RENDERER //
	    //////////////
	    
	    var canvas = document.getElementById("viewer");

	    // create and start the renderer; choose antialias setting.
	    if (Detector.webgl) {
	        console.log('using WebGLRenderer');
	        _self.renderer = new THREE.WebGLRenderer({antialias:true, canvas:canvas});
	    } else {
	        console.log('using CanvasRenderer');
	        _self.renderer = new THREE.CanvasRenderer({antialias:true, canvas:canvas}); 
	    }

	    _self.renderer.autoClear = false;
	    _self.element = _self.renderer.domElement;

	    //////////
	    //EFFECT//
	    //////////

	    _self.effect = new THREE.StereoEffect(_self.renderer, 3, 15);
	    _self.effectSkybox = new THREE.StereoEffect(_self.renderer, 3, 15);

	    //////////////
	    // CONTROLS //
	    //////////////

	    // Our initial control fallback with mouse/touch events in case DeviceOrientation is not enabled
		_self.controls = new THREE.OrbitControls(_self.camera, _self.element);
		_self.controls.target.set(
			_self.camera.position.x,
			_self.camera.position.y,
			_self.camera.position.z - 0.0001
		);
		_self.controls.enablePan = false;
		_self.controls.enableZoom = false;

	    ////////////
	    // EVENTS //
	    ////////////

	    var setOrientationControls = function(e) {
			if (e == undefined || !e.alpha) {
				return;
			}
			
			_self.controls = null; //reset controls

			_self.controls = new THREE.DeviceOrientationControls(_self.camera, true);
			_self.controls.connect();
			_self.controls.update();
			//self.element.addEventListener('click', function() { _self.fullscreen(); }, false);

			window.removeEventListener("deviceorientation", setOrientationControls, true);
		};

	    // automatically resize renderer
	    window.addEventListener('resize', function() { _self.onResize(); }, true);
	    window.addEventListener("deviceorientation", setOrientationControls, true);

	    ///////////
	    // STATS //
	    ///////////
	    
	    // displays current and past frames per second attained by scene
	    _self.stats = new Stats();

	    _self.stats.domElement.style.position = 'absolute';
	    _self.stats.domElement.style.bottom = '0px';
	    _self.stats.domElement.style.zIndex = 100;
	    _self.container.appendChild( _self.stats.domElement );

	    ////////////
	    // SKYBOX //
	    ////////////

	    var cubeTexLoader = new THREE.CubeTextureLoader();
		var cubeUrls = [
		    "./img/skybox/rightSm.jpg",
		    "./img/skybox/leftSm.jpg",
		    "./img/skybox/topSm.jpg",
		    "./img/skybox/downSm.jpg",
		    "./img/skybox/frontSm.jpg",
		    "./img/skybox/backSm.jpg"
		];
		cubeTexLoader.load( cubeUrls, function(tex) {

			var cubeShader = THREE.ShaderLib['cube'];
		    cubeShader.uniforms['tCube'].value = tex;

		    var skyBoxMaterial = new THREE.ShaderMaterial({
		        fragmentShader: cubeShader.fragmentShader,
		        vertexShader: cubeShader.vertexShader,
		        uniforms: cubeShader.uniforms,
		        depthWrite: false,
		        side: THREE.BackSide
		    });

		    var skybox = new THREE.Mesh(new THREE.BoxGeometry(6000, 6000, 6000), skyBoxMaterial);
		    _self.sceneSkybox.add(skybox);

		});

	    ///////////
	    // LIGHT //
	    ///////////
	    
	    // create a light
	    var light = new THREE.PointLight(0xffffff);
	    light.position.set(0,250,250);
	    _self.scene.add(light);
	    _self.scene.add( new THREE.AmbientLight( 0xcccccc ) );

	    /////////////////
	    //TEST GEOMETRY//
	    /////////////////

	    var geometry = new THREE.BoxGeometry(20, 20, 20);
	    var i, object;
		for (i=0; i<800; i++) {
			object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff } ));

			object.position.x = Math.random() * 2000 - 1000;
			object.position.y = Math.random() * 2000 - 1000;
			object.position.z = Math.random() * 2000 - 1000;

			object.rotation.x = Math.random() * 2 * Math.PI;
			object.rotation.y = Math.random() * 2 * Math.PI;
			object.rotation.z = Math.random() * 2 * Math.PI;

			object.scale.x = object.scale.y = object.scale.z = 1.0;

			_self.scene.add(object);

		}

		object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xff9900 } ));

		object.position.x = 0;
		object.position.y = 0;
		object.position.z = -40;

		object.rotation.x = Math.random() * 2 * Math.PI;
		object.rotation.y = Math.random() * 2 * Math.PI;
		object.rotation.z = Math.random() * 2 * Math.PI;

		object.scale.x = object.scale.y = object.scale.z = 1.0;

		_self.scene.add(object);

		var geometry = new THREE.BoxGeometry( 200, 200, 200 );
		var material = new THREE.MeshBasicMaterial({ color: '#FF9900' });
		var position = THREE.Vector3(1.0, 1.0, 1.0);

		var mesh = new THREE.Mesh(geometry, material);
		_self.scene.add(mesh);

	    //ensure size/scale is set correctly (wasn't during initial tests)
	    _self.onResize();

	    //mark scene as initiated
	    _self.sceneInitiated = true;
	};

	_self.initMusic = function() {
		/*
		_self.creativeMusic = new Howl({
			src: ['music/spaced-out-by-john-rumbach.mp3'],
			autoplay: true,
			loop: true,
			volume: 1.0,
			onload: function() {
				_self.creativeMusicLoaded = true;
				console.log('creative music loaded');
			},
			onplay: function() {
				_self.creativeMusicPlaying = true;
				console.log('creative music started');
			},
			onend: function() {
				console.log('creative music stopped');
			}
		});
		*/
	};

	//reset if starting over (!!! may not need this any longer)
	_self.resetSpaceScene = function() {
		
	};

	//update scene elements
	_self.update = function() {
	    var i, object, r;

	    // delta = change in time since last call (in seconds)
	    var delta = _self.clock.getDelta();

	    for (i=0; i<_self.scene.children.length; i++) {
			object = _self.scene.children[i];
			r = _self.clock.elapsedTime * 0.1;
			object.rotation.x = object.rotation.y = object.rotation.z = r;
		}
	        
	    _self.stats.update();
	};

	//render three.js scene
	_self.render = function() {   
	    //_self.renderer.clear();
		//_self.effect.render(_self.sceneSkybox, _self.camera);
		//_self.renderer.clearDepth();
		_self.effect.render(_self.scene, _self.camera);
	};

	//"Go forth with forthness, into the depths of depthness."" --crazy web guy
	_self.goForth = function() {
		console.log('go forth!');

		_self.loadFiles();
		_self.initMusic();

		(function drawFrame() {
			window.requestAnimationFrame(drawFrame, _self.earthCanvas);

			if(_self.sceneInitiated == true && _self.sceneStopAnimating == false) {
		       	_self.render();
		       	_self.update();
		       	_self.controls.update();       
		    } else {
		    	console.log('space scene not ready yet...');
		    }
		}());
	};
}