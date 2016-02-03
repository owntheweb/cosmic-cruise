//inspired by and referenced from Planets.js:
//https://github.com/jeromeetienne/threex.planets
//took an altered development route to address solar system travel and new shaders

function SolarSystem() {
	var _self = this;

	_self.mars = new THREE.Object3D();
	_self.marsAtmosphere = new THREE.Object3D();

	_self.system = new THREE.Object3D();
	_self.system.add(_self.mars);
	_self.system.add(_self.marsAtmosphere);

	//ROUGH planet location grid (good for quick vr tour): 
	//not exactly scientific YET, but estimated by art guy based on mad science representations by other artists... Yeah!
	_self.planetPos = {
		sun: {
			x:0,
			y:0,
			z:0,
			s:1.0
		},
		murcury: {
			x:4938,
			y:0,
			z:5038,
			s:1.0
		},
		venus: {
			x:4938,
			y:0,
			z:5112,
			s:1.0
		},
		earth: {
			x:4890,
			y:0,
			z:4900,
			s:1.0
		},
		mars: {
			x:4744,
			y:0,
			z:5056,
			s:1.0
		},
		jupiter: {
			x:4170,
			y:0,
			z:4798,
			s:1.0
		},
		saturn: {
			x:4434,
			y:0,
			z:6496,
			s:1.0
		},
		uranus: {
			x:7982,
			y:0,
			z:3954,
			s:1.0
		},
		neptune: {
			x:9437,
			y:0,
			z:6706,
			s:1.0
		},
		pluto: {
			x:14448,
			y:0,
			z:6648,
			s:1.0
		}
	}

	_self.createSun = function() {
		/* //!!! light not work in Object3D? set in SpaceScene for now
		//sun light
	    var light = new THREE.PointLight(0xffffff, 2);
	    light.position.set(-5000,0,5000);
	    _self.system.add(light);
	    
	    //some ambient light
	    _self.system.add( new THREE.AmbientLight(0x111111));
	    */


	};

	_self.createMars = function() {

		var geometry = new THREE.SphereGeometry(1000.0, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mars_1k_color.jpg'),
			normalMap: THREE.ImageUtils.loadTexture("img/solar/mars_1k_normal.jpg"),
			normalScale: new THREE.Vector2( 3.8, 3.8 ),
			shininess: 4.0
		});

		var mesh = new THREE.Mesh(geometry, material);
		_self.mars.add(mesh); 

		//odd shiting going on with camera pan
		var atmosMaterial = new THREE.MeshPhongMaterial( 
		{ 
			map: new THREE.ImageUtils.loadTexture( 'img/solar/atmos.png' ), 
			color: 0xe4986e, 
			transparent: true, 
			blending: THREE.AdditiveBlending
		});

		var atmosGeom = new THREE.PlaneGeometry( geometry.boundingSphere.radius * 3.2, geometry.boundingSphere.radius * 3.2, 2 );
		var atmosMesh = new THREE.Mesh(atmosGeom, atmosMaterial);
		_self.marsAtmosphere.add(atmosMesh);
		
	};

	_self.init = function() {

	};

	_self.update = function(camera) {
		//_self.solarSystem.marsAtmosphere.quaternion.copy( _self.camera.quaternion ); //?? not needed?
	    _self.marsAtmosphere.lookAt(camera.position);
	};
}