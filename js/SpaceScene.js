function SpaceScene() {

	var _s = this;
	
	//files
	_s.images = {};
	_s.fileCount = 0; //gets tallied later
	_s.filesLoaded = 0;
	_s.allFilesLoaded = false;

	//three.js scene
	_s.container;
	_s.scene;
	_s.camera;
	_s.renderer;
	_s.stereoCameras;
	_s.effectFXAA;
	_s.effectCopy;
	_s.effectBloom;
	_s.element;
	_s.controls;
	_s.clock;
	_s.composer;
	_s.renderPass;

	_s.debug = true;
	_s.debugPaintText = '';
	_s.sceneInitiated = false;
	_s.sceneStopAnimating = false;

	_s.skybox;
	_s.ship;
	_s.solarSystem;

	//stats
	_s.stats;

	//audio
	_s.musicLoaded = false;
	_s.musicPlaying = false;
	_s.music;

	//load files for scene
	_s.loadFiles = function() {

		//skybox
		_s.queueFile('./img/skybox/backSm.jpg', 'backSrc');
		_s.queueFile('./img/skybox/downSm.jpg', 'downSrc');
		_s.queueFile('./img/skybox/frontSm.jpg', 'frontSrc');
		_s.queueFile('./img/skybox/topSm.jpg', 'upSrc');
		_s.queueFile('./img/skybox/rightSm.jpg', 'rightSrc');
		_s.queueFile('./img/skybox/leftSm.jpg', 'leftSrc');
	};

	//add file to the queue
	_s.queueFile = function(src, name) {
		var image;
		
		image = new Image();
		//image.onload = function() { console.log(name + ' loaded'); this.onFileLoaded(); }.bind(this); //!!! temp
		image.onload = function() { console.log(name + ' loaded'); _s.onFileLoaded(); };
		image.src = src;
		_s.images[name] = image;
		_s.fileCount++;
	};

	//count files as they are loaded, init scene when all are loaded
	_s.onFileLoaded = function() {
		_s.filesLoaded++;
		if(_s.filesLoaded >= _s.fileCount) {
			console.log('all images loaded');
			_s.allFilesLoaded = true;
			_s.initScene();
		}
	};

	_s.onResize = function() {
		var width = window.innerWidth;
		var height = window.innerHeight;

		_s.camera.aspect = width / height;
		_s.camera.updateProjectionMatrix();
		_s.renderer.setSize(width, height);
		_s.effectFXAA.uniforms.resolution.value = new THREE.Vector2(1 / width, 1 / height);
		_s.composer.setSize(width, height);
		_s.composer.reset();
	};

	//put the scene together
	_s.initScene = function() {
		var i;


		_s.clock = new THREE.Clock();

		_s.container = document.getElementById("viewerContainer");

		///////////
		// SCENE //
		///////////

		_s.scene = new THREE.Scene();

		/////////////
		// CAMERAS //
		/////////////

		var screenW = window.innerWidth;
		var screenH = window.innerHeight;
		var viewAngle = 90;
		var aspectRatio = screenW / screenH;
		var near = 4;
		var far = 7000000;
		_s.camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
		_s.camera.position.set(0,0,0);
		_s.camera.lookAt(_s.scene.position);

		//stereo camera (use main camera position/angle to produce a stereo L/R camera)
		_s.stereoCamera = new THREE.StereoCamera();

		//////////////
		// RENDERER //
		//////////////
		
		var canvas = document.getElementById("viewer");

		_s.renderer = new THREE.WebGLRenderer({antialias:true, canvas:canvas, alpha: true, clearColor: 0x000000 });
		_s.renderer.autoClear = false;
		_s.element = _s.renderer.domElement;

		///////////
		//EFFECTS//
		///////////

		_s.effectCopy = new THREE.ShaderPass( THREE.CopyShader );
		_s.effectCopy.renderToScreen = true;

		_s.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		_s.effectFXAA.uniforms.resolution.value = new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight);
		
		///////////////////
		// effect composer
		///////////////////

		_s.renderPass = new THREE.RenderPass(_s.scene, _s.stereoCamera.left);
		_s.composer = new THREE.EffectComposer(_s.renderer);
		_s.composer.addPass(_s.renderPass);
		_s.composer.addPass(_s.effectFXAA);
		_s.composer.addPass(_s.effectCopy);

		//////////////
		// CONTROLS //
		//////////////

		// Our initial control fallback with mouse/touch events in case DeviceOrientation is not enabled
		_s.controls = new THREE.OrbitControls(_s.camera, _s.element);
		_s.controls.target.set(
			_s.camera.position.x,
			_s.camera.position.y,
			_s.camera.position.z + 0.0001
		);
		_s.controls.enablePan = false;
		_s.controls.enableZoom = false;

		////////////
		// EVENTS //
		////////////

		var setOrientationControls = function(e) {
			if (e == undefined || !e.alpha) {
				return;
			}
			
			_s.controls.enabled = false; //reset controls
			_s.controls = undefined;

			_s.controls = new THREE.DeviceOrientationControls(_s.camera, true);
			_s.controls.connect();
			_s.controls.update();
			//self.element.addEventListener('click', function() { _s.fullscreen(); }, false);

			window.removeEventListener("deviceorientation", setOrientationControls, true);
		};

		// automatically resize renderer
		window.addEventListener('resize', function() { _s.onResize(); }, true);
		window.addEventListener("deviceorientation", setOrientationControls, true);

		//click event (screen touch OR magnetic button press)
		_s.onClick = function() {
			console.log('click!');

			//!!! do something with the click
		};
		window.addEventListener('click', function() {
			_s.onClick();
		});

		///////////
		// STATS //
		///////////
		
		_s.stats = new Stats();
		_s.stats.domElement.style.position = 'absolute';
		_s.stats.domElement.style.bottom = '0px';
		_s.stats.domElement.style.zIndex = 100;
		_s.container.appendChild( _s.stats.domElement );

		////////////
		// SKYBOX //
		////////////

		//thanks: http://stackoverflow.com/questions/13541141/three-js-skybox-assigned-to-camera
		//shader that moves skybox with camera
		var skyboxShader = {'skybox': {
								uniforms: { "tCube": { type: "t", value: null },
								"tFlip": { type: "f", value: -1 } },
								vertexShader: [
									"varying vec3 vWorldPosition;",
									THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],
									"void main() {",
									"   vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
									"   vWorldPosition = worldPosition.xyz;",
									"   gl_Position = projectionMatrix * modelViewMatrix * vec4( position + cameraPosition, 1.0 );",
									THREE.ShaderChunk[ "logdepthbuf_vertex" ],
									"}"
								].join("\n"),
								fragmentShader: [
									"uniform samplerCube tCube;",
									"uniform float tFlip;",
									"varying vec3 vWorldPosition;",
									THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],
									"void main() {",
									"   gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );",
									THREE.ShaderChunk[ "logdepthbuf_fragment" ],
									"}"
								].join("\n")}
							};

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

			var cubeShader = skyboxShader.skybox;
			cubeShader.uniforms['tCube'].value = tex;

			var skyBoxMaterial = new THREE.ShaderMaterial({
			fragmentShader: cubeShader.fragmentShader,
			vertexShader: cubeShader.vertexShader,
			uniforms: cubeShader.uniforms,
			depthWrite: false,
			side: THREE.BackSide
			});

			_s.skybox = new THREE.Mesh(new THREE.BoxGeometry(4000000, 4000000, 4000000), skyBoxMaterial);
			_s.skybox.frustumCulled = false;

			_s.scene.add(_s.skybox);

		});

		///////////
		// LIGHT //
		///////////
		
		// create a light
		var light = new THREE.PointLight(0xffffff, 2);
		light.position.set(0,0,0);
		_s.scene.add(light);
		
		_s.scene.add( new THREE.AmbientLight( 0x111111 ) );

		////////////
		//GEOMETRY//
		////////////


		//solar system
		_s.solarSystem = new SolarSystem();
		_s.solarSystem.init(_s.camera);
		_s.scene.add(_s.solarSystem.system);

		//ship
		_s.ship = new Ship2();
		_s.ship.loadModels();
		_s.ship.obj.add(_s.camera); //if ship rotates, so does camera (as if you were in the ship)
		_s.solarSystem.system.add(_s.ship.obj);

		var gui = new dat.GUI();
		var f1 = gui.addFolder('Ship Position');
		f1.add(_s.ship.obj.position, 'x', -10000, 10000);
		f1.add(_s.ship.obj.position, 'y', -10000, 10000);
		f1.add(_s.ship.obj.position, 'z', -10000, 10000);
		var f2 = gui.addFolder('Ship Rotation');
		//!!! I want to see floats here but am seeing integers, how to update?
		f2.add(_s.ship.obj.rotation, 'x', 0.0, Math.PI * 2);
		f2.add(_s.ship.obj.rotation, 'y', 0.0, Math.PI * 2);
		f2.add(_s.ship.obj.rotation, 'z', 0.0, Math.PI * 2);

		//ensure size/scale is set correctly (wasn't during initial tests)
		_s.onResize();

		//mark scene as initiated
		_s.sceneInitiated = true;

		//!!! TEMP
		var lastPlanetInt = -1;
		var endlessFlight = function() {
			var randomPlanet = _s.solarSystem.planetArray[Math.floor(Math.random() * _s.solarSystem.planetArray.length)].planet;
			if(randomPlanet != lastPlanetInt) {
				lastPlanetInt = randomPlanet;
				console.log("We travel to " + randomPlanet.name + "! Weeeee!");
				_s.navToPlanet(randomPlanet, endlessFlight);
			} else {
				endlessFlight();
			}
		};
		endlessFlight();
	};

	_s.initMusic = function() {
		_s.music = new Howl({
			src: ['audio/Psychadelik_Pedestrian_-_07_-_Pacific.mp3'],
			autoplay: true,
			loop: true,
			volume: 1.0,
			onload: function() {
				_s.creativeMusicLoaded = true;
				console.log('creative music loaded');
			},
			onplay: function() {
				_s.creativeMusicPlaying = true;
				console.log('creative music started');
			},
			onend: function() {
				console.log('creative music stopped');
			}
		});
	};

	//reset if starting over (!!! may not need this any longer)
	_s.resetSpaceScene = function() {
		
	};

	//!!! It works!... sort of. I feel there are still issues here.
	//!!! Often planet collissions occur as overlapping stopping points
	_s.navToPlanet = function(to, finishCallback) {

		//!!! offset will likely change per planet, move this soon
		var exitPoint = new THREE.Vector3(0, -1300, 0);
		exitPoint.x += _s.ship.obj.position.x;
		exitPoint.y += _s.ship.obj.position.y;
		exitPoint.z += _s.ship.obj.position.z;
		
		//!!! approach "front" of planet, not bottom, fix this
		//!!! then need to navigate to desired talking point location
		//var arrivalOffset = new THREE.Vector3(0, -80, -0);
		//arrivalOffset.x += to.position.x;
		//arrivalOffset.y += to.position.y;
		//arrivalOffset.z += to.position.z;

		arrivalOffset = THREE.Utils.getPointInBetweenByLen(to.position, _s.ship.obj.position, 1550);

		var turnTo = new THREE.Object3D();
	    turnTo.position.x = exitPoint.x;
	    turnTo.position.y = exitPoint.y;
	    turnTo.position.z = exitPoint.z;
	    turnTo.rotation.order = "YXZ";
	    _s.ship.obj.rotation.order = "YXZ";
	    turnTo.lookAt(arrivalOffset);

		var tl = new TimelineLite();

		tl.to(_s.ship.obj.position, 6, { 
			delay: 2,
			ease: Power2.easeInOut, 
			x: exitPoint.x, 
			y: exitPoint.y, 
			z: exitPoint.z,
			onStart: function() { console.log('Moving away from departure point...'); },
		}).to(_s.ship.obj.rotation, 10, { 
			ease: Power2.easeInOut, 
			x: turnTo.rotation.x,
    		y: turnTo.rotation.y,
    		z: turnTo.rotation.z,
			onStart: function() { 
				console.log('Turning towards destination...'); 
			}
		}).to( _s.ship.obj.position, 20, { 
			ease: Power4.easeInOut, 
			x: (arrivalOffset.x), 
			y: (arrivalOffset.y), 
			z: (arrivalOffset.z),
			onStart: function() { console.log('Engage!'); },
			onComplete: finishCallback
		});
	}

	//update scene elements
	_s.update = function() {
		var i, object, r;

		// delta = change in time since last call (in seconds)
		var delta = _s.clock.getDelta();

		_s.stereoCamera.update(_s.scene, _s.camera, window.innerWidth, window.innerHeight);
		
		_s.solarSystem.update(_s.camera, _s.ship.obj);
		
		_s.stats.update();
	};

	//render three.js scene
	_s.render = function() { 
		//_s.renderer.clear();

		_s.renderer.setViewport( 0, 0, window.innerWidth / 2, window.innerHeight);
		_s.renderPass.camera = _s.stereoCamera.left; //note: breaking rule by settings Class.camera directly xO
		_s.composer.render();

		_s.renderer.setViewport( window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
		_s.renderPass.camera = _s.stereoCamera.right; //note: breaking rule by settings Class.camera directly xO
		_s.composer.render();
	};

	//"Go forth with forthness, into the depths of depthness."" --crazy web guy
	_s.goForth = function() {
		console.log('go forth!');

		_s.loadFiles();
		_s.initMusic();

		(function drawFrame() {
			window.requestAnimationFrame(drawFrame, _s.earthCanvas);

			if(_s.sceneInitiated == true && _s.sceneStopAnimating == false) {
			 	_s.update();
			 	_s.render();
			 	_s.controls.update();
			} else {
				console.log('space scene not ready yet...');
			}
		}());
	};
}
