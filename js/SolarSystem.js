//STATUS:
//Working on distant planetary sprites and navigation concepts,
//temporarily disabling planetary bodies

//inspired by and referenced from Planets.js:
//https://github.com/jeromeetienne/threex.planets
//took an altered development route to address solar system travel and new shaders

function SolarSystem() {
	var _self = this;

	_self.baseDiameter = 300; //scale of earth for this project, with other planets scaling with multipliers

	_self.sun = new THREE.Object3D();
	_self.murcury = new THREE.Object3D();
	_self.murcurySprite;
	_self.venus = new THREE.Object3D();
	_self.venusSprite;
	_self.earth = new THREE.Object3D();
	_self.earthAtmosphere = new THREE.Object3D();
	_self.earthSprite;
	_self.earthMoon = new THREE.Object3D();
	_self.earthMoonSprite;
	_self.mars = new THREE.Object3D(); //add moons? (yah!)
	_self.marsAtmosphere = new THREE.Object3D();
	_self.marsSprite;
	_self.jupiter = new THREE.Object3D(); //add moons? (yah!) !!! does it have a glow?
	_self.jupiterSprite;
	_self.saturn = new THREE.Object3D(); //add moons? (yah!)
	_self.saturnSprite;
	_self.uranus = new THREE.Object3D();
	_self.uranusSprite;
	_self.neptune = new THREE.Object3D();
	_self.neptuneSprite;
	_self.pluto = new THREE.Object3D(); //add moons? (yah!)
	_self.plutoSprite;

	_self.planetSprites;

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
			name:'Sun',
			x:0,
			y:0,
			z:0,
			s:109.0, //scale to earth
			a:0.0 //axis in radians http://www.redshift-live.com/en/magazine/articles/Redshift_Archive/17239-Rotational_Axes__total_disorder-1.html
		},
		murcury: {
			name:'Murcury',
			x:-4600,
			y:0,
			z:2800,
			s:0.382,
			a:0.0001745329
		},
		venus: {
			name:'Venus',
			x:-4600,
			y:0,
			z:7900,
			s:0.949,
			a:3.08923
		},
		earth: {
			name:'Earth',
			x:-7800,
			y:0,
			z:-7100,
			s:1.0,
			a:0.401426
		},
		earthMoon: {
			name:'Moon',
			s:0.27254357
		},
		mars: {
			name:'Mars',
			x:-18400,
			y:0,
			z:3900,
			s:0.532,
			a:0.1,
			a:0.436332
		},
		jupiter: {
			name:'Jupiter',
			x:-59400,
			y:0,
			z:-14400,
			s:11.209,
			a:0.0523599
		},
		saturn: {
			name:'Saturn',
			x:-40300,
			y:0,
			z:107000,
			s:9.449,
			a:0.471239
		},
		uranus: {
			name:'Uranus',
			x:213100,
			y:0,
			z:-74600,
			s:4.007,
			a:1.71042
		},
		neptune: {
			name:'Neptune',
			x:316900,
			y:0,
			z:122000,
			s:3.883,
			a:0.523599
		},
		pluto: {
			name:'Pluto',
			x:495400,
			y:50000,
			z:-61200,
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
		/*
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
		*/
	};

	_self.createMurcury = function() {
		/*
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
		*/

		_self.murcury.name = _self.planetInfo.murcury.name;
		_self.setPosition(_self.murcury, _self.planetInfo.murcury);

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.murcurySprite = new THREE.Sprite( material );
        _self.murcury.add(_self.murcurySprite);

	};

	//!!! find atmosphere version, not xray (covered in clouds), swap between the two?
	_self.createVenus = function() {
		/*
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
		*/
		_self.venus.name = _self.planetInfo.venus.name;
		_self.setPosition(_self.venus, _self.planetInfo.venus);
		

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.venusSprite = new THREE.Sprite( material );
        _self.venus.add(_self.venusSprite);
	};

	//!!! don't forget the moon!
	//!!! add clouds!
	_self.createEarth = function() {
		/*
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
		*/
		_self.earth.name = _self.planetInfo.earth.name;
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

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0x0099ff } );
        _self.earthSprite = new THREE.Sprite( material );
        _self.earth.add(_self.earthSprite);
	};

	_self.createMars = function() {
		/*
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
		*/
		_self.mars.name = _self.planetInfo.mars.name;
		_self.setPosition(_self.mars, _self.planetInfo.mars);
	
		/*
		var atmosMaterial = new THREE.MeshPhongMaterial({ 
			map: new THREE.ImageUtils.loadTexture('img/solar/atmos.png'), 
			color: 0xe4986e, 
			transparent: true, 
			blending: THREE.AdditiveBlending
		});

		var atmosGeom = new THREE.PlaneGeometry(geometry.boundingSphere.radius * 2.5, geometry.boundingSphere.radius * 2.5, 2);
		var atmosMesh = new THREE.Mesh(atmosGeom, atmosMaterial);

		_self.marsAtmosphere.add(atmosMesh);
		
		_self.setPosition(_self.marsAtmosphere, _self.planetInfo.mars);
		*/

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xff9900 } );
        _self.marsSprite = new THREE.Sprite( material );
        _self.mars.add(_self.marsSprite);

        //console.log(_self.marsSprite);
	};

	//!!! add glow?
	//!!! add moons!
	_self.createJupiter = function() {
		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.jupiter.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/jupiter2_1k.jpg'),
			shininess: 0.0
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.jupiter.a;

		_self.jupiter.add(mesh);
		*/
		_self.jupiter.name = _self.planetInfo.jupiter.name;
		_self.setPosition(_self.jupiter, _self.planetInfo.jupiter);
		
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.jupiterSprite = new THREE.Sprite( material );
        _self.jupiter.add(_self.jupiterSprite);
	};

	//!!! add rings!
	//!!! add moons!
	//!!! add glow?
	_self.createSaturn = function() {
		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.saturn.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/saturnmap.jpg'),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.saturn.a;

		_self.saturn.add(mesh);
		*/
		_self.saturn.name = _self.planetInfo.saturn.name;
		_self.setPosition(_self.saturn, _self.planetInfo.saturn);

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.saturnSprite = new THREE.Sprite( material );
        _self.saturn.add(_self.saturnSprite);
		
	};

	//!!! add glow?
	_self.createUranus = function() {
		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.uranus.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/uranusmap.jpg'),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.uranus.a;

		_self.uranus.add(mesh);
		*/
		_self.uranus.name = _self.planetInfo.uranus.name;
		_self.setPosition(_self.uranus, _self.planetInfo.uranus);

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.uranusSprite = new THREE.Sprite( material );
        _self.uranus.add(_self.uranusSprite);
		
	};

	//!!! add ring(s)?
	//!!! add glow?
	_self.createNeptune = function() {
		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planetInfo.neptune.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/neptunemap.jpg')
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planetInfo.neptune.a;

		_self.neptune.add(mesh);
		*/
		_self.neptune.name = _self.planetInfo.neptune.name;
		_self.setPosition(_self.neptune, _self.planetInfo.neptune);
		
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.neptuneSprite = new THREE.Sprite( material );
        _self.neptune.add(_self.neptuneSprite);
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
		*/
		_self.pluto.name = _self.planetInfo.pluto.name;
		_self.setPosition(_self.pluto, _self.planetInfo.pluto);

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.plutoSprite = new THREE.Sprite( material );
        _self.pluto.add(_self.plutoSprite);
		
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

	//thanks: http://stackoverflow.com/questions/20396150/three-js-how-to-keep-sprite-text-size-unchanged-when-zooming
	_self.setDistantPlanetSprites = function(camera) {
		var i, v, scale, dist;
		//var virtual_z = 20; //!!! this should actually be distance to planet from camera, not static value
		for(i=0; i<_self.planets.length; i++) {
			//console.log(_self.planetSprites);
			
			var dist = _self.planets[i].position.distanceTo(camera.position) * 0.002;
			//console.log(dist);

			v = _self.planets[i].position
			.clone()
			.applyMatrix4(camera.matrixWorldInverse);

			scale=(v.z-camera.position.z)/dist;
			_self.planets[i].scale.set(scale,scale,scale);

			//scale=200;
			//_self.planets[i].scale.set(scale,scale,scale);
		}
	}

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

		_self.planets = [_self.murcury, _self.venus, _self.earth, _self.mars, _self.jupiter, _self.saturn, _self.uranus, _self.neptune, _self.pluto];
	};

	_self.update = function(camera) {
		_self.system.updateMatrix();
		_self.setDistantPlanetSprites(camera);

		//_self.atmosphereFaceCamera(_self.marsAtmosphere, camera);
	};
}