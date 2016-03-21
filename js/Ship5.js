//custom 3d object discussion:
//http://stackoverflow.com/questions/31923047/creating-custom-object3d-class

function Ship5() {

    var _s = this;

    _s.chassis;
    _s.screen;
    _s.screenFace;
    _s.chair;
    _s.chassisLoaded = false;
    _s.screenLoaded = false;
    _s.screenFaceLoaded = false
    _s.chairLoaded = false;
    _s.obj = new THREE.Object3D();

    _s.warpField;
    _s.warpFieldDiameter = 400;
	_s.warpLength = 500;
    
    _s.warpActive = false;
    //!!! need to set these with set/get methods
    _s.warpSpeed = 0.0;
    _s.warpAlpha = 0.0;

    //screen
    _s.screenCanvas = document.getElementById("shipScreen");
    _s.screenCanvas.width = 512;
    _s.screenCanvas.height = 512;
	_s.screenContext = _s.screenCanvas.getContext("2d");
	_s.screenTexture = new THREE.Texture(_s.screenCanvas);
	_s.screenImage = new Image();
	_s.screenImage.onload = function() {
		_s.screenContext.drawImage(_s.screenImage, 0, 149);
		_s.screenTexture.needsUpdate = true;
	};


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
			_s.screenFace.position.y -= .54;

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
	};

	_s.areAllModelsLoaded = function() {	
	    if(_s.chassisLoaded == true && _s.screenLoaded == true && _s.chairLoaded == true && _s.screenFaceLoaded == true) {
	        _s.init();
	    }
	}

	_s.setupWarpEffect = function() {
		var i, map, geometry, material, plane;

		var mergedWarpGeometry = new THREE.Geometry();

		//create and merge individual warp "beams"
		map = new THREE.TextureLoader().load( "img/warpBeam.png" );
		material = new THREE.MeshBasicMaterial( {map: map, opacity: 0.0, transparent: true, color: 0x007eff, blending: THREE.AdditiveBlending } );

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

	}

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
	}

	_s.init = function() {
		_s.obj.add(_s.chassis);
		_s.obj.add(_s.chair);
		_s.obj.add(_s.screen);
		_s.obj.add(_s.screenFace);
		_s.setupWarpEffect();
	};

	_s.update = function() {
		_s.updateWarpEffect();
	};
}
