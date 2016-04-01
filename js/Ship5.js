//custom 3d object discussion:
//http://stackoverflow.com/questions/31923047/creating-custom-object3d-class

function Ship5() {

    var _s = this;

    _s.chassis;
    _s.screen;
    _s.screenFace;
    _s.chair;
    _s.navMenu;
    _s.navMenuIcon;
    _s.chassisLoaded = false;
    _s.screenLoaded = false;
    _s.screenFaceLoaded = false
    _s.chairLoaded = false;
    _s.navMenuLoaded = false;
    _s.navMenuIconLoaded = false;
    _s.obj = new THREE.Object3D();
    _s.pointer;

    _s.navMenuIcons = [];
    _s.navMenuIconsObj = new THREE.Object3D();

    _s.warpField;
    _s.warpFieldDiameter = 400;
	_s.warpLength = 500;
    
    _s.warpActive = false;
    //!!! need to set these with set/get methods
    _s.warpSpeed = 0.0;
    _s.warpAlpha = 0.0;

    _s.navMenuActive = false;
    _s.navMenuAlpha = 0.0;

    _s.maxAnisotropy = 1; //increase sharpness by setting this higher (set from SpaceScene.js)

    _s.lastPlanetName = 'nowhere'; //don't go to the same planet twice in a row.

    //screen
    _s.screenCanvas = document.getElementById("shipScreen");
    _s.screenCanvas.width = 512;
    _s.screenCanvas.height = 512;
	_s.screenContext = _s.screenCanvas.getContext("2d");
	_s.screenTexture = new THREE.Texture(_s.screenCanvas);
	_s.screenTexture.magFilter = THREE.NearestFilter;
	_s.screenTexture.minFilter = THREE.LinearMipMapLinearFilter;
	_s.screenTexture.anisotropy = _s.maxAnisotropy;
	_s.screenImage = new Image();
	_s.screenImage.onload = function() {
		_s.screenContext.drawImage(_s.screenImage, 0, 149);
		_s.screenTexture.needsUpdate = true;
	};

	//audio
	_s.scoreManager;


    _s.assignShipMaterials = function(materials) {
	    var i;

	    for(i=0;i<materials.length;i++) {

	        if(materials[i].name == 'hull') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                emissive: 0xffffff,
	                map: THREE.ImageUtils.loadTexture('img/shipHullMap.png'),
	                shading: THREE.FlatShading,
	                emissiveMap: THREE.ImageUtils.loadTexture('img/shipHullMap.png'),
	                name: 'hull'
	            });
	        } else if(materials[i].name == 'screen') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                emissive: 0xffffff,
	                map: THREE.ImageUtils.loadTexture('img/shipScreenMap.png'),
	                shading: THREE.FlatShading,
	                emissiveMap: THREE.ImageUtils.loadTexture('img/shipScreenMap.png'),
	                name: 'screen'
	            });
	        } else if(materials[i].name == 'screenFace') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xff0000,
	                emissive: 0xffffff,
	                map: _s.screenTexture,
	                shading: THREE.FlatShading,
	                emissiveMap: _s.screenTexture,
	                name: 'screenFace'
	            });
	        } else if(materials[i].name == 'chair') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                emissive: 0xffffff,
	                map: THREE.ImageUtils.loadTexture('img/shipChairMap.png'),
	                shading: THREE.FlatShading,
	                emissiveMap: THREE.ImageUtils.loadTexture('img/shipChairMap.png'),
	                name: 'chair'
	            });
	        } else if(materials[i].name == 'navMenuBack') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x1774ff,
	                emissive: 0x1774ff,
	                transparent: true,
	                opacity: 0.3,
	                shading: THREE.SmoothShading,
	                specular: 0.0,
	                name: 'navMenuBack',
	                depthWrite: false,
	            });
	        } else if(materials[i].name == 'navIcon') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                emissive: 0xffffff,
	                map: THREE.ImageUtils.loadTexture('img/nav/earth_nav2.png'),
	                emissiveMap: THREE.ImageUtils.loadTexture('img/nav/earth_nav2.png'),
	                transparent: true,
	                opacity: 0.6,
	                shading: THREE.FlatShading,
	                specular: 0.0,
	                name: 'navMenuIcon',
	                depthWrite: false,
	            });
	        }
	    }

	    return materials;
	};

	_s.loadModels = function() {
		var ship;
		var loader = new THREE.JSONLoader();

		var scale = 5;

	    //load the hull
	    loader.load( 'models/ship5Hull.json', function ( geometry, materials ) {

			materials = _s.assignShipMaterials(materials);

			_s.chassis = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			_s.chassis.scale.x = _s.chassis.scale.y = _s.chassis.scale.z = scale;
			_s.chassis.rotation.y = 0;
			_s.chassis.position.y -= .5;

			_s.chassisLoaded = true;
			_s.areAllModelsLoaded();
		});

		//load the screen
	    loader.load( 'models/ship5Screen.json', function ( geometry, materials ) {

			materials = _s.assignShipMaterials(materials);

			_s.screen = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			_s.screen.scale.x = _s.screen.scale.y = _s.screen.scale.z = scale;
			_s.screen.rotation.y = 0;
			_s.screen.position.y -= .5;

			_s.screenLoaded = true;
			_s.areAllModelsLoaded();
		});

		//load the screen
	    loader.load( 'models/ship5ScreenFace.json', function ( geometry, materials ) {

			materials = _s.assignShipMaterials(materials);

			_s.screenFace = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			_s.screenFace.scale.x = _s.screenFace.scale.y = _s.screenFace.scale.z = scale;
			_s.screenFace.rotation.y = 0;
			_s.screenFace.position.y -= .51;

			_s.screenFaceLoaded = true;
			_s.areAllModelsLoaded();
		});

		//load the chair
	    loader.load( 'models/ship5Chair.json', function ( geometry, materials ) {

			materials = _s.assignShipMaterials(materials);

			_s.chair = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			_s.chair.scale.x = _s.chair.scale.y = _s.chair.scale.z = scale;
			_s.chair.rotation.y = 0;
			_s.chair.position.y -= .5;

			_s.chairLoaded = true;
			_s.areAllModelsLoaded();
		});

		//load the nav menu
	    loader.load( 'models/navMenu.json', function ( geometry, materials ) {

			materials = _s.assignShipMaterials(materials);

			_s.navMenu = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			_s.navMenu.scale.x = _s.navMenu.scale.y = _s.navMenu.scale.z = scale;
			_s.navMenu.rotation.y = 0;
			_s.navMenu.position.y -= .5;

			_s.navMenu.visible = false;

			_s.navMenuLoaded = true;
			_s.areAllModelsLoaded();
		});

		//load the nav menu icon template
	    loader.load( 'models/navMenuIcon.json', function ( geometry, materials ) {

			materials = _s.assignShipMaterials(materials);

			_s.navMenuIcon = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			_s.navMenuIcon.scale.x = _s.navMenuIcon.scale.y = _s.navMenuIcon.scale.z = scale;
			_s.navMenuIcon.rotation.y = 0;
			_s.navMenuIcon.position.y += .2;

			//_s.navMenuIcon.visible = false;

			_s.navMenuIconLoaded = true;
			_s.areAllModelsLoaded();
		});
	};

	_s.areAllModelsLoaded = function() {	
	    if(_s.chassisLoaded == true && _s.screenLoaded == true && _s.chairLoaded == true && _s.screenFaceLoaded == true && _s.navMenuLoaded == true && _s.navMenuIconLoaded == true) {
	        _s.init();
	    }
	}

	_s.setupWarpEffect = function() {
		var i, map, geometry, material, plane;

		var mergedWarpGeometry = new THREE.Geometry();

		//create and merge individual warp "beams"
		map = new THREE.TextureLoader().load( "img/warpBeam.png" );
		material = new THREE.MeshBasicMaterial( {map: map, opacity: 0.0, transparent: true, color: 0x007eff, blending: THREE.AdditiveBlending, depthWrite: false } );

		for(i=0; i<150; i++) {
			
		    geometry = new THREE.PlaneGeometry(12, 1);
			plane = new THREE.Mesh(geometry);

			plane.position.x = (Math.random() * _s.warpFieldDiameter) - (_s.warpFieldDiameter / 2);
			//move away from ship interior
			if(plane.position.x > 0 && plane.position.x < 8) {
				plane.position.x += 8;
			} else if(plane.position.x < 0 && plane.position.x > -8) {
				plane.position.x -= 8;
			}

			plane.position.y = (Math.random() * _s.warpFieldDiameter) - (_s.warpFieldDiameter / 2);
			//move away from ship interior
			if(plane.position.y > 0 && plane.position.y < 8) {
				plane.position.y += 8;
			} else if(plane.position.y < 0 && plane.position.y > -8) {
				plane.position.y -= 8;
			}

			//tilt plane to look towards center of ship initially
			plane.lookAt(new THREE.Vector3(0,0,0));

			plane.position.z = (Math.random() * _s.warpLength) - (_s.warpLength / 2);

			//will ensure 
			plane.updateMatrix();

			mergedWarpGeometry.merge(plane.geometry, plane.matrix);
		}

		//duplicate warp field in the front and back of the "middle" field.
		//When camera hits start of foward duplicate field,
		//knock field back for a "seamless" warp cycle animation
		//(that also doesn't kill frame rate, merged beats individual beams)
		var mergedWarpCopyFront = new THREE.Mesh(mergedWarpGeometry.clone());
		var mergedWarpCopyBack = new THREE.Mesh(mergedWarpGeometry.clone());
		mergedWarpCopyFront.position.z += _s.warpLength;
		mergedWarpCopyBack.position.z -= _s.warpLength;
		mergedWarpCopyFront.updateMatrix();
		mergedWarpCopyBack.updateMatrix();
		mergedWarpGeometry.merge(mergedWarpCopyFront.geometry, mergedWarpCopyFront.matrix);
		mergedWarpGeometry.merge(mergedWarpCopyBack.geometry, mergedWarpCopyBack.matrix);

		_s.warpField = new THREE.Mesh(mergedWarpGeometry, material);
		_s.obj.add(_s.warpField);

	};

	_s.toggleWarp = function() {
		var i;

		if(_s.warpActive == false) {
			_s.warpActive = true;
			_s.warpAlpha = 0.0;
			_s.warpField.visible = true;
			_s.warpField.material.opacity = 0.0;
		} else {
			_s.warpActive = false;
			_s.warpField.visible = false;
		}
	};

	_s.updateWarpEffect = function() {
		var i;
		var warpLength = 500;

		if(_s.warpActive == true) {
			_s.warpField.material.opacity = _s.warpAlpha;
			_s.warpField.position.z -= _s.warpSpeed;
			if(_s.warpField.position.z <= -(warpLength / 2)) {
				_s.warpField.position.z = (warpLength / 2);
			}
		}
	};

	_s.setScreenImage = function(uri) {
		_s.screenImage.src = uri;
	};

	_s.toggleNavMenu = function() {
		var tl = new TimelineLite();
		var tl2 = new TimelineLite();
		var tl3 = new TimelineLite();

		if(_s.navMenuActive == false) {
			_s.resetNavMenuRollovers

			_s.navMenuActive = true;
			_s.navMenuAlpha = 0.0;
			_s.navMenu.position.y = -2.0;
			_s.navMenu.visible = true;
			_s.navMenuIconsObj.position.y = -2.0;
			_s.navMenuIconsObj.visible = true;

			tl.to(_s.navMenu.position, 1, { 
				ease: Power2.easeOut, 
				y: 0.0, 
			});

			tl3.to(_s.navMenuIconsObj.position, 1, { 
				ease: Power2.easeOut, 
				y: 0.0, 
			});

			tl2.to(_s, 1, { 
				ease: Power2.easeOut, 
				navMenuAlpha: 0.6, 
			});

		} else {
			_s.navMenuAlpha = 0.6;
			_s.navMenu.position.y = 0.0;
			_s.navMenuIconsObj.position.y = 0.0;

			tl.to(_s.navMenu.position, 0.5, { 
				ease: Power2.easeOut, 
				y: -2.0,
			});

			tl3.to(_s.navMenuIconsObj.position, 0.5, { 
				ease: Power2.easeOut, 
				y: -2.0,
			});

			tl2.to(_s, 0.5, { 
				ease: Power2.easeOut, 
				navMenuAlpha: 0.0,
				onComplete: function() {
					_s.navMenu.visible = false;
					_s.navMenuIconsObj.visible = false;
					_s.navMenuActive = false;
				}
			});
		}
	};

	_s.resetNavMenuRollovers = function() {
		for(i=0; i<_s.navMenuIcons.length; i++) {
			_s.navMenuIcons[i].active = false;
		}
	};

	_s.updateNavMenu = function() {
		var i;
		if(_s.navMenuActive == true) {
			//set alpha transitions
			_s.navMenu.material.materials[0].opacity = _s.navMenuAlpha;
			for(i=0; i<_s.navMenuIcons.length; i++) {
				if(_s.navMenuIcons[i].active == true) {
					_s.navMenuIcons[i].material.materials[0].opacity = 1.0;
				} else {
					_s.navMenuIcons[i].material.materials[0].opacity = _s.navMenuAlpha;
				}	
			}

		}
	};


	//travel to a new planet destination
	_s.navToPlanet = function(to, finishCallback, camera) {
		console.log(to.name + " " + _s.lastPlanetName);
		if(to.name != _s.lastPlanetName) {
			//update screen image
			_s.setScreenImage(to.screenImg);

			//ship voice: nav activated
			_s.scoreManager.playTalk(_s.scoreManager.systemTalkGo, -1);

			//play flight sound
			_s.scoreManager.playFlightSound();

			//close menu
			_s.toggleNavMenu();

			//prevent further action on menu
			//_s.navMenuActive = false;

			//!!! offset will likely change per planet, move this soon
			var exitPoint = new THREE.Vector3(0, -130, 0);
			exitPoint.x += _s.obj.position.x;
			exitPoint.y += _s.obj.position.y;
			exitPoint.z += _s.obj.position.z;
			
			//!!! approach "front" of planet, not bottom, fix this
			//!!! then need to navigate to desired talking point location
			//var arrivalOffset = new THREE.Vector3(0, -80, -0);
			//arrivalOffset.x += to.position.x;
			//arrivalOffset.y += to.position.y;
			//arrivalOffset.z += to.position.z;

			//!!! temp adjustment:
			// Traveling from Jupiter to Saturn makes Saturn's rings cut the ship in half!
			var offset = 155;
			if(to.name == "Saturn" && _s.lastPlanetName == "Jupiter") {
				var offset = 200; //stay away!
			}

			//prevent travel to same location twice
			_s.lastPlanetName = to.name;

			arrivalOffset = THREE.Utils.getPointInBetweenByLen(to.planet.position, _s.obj.position, offset);

			var turnTo = new THREE.Object3D();
		    turnTo.position.x = exitPoint.x;
		    turnTo.position.y = exitPoint.y;
		    turnTo.position.z = exitPoint.z;
		    turnTo.rotation.order = "YXZ";
		    _s.obj.rotation.order = "YXZ";
		    turnTo.lookAt(arrivalOffset);

			var tl = new TimelineLite();
			var tl2 = new TimelineLite();

			tl.to(_s.obj.position, 6, { 
				delay: 2,
				ease: Power2.easeInOut, 
				x: exitPoint.x, 
				y: exitPoint.y, 
				z: exitPoint.z,
				onStart: function() { 

					console.log('Moving away from departure point...'); 

					tl2.to(_s.obj.rotation, 8, { 
						ease: Power2.easeInOut, 
						x: turnTo.rotation.x,
			    		y: turnTo.rotation.y,
			    		z: turnTo.rotation.z,
						onStart: function() { 
							console.log('Turning towards destination...'); 
						}
					}).to( _s.obj.position, 20, { 
						ease: Power4.easeInOut, 
						x: (arrivalOffset.x), 
						y: (arrivalOffset.y), 
						z: (arrivalOffset.z),
						onStart: function() { console.log('Engage!');

							//initialize warp effect
							_s.toggleWarp();
							var tlWarp = new TimelineLite();
							var tlWarpSpeed = new TimelineLite();
							tlWarp.to(_s, 3, { 
								ease: Power2.easeIn,
								warpAlpha: 1.0,
							}).to(_s, 6, { 
								ease: Power4.easeOut,
								delay: 13,
								warpAlpha: 0.0,
								onComplete: function() {
									_s.toggleWarp();
								}
							});

							tlWarpSpeed.to(_s, 10, { 
								ease: Power2.easeIn,
								warpSpeed: 10.0
							}).to(_s, 12, { 
								ease: Power4.easeOut,
								warpSpeed: 0.0,
							});

							//initialize warp effect for camera (increased field of view)
							var tlCamera = new TimelineLite();
							tlCamera.to(camera, 6, { 
								delay: 1,
								ease: Power3.easeInOut,
								fov: 96
							}).to(camera, 6, { 
								delay: 5.5,
								ease: Power4.easeInOut,
								fov: 90
							});

						},
						onComplete: finishCallback
					});

				},
			});
		} else {
			//!!! notify user that no navigation will take place...
		}
	};

	//return a unique clone without shared attributes
	_s.cloneNavItem = function(item) {
		var clone = item.clone();

		return clone;
	}

	_s.initNavMenu = function() {
		var icon, i;

		//add the nav menu backdrop
		//_s.obj.add(_s.navMenuIcon);

		//a place to store higher resolution textures
		var navTextures = {};

		//Mercury icon
		navTextures.mercury = THREE.ImageUtils.loadTexture('img/nav/mercury_nav2.png');
		//navTextures.mercury.magFilter = THREE.NearestFilter;
		//navTextures.mercury.minFilter = THREE.LinearMipMapLinearFilter;
		navTextures.mercury.anisotropy = _s.maxAnisotropy;
		var icon = _s.navMenuIcon.clone();
		icon.material = icon.material.clone();
		icon.name = 'Mercury';
		icon.active = false;
		icon.material.materials[0].map = navTextures.mercury;
		icon.material.materials[0].emissiveMap = navTextures.mercury;
		icon.rotation.y = (Math.PI / 9) * 4;
		_s.navMenuIcons.push(icon);

		//Venus icon
		navTextures.venus = THREE.ImageUtils.loadTexture('img/nav/venus_nav2.png');
		navTextures.venus.anisotropy = _s.maxAnisotropy;
		var icon = _s.navMenuIcon.clone();
		icon.material = icon.material.clone();
		icon.name = 'Venus';
		icon.active = false;
		icon.material.materials[0].map = navTextures.venus;
		icon.material.materials[0].emissiveMap = navTextures.venus;
		icon.rotation.y = (Math.PI / 9) * 3;
		_s.navMenuIcons.push(icon);

		//Earth icon
		navTextures.earth = THREE.ImageUtils.loadTexture('img/nav/earth_nav2.png');
		navTextures.earth.anisotropy = _s.maxAnisotropy;
		var icon = _s.navMenuIcon.clone();
		icon.material = icon.material.clone();
		icon.name = 'Earth';
		icon.active = false;
		icon.material.materials[0].map = navTextures.earth;
		icon.material.materials[0].emissiveMap = navTextures.earth;
		icon.rotation.y = (Math.PI / 9) * 2;
		_s.navMenuIcons.push(icon);

		//Mars icon
		navTextures.mars = THREE.ImageUtils.loadTexture('img/nav/mars_nav2.png');
		navTextures.mars.anisotropy = _s.maxAnisotropy;
		var icon = _s.navMenuIcon.clone();
		icon.material = icon.material.clone();
		icon.name = 'Mars';
		icon.active = false;
		icon.material.materials[0].map = navTextures.mars;
		icon.material.materials[0].emissiveMap = navTextures.mars;
		icon.rotation.y = (Math.PI / 9) * 1;
		_s.navMenuIcons.push(icon);

		//Jupiter icon
		navTextures.jupiter = THREE.ImageUtils.loadTexture('img/nav/jupiter_nav2.png');
		navTextures.jupiter.anisotropy = _s.maxAnisotropy;
		var icon = _s.navMenuIcon.clone();
		icon.material = icon.material.clone();
		icon.name = 'Jupiter';
		icon.active = false;
		icon.material.materials[0].map = navTextures.jupiter;
		icon.material.materials[0].emissiveMap = navTextures.jupiter;
		//icon.rotation.y = -(Math.PI / 9) * 2;
		_s.navMenuIcons.push(icon);

		//Saturn icon
		navTextures.saturn = THREE.ImageUtils.loadTexture('img/nav/saturn_nav2.png');
		navTextures.saturn.anisotropy = _s.maxAnisotropy;
		var icon = _s.navMenuIcon.clone();
		icon.material = icon.material.clone();
		icon.name = 'Saturn';
		icon.active = false;
		icon.material.materials[0].map = navTextures.saturn;
		icon.material.materials[0].emissiveMap = navTextures.saturn;
		icon.rotation.y = -(Math.PI / 9) * 1;
		_s.navMenuIcons.push(icon);

		//Uranus icon
		navTextures.uranus = THREE.ImageUtils.loadTexture('img/nav/uranus_nav2.png');
		navTextures.uranus.anisotropy = _s.maxAnisotropy;
		var icon = _s.navMenuIcon.clone();
		icon.material = icon.material.clone();
		icon.name = 'Uranus';
		icon.active = false;
		icon.material.materials[0].map = navTextures.uranus;
		icon.material.materials[0].emissiveMap = navTextures.uranus;
		icon.rotation.y = -(Math.PI / 9) * 2;
		_s.navMenuIcons.push(icon);

		//Neptune icon
		navTextures.neptune = THREE.ImageUtils.loadTexture('img/nav/neptune_nav2.png');
		navTextures.neptune.anisotropy = _s.maxAnisotropy;
		var icon = _s.navMenuIcon.clone();
		icon.material = icon.material.clone();
		icon.name = 'Neptune';
		icon.active = false;
		icon.material.materials[0].map = navTextures.neptune;
		icon.material.materials[0].emissiveMap = navTextures.neptune;
		icon.rotation.y = -(Math.PI / 9) * 3;
		_s.navMenuIcons.push(icon);

		//Pluto icon
		navTextures.pluto = THREE.ImageUtils.loadTexture('img/nav/pluto_nav2.png');
		navTextures.pluto.anisotropy = _s.maxAnisotropy;
		var icon = _s.navMenuIcon.clone();
		icon.material = icon.material.clone();
		icon.name = 'Pluto';
		icon.active = false;
		icon.material.materials[0].map = navTextures.pluto;
		icon.material.materials[0].emissiveMap = navTextures.pluto;
		icon.rotation.y = -(Math.PI / 9) * 4;
		_s.navMenuIcons.push(icon);

		_s.obj.add(_s.navMenuIconsObj);

		for(i=0; i<_s.navMenuIcons.length; i++) {
			_s.navMenuIconsObj.add(_s.navMenuIcons[i]);
		}

		//hide menu to start
		_s.navMenuIconsObj.visible = false;

		//!!! this is currently causing issues, doing odd things with nav menu icons
		//_s.obj.add(_s.navMenu);

		//open the nav at the beginning
		_s.toggleNavMenu();

		/*
		//!!! TEMP
		var toggleNavInterval = setInterval(function(){
			_s.toggleNavMenu();
		}, 5000);
		*/

	};

	_s.init = function() {
		_s.obj.add(_s.chassis);
		_s.obj.add(_s.chair);
		_s.obj.add(_s.screen);
		_s.obj.add(_s.screenFace);
		_s.initNavMenu();
		_s.setScreenImage('img/screen/logo_screen.png');
		_s.setupWarpEffect();
	};

	_s.update = function() {
		_s.updateWarpEffect();
		_s.updateNavMenu();
	};
}
