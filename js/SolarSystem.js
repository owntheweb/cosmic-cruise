//inspired by and referenced from Planets.js:
//https://github.com/jeromeetienne/threex.planets
//took an altered development route to address solar system travel and new shaders

function SolarSystem() {
	var _self = this;

	_self.baseDiameter = 100; //scale of earth for this project, with other planets scaling with multipliers

	_self.sun = new THREE.Object3D();
	_self.murcury = new THREE.Object3D();
	_self.venus = new THREE.Object3D();
	_self.earth = new THREE.Object3D();
	_self.earthAtmosphere = new THREE.Object3D();
	_self.earthMoon = new THREE.Object3D();
	_self.mars = new THREE.Object3D(); //add moons? (yah!)
	_self.marsAtmosphere = new THREE.Object3D();
	_self.jupiter = new THREE.Object3D(); //add moons? (yah!) !!! does it have a glow?
	_self.saturn = new THREE.Object3D(); //add moons? (yah!)
	_self.uranus = new THREE.Object3D();
	_self.neptune = new THREE.Object3D();
	_self.pluto = new THREE.Object3D(); //add moons? (yah!)

	_self.system = new THREE.Object3D();
	_self.system.add(_self.sun);
	_self.system.add(_self.murcury);
	_self.system.add(_self.venus);
	_self.system.add(_self.earth);
	_self.system.add(_self.earthAtmosphere);
	_self.system.add(_self.earthMoon);
	_self.system.add(_self.mars);
	_self.system.add(_self.marsAtmosphere);
	_self.system.add(_self.jupiter);
	_self.system.add(_self.saturn);
	_self.system.add(_self.uranus);
	_self.system.add(_self.neptune);
	_self.system.add(_self.pluto);

	//ROUGH planet location grid (good for quick vr tour): 
	//not exactly scientific YET, but estimated by art guy based on mad science representations by other artists... Yeah!
	_self.planetInfo = {
		sun: {
			x:0,
			y:0,
			z:0,
			s:109.0, //scale to earth
			a:0.0 //axis in radians http://www.redshift-live.com/en/magazine/articles/Redshift_Archive/17239-Rotational_Axes__total_disorder-1.html
		},
		murcury: {
			x:-460,
			y:0,
			z:280,
			s:0.382,
			a:0.0001745329
		},
		venus: {
			x:-460,
			y:0,
			z:790,
			s:0.949,
			a:3.08923
		},
		earth: {
			x:-780,
			y:0,
			z:-710,
			s:1.0,
			a:0.401426
		},
		mars: {
			x:-1840,
			y:0,
			z:390,
			s:0.532,
			a:0.1,
			a:0.436332
		},
		jupiter: {
			x:-5940,
			y:0,
			z:-1440,
			s:11.209,
			a:0.0523599
		},
		saturn: {
			x:-4030,
			y:0,
			z:10700,
			s:9.449,
			a:0.471239
		},
		uranus: {
			x:21310,
			y:0,
			z:-7460,
			s:4.007,
			a:1.71042
		},
		neptune: {
			x:31690,
			y:0,
			z:12200,
			s:3.883,
			a:0.523599
		},
		pluto: {
			x:49540,
			y:5000,
			z:-6120,
			s:0.167,
			a:0 //??
		}
	}

	//!!! hmmm
	_self.createSun = function() {
		//!!! We'll change this all up soon.

		/* //!!! light not work in Object3D? set in SpaceScene for now
		//sun light
		var light = new THREE.PointLight(0xffffff, 2);
		light.position.set(-5000,0,5000);
		_self.system.add(light);
		
		//some ambient light
		_self.system.add( new THREE.AmbientLight(0x111111));
		*/

		//currently eating everything until distance scaling is added:
		//var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.sun.s, 32, 32);
		var geometry = new THREE.SphereGeometry(_self.baseDiameter, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			emissive: 0xffffff
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.sun.a;

		_self.sun.add(mesh);
		_self.setPosition(_self.sun, _self.planetInfo.sun);
	};

	_self.createMurcury = function() {
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.murcury.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mercurymap.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture("img/solar/mercurybump.jpg"),
			bumpScale: 1.0,
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.murcury.a;

		_self.murcury.add(mesh);
		_self.setPosition(_self.murcury, _self.planetInfo.murcury);
	};

	//!!! find atmosphere version, not xray (covered in clouds), swap between the two?
	_self.createVenus = function() {
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.venus.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/venusmap.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture("img/solar/venusbump.jpg"),
			bumpScale: 1.0,
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.venus.a;

		_self.venus.add(mesh);
		_self.setPosition(_self.venus, _self.planetInfo.venus);
	};

	//!!! don't forget the moon!
	//!!! add clouds!
	_self.createEarth = function() {
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.earth.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/earthmap1k.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture("img/solar/earthbump1k.jpg"),
			bumpScale: 1.0,
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.earth.a;

		_self.earth.add(mesh);
		_self.setPosition(_self.earth, _self.planetInfo.earth);

		/*
		var atmosMaterial = new THREE.MeshPhongMaterial({ 
			map: new THREE.ImageUtils.loadTexture('img/solar/atmos.png'), 
			color: 0xe4986e, 
			transparent: true, 
			blending: THREE.AdditiveBlending
		});

		var atmosGeom = new THREE.PlaneGeometry(geometry.boundingSphere.radius * 2.8, geometry.boundingSphere.radius * 2.8, 2);
		var atmosMesh = new THREE.Mesh(atmosGeom, atmosMaterial);

		_self.earthAtmosphere.add(atmosMesh);
		_self.setPosition(_self.earthAtmosphere, _self.planetInfo.earth);
		*/
	};

	_self.createMars = function() {
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.mars.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mars_1k_color.jpg'),
			normalMap: THREE.ImageUtils.loadTexture("img/solar/mars_1k_normal.jpg"),
			normalScale: new THREE.Vector2( 1.8, 1.8 ),
			shininess: 4.0
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.mars.a;

		_self.mars.add(mesh);
		_self.setPosition(_self.mars, _self.planetInfo.mars);

		var atmosMaterial = new THREE.MeshPhongMaterial({ 
			map: new THREE.ImageUtils.loadTexture('img/solar/atmos.png'), 
			color: 0xe4986e, 
			transparent: true, 
			blending: THREE.AdditiveBlending
		});

		var atmosGeom = new THREE.PlaneGeometry(geometry.boundingSphere.radius * 2.8, geometry.boundingSphere.radius * 2.8, 2);
		var atmosMesh = new THREE.Mesh(atmosGeom, atmosMaterial);

		_self.marsAtmosphere.add(atmosMesh);
		_self.setPosition(_self.marsAtmosphere, _self.planetInfo.mars);
	};

	//!!! add glow?
	//!!! add moons!
	_self.createJupiter = function() {
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.jupiter.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/jupiter2_1k.jpg'),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.jupiter.a;

		_self.jupiter.add(mesh);
		_self.setPosition(_self.jupiter, _self.planetInfo.jupiter);
	};

	//!!! add rings!
	//!!! add moons!
	//!!! add glow?
	_self.createSaturn = function() {
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.saturn.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/saturnmap.jpg'),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.saturn.a;

		_self.saturn.add(mesh);
		_self.setPosition(_self.saturn, _self.planetInfo.saturn);
	};

	//!!! add glow?
	_self.createUranus = function() {
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.uranus.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/uranusmap.jpg'),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.uranus.a;

		_self.uranus.add(mesh);
		_self.setPosition(_self.uranus, _self.planetInfo.uranus);
	};

	//!!! add ring(s)?
	//!!! add glow?
	_self.createNeptune = function() {
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.neptune.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/neptunemap.jpg')
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.neptune.a;

		_self.neptune.add(mesh);
		_self.setPosition(_self.neptune, _self.planetInfo.neptune);
	};

	//!!! add moons?
	_self.createPluto = function() {
		//!!! get the latest map!
		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.pluto.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mars_1k_color.jpg'),
			normalMap: THREE.ImageUtils.loadTexture("img/solar/mars_1k_normal.jpg"),
			normalScale: new THREE.Vector2( 1.8, 1.8 ),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.pluto.a;

		
		//_self.pluto.add(mesh);
		_self.setPosition(_self.pluto, _self.planetInfo.pluto);
		*/
	};

	//!!! How about the other three dwarf planets?

	_self.setPosition = function(target, info) {
		target.position.x = info.x;
		target.position.y = info.y;
		target.position.z = info.z; 
	}

	_self.atmosphereFaceCamera = function(target, camera) {
		var vec = target.parent.worldToLocal(camera.getWorldPosition());
		target.lookAt(vec);
	};

	_self.init = function() {
		_self.createSun();
		_self.createMurcury();
		_self.createVenus();
		_self.createEarth();
		_self.createMars();
		_self.createJupiter();
		_self.createSaturn();
		_self.createUranus();
		_self.createNeptune();
		_self.createPluto();
	};

	_self.update = function(camera) {
		_self.system.updateMatrix();
		_self.atmosphereFaceCamera(_self.marsAtmosphere, camera);
	};
}