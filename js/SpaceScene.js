function SpaceScene() {

	var _self = this;
	
	//files
	_self.images = {};
	_self.fileCount = 0; //gets tallied later
	_self.filesLoaded = 0;
	_self.allFilesLoaded = false;

	//three.js scene
	_self.container;
	_self.scene;
	_self.camera;
	_self.renderer;
	_self.stereoCameras;
	_self.effectFXAA;
	_self.effectCopy;
	_self.effectBloom;
	_self.element;
	_self.controls;
	_self.clock;
	_self.composer;
	_self.renderPass;

	_self.debug = true;
	_self.debugPaintText = '';
	_self.sceneInitiated = false;
	_self.sceneStopAnimating = false;

	_self.stereoCameras;

	_self.skybox;
	_self.ship;
	_self.solarSystem;

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

	_self.onResize = function() {
		var width = window.innerWidth;
		var height = window.innerHeight;

		_self.camera.aspect = width / height;
		_self.camera.updateProjectionMatrix();
		_self.renderer.setSize(width, height);
		_self.effectFXAA.uniforms.resolution.value = new THREE.Vector2(1 / width, 1 / height);
		_self.composer.setSize(width, height);
		_self.composer.reset();
	};

	//put the scene together
	_self.initScene = function() {
		var i;


		_self.clock = new THREE.Clock();

		_self.container = document.getElementById("viewerContainer");

		///////////
		// SCENE //
		///////////

		_self.scene = new THREE.Scene();

		/////////////
		// CAMERAS //
		/////////////

		var screenW = window.innerWidth;
		var screenH = window.innerHeight;
		var viewAngle = 90;
		var aspectRatio = screenW / screenH;
		var near = 4;
		var far = 7000000;
		_self.camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
		_self.camera.position.set(0,0,0);
		_self.camera.lookAt(_self.scene.position);

		//stereo camera (use main camera position/angle to produce a stereo L/R camera)
		_self.stereoCamera = new THREE.StereoCamera();

		//////////////
		// RENDERER //
		//////////////
		
		var canvas = document.getElementById("viewer");

		_self.renderer = new THREE.WebGLRenderer({antialias:true, canvas:canvas, alpha: true, clearColor: 0x000000 });
		_self.renderer.autoClear = false;
		_self.element = _self.renderer.domElement;

		///////////
		//EFFECTS//
		///////////

		_self.effectCopy = new THREE.ShaderPass( THREE.CopyShader );
		_self.effectCopy.renderToScreen = true;

		_self.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		_self.effectFXAA.uniforms.resolution.value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
		
		///////////////////
		// effect composer
		///////////////////

		_self.renderPass = new THREE.RenderPass(_self.scene, _self.stereoCamera.left);
		_self.composer = new THREE.EffectComposer(_self.renderer);
		_self.composer.addPass(_self.renderPass);
		_self.composer.addPass(_self.effectFXAA);
		_self.composer.addPass(_self.effectCopy);

		//////////////
		// CONTROLS //
		//////////////

		// Our initial control fallback with mouse/touch events in case DeviceOrientation is not enabled
		_self.controls = new THREE.OrbitControls(_self.camera, _self.element);
		_self.controls.target.set(
			_self.camera.position.x,
			_self.camera.position.y,
			_self.camera.position.z + 0.0001
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
			
			_self.controls.enabled = false; //reset controls
			_self.controls = undefined;

			_self.controls = new THREE.DeviceOrientationControls(_self.camera, true);
			_self.controls.connect();
			_self.controls.update();
			//self.element.addEventListener('click', function() { _self.fullscreen(); }, false);

			window.removeEventListener("deviceorientation", setOrientationControls, true);
		};

		// automatically resize renderer
		window.addEventListener('resize', function() { _self.onResize(); }, true);
		window.addEventListener("deviceorientation", setOrientationControls, true);

		//click event (screen touch OR magnetic button press)
		_self.onClick = function() {
			console.log('click!');

			//!!! do something with the click
		};
		window.addEventListener('click', function() {
			_self.onClick();
		});
		
		console.log(navigator.compass);
		if(navigator.compass != undefined) {
			console.log('There is a compass!');
			
			var onHeadingSuccess = function(heading) {
			    console.log(heading.magneticHeading);

			    //!!! is it a "click?". Figure that one out...
			};

			var onHeadingError = function(compassError) {
			    console.log('Compass error: ' + compassError.code);
			};

			//iOS does better with heading filter (call function after change in degrees)
			//Android does not support filter
			//more details at: https://github.com/apache/cordova-plugin-device-orientation
			var devicePlatform = device.platform;
			console.log(devicePlatform);
			if(devicePlatform == "iOS") {
				var options = {filter: 2};
			} else if(devicePlatform == "Android") {
				var options = {frequency: 100};
			}
			var watchID = navigator.compass.watchHeading(onHeadingSuccess, onHeadingError, options);
		} else {
			console.log('no compass detected');
		}


		///////////
		// STATS //
		///////////
		
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

			_self.skybox = new THREE.Mesh(new THREE.BoxGeometry(4000000, 4000000, 4000000), skyBoxMaterial);
			_self.scene.add(_self.skybox);

		});

		///////////
		// LIGHT //
		///////////
		
		// create a light
		var light = new THREE.PointLight(0xffffff, 2);
		light.position.set(0,0,0);
		_self.scene.add(light);
		
		_self.scene.add( new THREE.AmbientLight( 0x111111 ) );

		////////////
		//GEOMETRY//
		////////////


		//solar system
		_self.solarSystem = new SolarSystem();
		_self.solarSystem.init(_self.camera);
		_self.scene.add(_self.solarSystem.system);

		//ship
		_self.ship = new Ship2();
		_self.ship.loadModels();
		_self.ship.obj.add(_self.camera); //if ship rotates, so does camera (as if you were in the ship)
		_self.solarSystem.system.add(_self.ship.obj);

		//!!! TEMP
		//_self.ship.obj.position.x = -1674;
		//_self.ship.obj.position.y = 34;
		//_self.ship.obj.position.z = 98;
		//_self.ship.obj.position.x = -10000;
		//_self.ship.obj.position.y = 500;
		//_self.ship.obj.position.z = -10000;
		//_self.ship.obj.rotation.x = 0.6;
		//_self.ship.obj.rotation.y = 2;
		//_self.ship.obj.rotation.z = 0.1;

		var gui = new dat.GUI();
		var f1 = gui.addFolder('Ship Position');
		f1.add(_self.ship.obj.position, 'x', -10000, 10000);
		f1.add(_self.ship.obj.position, 'y', -10000, 10000);
		f1.add(_self.ship.obj.position, 'z', -10000, 10000);
		var f2 = gui.addFolder('Ship Rotation');
		//!!! I want to see floats here but am seeing integers, how to update?
		f2.add(_self.ship.obj.rotation, 'x', 0.0, Math.PI * 2);
		f2.add(_self.ship.obj.rotation, 'y', 0.0, Math.PI * 2);
		f2.add(_self.ship.obj.rotation, 'z', 0.0, Math.PI * 2);

		//ensure size/scale is set correctly (wasn't during initial tests)
		_self.onResize();

		//mark scene as initiated
		_self.sceneInitiated = true;

		//!!! TEMP
		var endlessFlight = function() {
			var randomPlanet = _self.solarSystem.planets[Math.floor(Math.random() * _self.solarSystem.planets.length)];
			console.log("We travel to " + randomPlanet.name + "! Weeeee!");
			_self.navToPlanet(randomPlanet, endlessFlight);
		};
		endlessFlight();
	};

	_self.initMusic = function() {
		_self.music = new Howl({
			src: ['audio/Psychadelik_Pedestrian_-_07_-_Pacific.mp3'],
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
	};

	//reset if starting over (!!! may not need this any longer)
	_self.resetSpaceScene = function() {
		
	};

	//!!! It works!... sort of. I feel there are still issues here.
	//!!! Often planet collissions occur as overlapping stopping points
	_self.navToPlanet = function(to, finishCallback) {
		//!!! offset will likely change per planet, move this soon
		var exitPoint = new THREE.Vector3(0, -150, 0).add(_self.ship.obj.position);
		var arrivalOffset = new THREE.Vector3(100, -60, -50).add(to.position);

		//!!! not working as expected, ship doesn't turn towards target always
		//!!! sometimes it's messed up (time to study)
		var shipRef = new THREE.Object3D();
		shipRef.position = _self.ship.obj.position;
		shipRef.rotation = _self.ship.obj.rotation;
		shipRef.lookAt(to.position);
		var destinationTurn = shipRef.rotation;

		var tl = new TimelineLite();

		tl.to(_self.ship.obj.position, 6, { 
			ease: Power2.easeInOut, 
			x: (exitPoint.x), 
			y: (exitPoint.y), 
			z: (exitPoint.z),
			onStart: function() { console.log('Moving away from departure point...'); }
		}).to(_self.ship.obj.rotation, 10, { 
			ease: Power1.easeInOut, 
			x: (destinationTurn.x), 
			y: (destinationTurn.y), 
			z: (destinationTurn.z),
			onStart: function() { console.log('Turning towards destination...'); }
		}).to( _self.ship.obj.position, 10, { 
			ease: Power4.easeInOut, 
			x: (arrivalOffset.x), 
			y: (arrivalOffset.y), 
			z: (arrivalOffset.z),
			onStart: function() { console.log('Engage!'); },
			onComplete: finishCallback
		});
	}

	//update scene elements
	_self.update = function() {
		var i, object, r;

		// delta = change in time since last call (in seconds)
		var delta = _self.clock.getDelta();

		//!!! this is causing errors until skybox textures are loaded
		_self.skybox.position = _self.ship.obj.position;
		
		//console.log(_self.skybox.position);
		//console.log(_self.camera.position);

		_self.stereoCamera.update(_self.scene, _self.camera, window.innerWidth, window.innerHeight);
		
		_self.solarSystem.update(_self.camera);

		//!!! TEMP
		//_self.ship.obj.position.x -= 0.4;
		//_self.ship.obj.position.y += 0.4;
		//_self.ship.obj.position.z -= 0.4;

		//_self.ship.obj.rotation.y -= 0.0001;
		//_self.solarSystem.mars.rotation.y += 0.00005;

		//console.log(_self.ship.obj.position);
		
		_self.stats.update();
	};

	//render three.js scene
	_self.render = function() { 
		//_self.renderer.clear();

		_self.renderer.setViewport( 0, 0, window.innerWidth / 2, window.innerHeight);
		_self.renderPass.camera = _self.stereoCamera.left; //note: breaking rule by settings Class.camera directly xO
		_self.composer.render();

		_self.renderer.setViewport( window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
		_self.renderPass.camera = _self.stereoCamera.right; //note: breaking rule by settings Class.camera directly xO
		_self.composer.render();
	};

	//"Go forth with forthness, into the depths of depthness."" --crazy web guy
	_self.goForth = function() {
		console.log('go forth!');

		_self.loadFiles();
		_self.initMusic();

		(function drawFrame() {
			window.requestAnimationFrame(drawFrame, _self.earthCanvas);

			if(_self.sceneInitiated == true && _self.sceneStopAnimating == false) {
			 	_self.update();
			 	_self.render();
			 	_self.controls.update();
			} else {
				console.log('space scene not ready yet...');
			}
		}());
	};
}
