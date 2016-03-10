//custom 3d object discussion:
//http://stackoverflow.com/questions/31923047/creating-custom-object3d-class

function Ship3() {

    var _s = this;

    _s.chassis;
    _s.chassisLoaded = false;
    _s.obj = new THREE.Object3D();

    _s.warpField;
    _s.warpFieldDiameter = 2500;
	_s.warpLength = 5000;
    
    _s.warpActive = false;
    //!!! need to set these with set/get methods
    _s.warpSpeed = 0.0;
    _s.warpAlpha = 0.0;

    _s.assignShipMaterials = function(materials) {
	    var i;

	    for(i=0;i<materials.length;i++) {
	        
	        //console.log(materials[i]);

	        if(materials[i].name == 'Material') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xE7E7E7,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'lightGrayMeterial'
	            });
	        } else if(materials[i].name == 'Screen') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x004291,
	                emissive: 0x004291,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'screen'
	            });
	        } else if(materials[i].name == 'Plant') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x009d0b,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'plant'
	            });
	        } else if(materials[i].name == 'Bolts') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xE7E7E7,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'bolts'
	            });
	        } else if(materials[i].name == 'Button Fade') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xD0E769,
	                emissive: 0xD0E769,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'buttonFade'
	            });
	        } else if(materials[i].name == 'Red Button') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xE70007,
	                emissive: 0xE70007,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'redButton'
	            });
	        } else if(materials[i].name == 'Blue Button') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x004BE7,
	                emissive: 0x004BE7,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'blueButton'
	            });
	        } else if(materials[i].name == 'Green Button') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xD0E769,
	                emissive: 0xD0E769,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'greenButton'
	            });
	        } else if(materials[i].name == 'Buttons') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xE7E7E7,
	                emissive: 0xE7E7E7,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'buttons'
	            });
	        } else if(materials[i].name == 'Cup Holder') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x6B2521,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'cupHolder'
	            });
	        } else if(materials[i].name == 'Arm') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x868686,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'arm'
	            });
	        } else if(materials[i].name == 'Lights') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xFFFFFF,
	                emissive: 0xFFFFFF,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'lights'
	            });
	        } 
	    }

	    return materials;
	};

	_s.loadModels = function() {
		var ship;
		var loader = new THREE.JSONLoader();

	    //load the back
	    loader.load( 'models/ship3.json', function ( geometry, materials ) {

			materials = _s.assignShipMaterials(materials);

			_s.chassis = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			_s.chassis.scale.x = _s.chassis.scale.y = _s.chassis.scale.z = 25;
			_s.chassis.rotation.y = 0;

			_s.chassisLoaded = true;
			_s.areAllModelsLoaded();
		});
	};

	_s.areAllModelsLoaded = function() {	
	    if(_s.chassisLoaded == true) {
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
			
		    geometry = new THREE.PlaneGeometry(120, 10);
			plane = new THREE.Mesh(geometry);

			plane.position.x = (Math.random() * _s.warpFieldDiameter) - (_s.warpFieldDiameter / 2);
			//move away from ship interior
			if(plane.position.x > 0 && plane.position.x < 50) {
				plane.position.x += 50;
			} else if(plane.position.x < 0 && plane.position.x > -50) {
				plane.position.x -= 50;
			}

			plane.position.y = (Math.random() * _s.warpFieldDiameter) - (_s.warpFieldDiameter / 2);
			//move away from ship interior
			if(plane.position.y > 0 && plane.position.y < 50) {
				plane.position.y += 50;
			} else if(plane.position.y < 0 && plane.position.y > -50) {
				plane.position.y -= 50;
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
		var warpLength = 5000;

		if(_s.warpActive == true) {
			_s.warpField.material.opacity = _s.warpAlpha;
			_s.warpField.position.z -= _s.warpSpeed;
			if(_s.warpField.position.z <= -(warpLength / 2)) {
				_s.warpField.position.z = (warpLength / 2);
			}
		}
	};

	_s.init = function() {
		_s.obj.add(_s.chassis);
		_s.setupWarpEffect();
	};

	_s.update = function() {
		_s.updateWarpEffect();
	};
}