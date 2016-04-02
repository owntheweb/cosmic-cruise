function SpaceScene(viewMode) {

	if (viewMode == null) { viewMode = 'cardboard';}

	var _s = this;

	_s.viewMode = viewMode;

	_s.targetPlanetName = '';
	_s.curPlanetName = '';
	_s.navRolloverActive = false;

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
	_s.maxAnisotropy;

	_s.debug = true;
	_s.debugPaintText = '';
	_s.sceneInitiated = false;
	_s.sceneStopAnimating = false;

	_s.skybox;
	_s.ship;
	_s.solarSystem;

	//cursor
	_s.cursorCanvas;
	_s.cursorContext;
	_s.cursorCurRad = 2.0;
	_s.cursorMinRad = 1.0;
	_s.cursorMaxRad = 7.0;

	//veil/cover
	_s.veilActive = true;
	_s.veilOpacity = 1.0;

	//stats
	_s.stats;

	//audio
	_s.soundManager;

	_s.onResize = function() {
		var width = window.innerWidth;
		var height = window.innerHeight;

		_s.camera.aspect = width / height;
		_s.camera.updateProjectionMatrix();
		_s.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		_s.renderer.setSize(width, height);
		_s.effectFXAA.uniforms.resolution.value = new THREE.Vector2(1 / width, 1 / height);
		_s.composer.setSize(width, height);
		_s.composer.reset();

		_s.cursorContext.canvas.width = width;
		_s.cursorContext.canvas.height = height;
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
		var near = 1.1;
		var far = 7000000;
		_s.camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
		_s.camera.position.set(0,0,0);
		_s.camera.lookAt(_s.scene.position);

		//stereo camera (use main camera position/angle to produce a stereo L/R camera)
		_s.stereoCamera = new THREE.StereoCamera();
		_s.stereoCamera.eyeSeparation = _s.stereoCamera.eyeSeparation * 0.1;
		_s.stereoCamera.focalLength = _s.stereoCamera.focalLength * 0.1;

		//////////////
		// RENDERER //
		//////////////

		var canvas = document.getElementById("viewer");

		_s.renderer = new THREE.WebGLRenderer({antialias:true, canvas:canvas, alpha: true, clearColor: 0x000000 });
		_s.renderer.autoClear = false;
		_s.element = _s.renderer.domElement;

		_s.maxAnisotropy = _s.renderer.getMaxAnisotropy();

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
		_s.controls.enableZoom = false;
		_s.controls.autoRotate = false; //Android devices sometimes auto rotate?
		_s.controls.autoRotateSpeed = 0.0;

		///////////////////////////
		// ray trace/hover detect//
		///////////////////////////

		_s.projector = new THREE.Projector();
		_s.centerVector = new THREE.Vector3();

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

			//make camera re-face forward //!!! check this: May not be working still
			var vector = new THREE.Vector3(-1, 0, 0);
			_s.camera.lookAt(vector);

			//self.element.addEventListener('click', function() { _s.fullscreen(); }, false);

			window.removeEventListener("deviceorientation", setOrientationControls, true);
		};

		// automatically resize renderer
		window.addEventListener('resize', function() { _s.onResize(); }, true);
		window.addEventListener("deviceorientation", setOrientationControls, true);

		//click event (screen touch OR magnetic button press)
		_s.onClick = function() {
			var i;
			console.log('click!');

			if(_s.ship.navMenuActive == true && _s.navRolloverActive == true && _s.curPlanetName != _s.targetPlanetName) {

				//go there!
				for(i=0; i<_s.solarSystem.planetArray.length; i++) {
					if(_s.targetPlanetName == _s.solarSystem.planetArray[i].name) {
						_s.ship.navToPlanet(_s.solarSystem.planetArray[i], function() { _s.ship.toggleNavMenu(); }, _s.camera);
						break;
					}
				}
			}
		};
		window.addEventListener('click', function() {
			_s.onClick();
		});

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

			_s.skybox = new THREE.Mesh(new THREE.BoxGeometry(400000, 400000, 400000), skyBoxMaterial);
			_s.skybox.frustumCulled = false;

			_s.scene.add(_s.skybox);

		});

		///////////
		// LIGHT //
		///////////

		// create a light
		var light = new THREE.PointLight(0xffffff, 1.2);
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
		_s.ship = new Ship5();
		_s.ship.obj.position.x = -2000;
		_s.ship.obj.position.y = -2000;
		_s.ship.obj.position.z = -2000;
		_s.ship.maxAnisotropy = _s.maxAnisotropy; //make textures look sharper
		_s.ship.loadModels();
		_s.ship.obj.add(_s.camera); //if ship rotates, so does camera (as if you were in the ship)
		_s.solarSystem.system.add(_s.ship.obj);

		//cursor
		_s.cursorCanvas = document.getElementById("cursor");
		_s.cursorContext = _s.cursorCanvas.getContext('2d');

		//ensure size/scale is set correctly (wasn't during initial tests)
		_s.onResize();

		//audio/score manager
		_s.scoreManager = new ScoreManager();
		_s.scoreManager.init();

		//share with ship controls (??? better way to do this?)
		_s.ship.scoreManager = _s.scoreManager;

		//mark scene as initiated
		_s.sceneInitiated = true;



		///////////
		//TESTING//
		///////////

		/*
		_s.stats = new Stats();
		_s.stats.domElement.style.position = 'absolute';
		_s.stats.domElement.style.bottom = '0px';
		_s.stats.domElement.style.zIndex = 100;
		_s.container.appendChild( _s.stats.domElement );
		*/
		
		/*
		var gui = new dat.GUI();
		var f1 = gui.addFolder('Ship Position');
		f1.add(_s.ship.obj.position, 'x', -1000, 1000);
		f1.add(_s.ship.obj.position, 'y', -1000, 1000);
		f1.add(_s.ship.obj.position, 'z', -1000, 1000);
		var f2 = gui.addFolder('Ship Rotation');
		//!!! I want to see floats here but am seeing integers, how to update?
		f2.add(_s.ship.obj.rotation, 'x', 0.0, Math.PI * 2);
		f2.add(_s.ship.obj.rotation, 'y', 0.0, Math.PI * 2);
		f2.add(_s.ship.obj.rotation, 'z', 0.0, Math.PI * 2);
		*/
		
	};

	//draw cursor
	_s.drawCursor = function() {
		_s.cursorContext.clearRect(0, 0, _s.cursorCanvas.width, _s.cursorCanvas.height);
		
		if(_s.ship.navMenuActive == true || _s.cursorCurRad > _s.cursorMinRad) {
			_s.cursorContext.save();
			_s.cursorContext.strokeStyle = '#FFFFFF';
			_s.cursorContext.lineWidth = 1.5;
			_s.cursorContext.beginPath();
			
			//resize animate based on menu rollover status
			if(_s.navRolloverActive == true && _s.ship.navMenuActive == true) {
				_s.cursorCurRad += 1.0;
				if(_s.cursorCurRad > _s.cursorMaxRad) {
					_s.cursorCurRad = _s.cursorMaxRad;
				}
			} else {
				_s.cursorCurRad -= 1.0;
				if(_s.cursorCurRad < _s.cursorMinRad) {
					_s.cursorCurRad = _s.cursorMinRad;
				}
			}

			if(_s.viewMode == "cardboard") {
				//!!! trial and error, may need revised (22 seems to place cursor just over the nav)
				//!!! having an issue where it seems to interefere with depth perception, perhaps some double vision? What are your thoughts?
				var aspectMult = window.innerWidth / window.innerHeight * 24;

				_s.cursorContext.arc((window.innerWidth / 4) - (window.innerWidth / aspectMult), window.innerHeight / 2, _s.cursorCurRad, 0, 2 * Math.PI, false);
				_s.cursorContext.stroke();
				_s.cursorContext.moveTo((window.innerWidth / 4) + (window.innerWidth / 2) + (window.innerWidth / aspectMult), window.innerHeight / 2);
				_s.cursorContext.beginPath();
				_s.cursorContext.arc((window.innerWidth / 4) + (window.innerWidth / 2) + (window.innerWidth / aspectMult), window.innerHeight / 2, _s.cursorCurRad, 0, 2 * Math.PI, false);
			} else {
				_s.cursorContext.arc(window.innerWidth / 2, window.innerHeight / 2, _s.cursorCurRad, 0, 2 * Math.PI, false);
			}
			
			_s.cursorContext.stroke();
			_s.cursorContext.restore();
		}
	};

	//make menu hover effects possible
	_s.centerTrace = function() {
		var intersects, i, intersection, obj, img;

		if(_s.ship.navMenuActive == true) {
			
			_s.raycaster = new THREE.Raycaster(); // create once

			//set center of view vector
			centerVector = new THREE.Vector3();
			_s.centerVector.y = (window.innerHeight / 2 / window.innerHeight) * 2 - 1;

			if(_s.viewMode == "cardboard") {
				_s.centerVector.x = (window.innerWidth / 2 / window.innerWidth) * 2 - 1;
				_s.raycaster.setFromCamera(_s.centerVector, _s.stereoCamera.left);
			} else {
				_s.centerVector.x = (window.innerWidth / 2 / window.innerWidth) * 2 - 1;
				_s.raycaster.setFromCamera(_s.centerVector, _s.camera);
			}

			//reset rollover status
			_s.ship.resetNavMenuRollovers();

			//check for intersecting menu icons and set them as active
			intersects = _s.raycaster.intersectObjects(_s.ship.navMenuIconsObj.children);
			if(intersects.length > 0) {
				_s.navRolloverActive = true;
				for(i=0; i<intersects.length; i++) {
					intersects[i].object.active = true;
					_s.targetPlanetName = intersects[i].object.name;
				}
			} else {
				_s.navRolloverActive = false;
			}
		}
	};

	//fade in the scene
	_s.uncoverVeil = function() {
		if(_s.veilActive == true) {
			document.getElementById('veil').style.pointerEvents = "none";

			_s.veilOpacity -= 0.01;
			if(_s.veilOpacity <= 0.0) {
				_s.veilOpacity = 0.0;
				_s.veilActive = false;
				document.getElementById('veil').style.display = 'none';
			}

			document.getElementById('veil').style.opacity = _s.veilOpacity;
		}
	};

	//update scene elements
	_s.update = function() {
		var i, object, r;

		// delta = change in time since last call (in seconds)
		var delta = _s.clock.getDelta();

		_s.stereoCamera.update(_s.scene, _s.camera, window.innerWidth, window.innerHeight);

		_s.solarSystem.update(_s.camera, _s.ship.obj);

		_s.centerTrace();

		_s.drawCursor();

		_s.uncoverVeil();

		//_s.stats.update();
	};

	//render three.js scene
	_s.render = function() {
		//_s.renderer.clear();

		if(_s.viewMode == "cardboard") {
			//stereo Google Cardboard view
			_s.renderer.setViewport( 0, 0, window.innerWidth / 2, window.innerHeight);
			_s.renderPass.camera = _s.stereoCamera.left; //note: breaking rule by settings Class.camera directly xO
			_s.composer.render();

			_s.renderer.setViewport( window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
			_s.renderPass.camera = _s.stereoCamera.right; //note: breaking rule by settings Class.camera directly xO
			_s.composer.render();
		} else {
			//"cyclops mode" (single view)
			_s.renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight);
			_s.renderPass.camera = _s.camera;
			_s.composer.render();
		}
	};

	//"Go forth with forthness, into the depths of depthness."" --crazy web guy
	_s.goForth = function() {
		console.log('go forth!');

		_s.initScene();

		(function drawFrame() {
			window.requestAnimationFrame(drawFrame, _s.earthCanvas);

			if(_s.sceneInitiated == true && _s.sceneStopAnimating == false) {
			 	_s.update();
			 	_s.ship.update();
			 	_s.render();
			 	_s.controls.update();
			} else {
				console.log('space scene not ready yet...');
			}
		}());
	};
}
