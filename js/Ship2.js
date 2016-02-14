//custom 3d object discussion:
//http://stackoverflow.com/questions/31923047/creating-custom-object3d-class

function Ship2() {

    var _s = this;

    _s.chassis;
    _s.chassisLoaded = false;
    _s.obj = new THREE.Object3D();

    _s.warpEffectObj = new THREE.Object3D();
    _s.warpEffectBeams = [];
    
    _s.warpActive = false;
    //!!! need to set these with set/get methods
    _s.warpSpeed = 0.0;
    _s.warpAlpha = 0.0;

    _s.assignShipMaterials = function(materials) {
	    var i;

	    for(i=0;i<materials.length;i++) {
	        
	        //console.log(materials[i]);

	        if(materials[i].name == 'Ship Paint') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xffffff,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'greyMeterial'
	            });
	        } else if(materials[i].name == 'Screen') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x2EA535,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'greyMeterial'
	            });
	        } else if(materials[i].name == 'Seat') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x5A5A5A,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'seat'
	            });
	        } else if(materials[i].name == 'Can') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0xA02A28,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'can'
	            });
	        } 
	    }

	    return materials;
	};

	_s.loadModels = function() {
		var ship;
		var loader = new THREE.JSONLoader();

	    //load the back
	    loader.load( 'models/ship2.json', function ( geometry, materials ) {

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

		var warpFieldDiameter = 2500;
		var warpLength = 5000;
		
		_s.obj.add(_s.warpEffectObj);

		for(i=0; i<300; i++) {
			
			map = new THREE.TextureLoader().load( "img/warpBeam.png" );
		    geometry = new THREE.PlaneGeometry(120, 10);
			material = new THREE.MeshBasicMaterial( {map: map, opacity: 0.0, transparent: true, color: 0x007eff, blending: THREE.AdditiveBlending} );
			plane = new THREE.Mesh( geometry, material );

			plane.position.x = (Math.random() * warpFieldDiameter) - (warpFieldDiameter / 2);
			//move away from ship interior
			if(plane.position.x > 0 && plane.position.x < 50) {
				plane.position.x += 50;
			} else if(plane.position.x < 0 && plane.position.x > -50) {
				plane.position.x -= 50;
			}

			plane.position.y = (Math.random() * warpFieldDiameter) - (warpFieldDiameter / 2);
			//move away from ship interior
			if(plane.position.y > 0 && plane.position.y < 50) {
				plane.position.y += 50;
			} else if(plane.position.y < 0 && plane.position.y > -50) {
				plane.position.y -= 50;
			}

			//tilt plane to look towards center of ship initially
			plane.lookAt(new THREE.Vector3(0,0,0));

			plane.position.z = (Math.random() * warpLength) - (warpLength / 2);

			//hide until warp is engaged
			plane.visible = false;
			
			_s.warpEffectBeams.push(plane);
			_s.warpEffectObj.add(plane);
			
		}

	}

	_s.toggleWarp = function() {
		var i;

		if(_s.warpActive == false) {
			_s.warpActive = true;
			_s.warpAlpha = 0.0;

			for(i=0; i<_s.warpEffectBeams.length; i++) {
				_s.warpEffectBeams[i].visible = true;
				_s.warpEffectBeams[i].material.opacity = 0.0;
			}
		} else {
			_s.warpActive = false;
			
			for(i=0; i<_s.warpEffectBeams.length; i++) {
				_s.warpEffectBeams[i].visible = false;
			}
		}
	};

	_s.updateWarpEffect = function() {
		var i;
		var warpLength = 5000;

		if(_s.warpActive == true) {
			for(i=0; i<_s.warpEffectBeams.length; i++) {
				_s.warpEffectBeams[i].material.opacity = _s.warpAlpha;
				//_s.warpEffectBeams[i].scale.z = 1.0 + (1.0 + _s.warpAlpha) * 200;

				_s.warpEffectBeams[i].position.z -= _s.warpSpeed;
				if(_s.warpEffectBeams[i].position.z < -(warpLength / 2)) {
					_s.warpEffectBeams[i].position.z = (warpLength / 2);
				}
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