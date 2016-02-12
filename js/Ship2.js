//custom 3d object discussion:
//http://stackoverflow.com/questions/31923047/creating-custom-object3d-class

function Ship2() {

    var _s = this;

    _s.chassis;
    _s.chassisLoaded = false;
    _s.obj = new THREE.Object3D();

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

	_s.init = function() {
		_s.obj.add(_s.chassis);
	};
}