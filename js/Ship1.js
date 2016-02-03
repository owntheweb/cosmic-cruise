//custom 3d object discussion:
//http://stackoverflow.com/questions/31923047/creating-custom-object3d-class

function Ship1() {

    var _self = this;

    _self.chassis;
    _self.chassisLoaded = false;
    _self.obj = new THREE.Object3D();

    _self.assignShipMaterials = function(materials) {
	    var i;

	    for(i=0;i<materials.length;i++) {
	        
	        //console.log(materials[i]);

	        if(materials[i].name == 'grey') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x777777,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'greyMeterial'
	            });
	        } else if(materials[i].name == 'darkGrey') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x3B3B3B,
	                shading: THREE.FlatShading,
	                //reflectivity: 0.3,
	                //envMap: self.cubemap,
	                name: 'darkGreyMaterial'
	            });
	        } else if(materials[i].name == 'white') {
	            materials[i] = new THREE.MeshPhongMaterial({
	                color: 0x111111,
	                shading: THREE.FlatShading,
	                //reflectivity: 1.0,
	                //envMap: self.cubemap,
	                name: 'whiteMaterial'
	            });
	        } 
	    }

	    return materials;
	};

	_self.loadModels = function() {
		var ship;
		var loader = new THREE.JSONLoader();

	    //load the back
	    loader.load( 'models/ship1.json', function ( geometry, materials ) {

			materials = _self.assignShipMaterials(materials);

			_self.chassis = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			_self.chassis.scale.x = _self.chassis.scale.y = _self.chassis.scale.z = 50;
			_self.chassis.rotation.y = Math.PI;
	        _self.chassis.position.y = -60;
	        _self.chassis.position.z = -40;

			_self.chassisLoaded = true;
			_self.areAllModelsLoaded();
		});
	};

	_self.areAllModelsLoaded = function() {	
	    if(_self.chassisLoaded == true) {
	        _self.init();
	    }
	}

	_self.init = function() {
		_self.obj.add(_self.chassis);
	};
}