//STATUS:
//Working on distant planetary sprites and navigation concepts,
//temporarily disabling planetary bodies

//inspired by and referenced from Planets.js:
//https://github.com/jeromeetienne/threex.planets
//took an altered development route to address solar system travel and new shaders

function SolarSystem() {
	var _s = this;

	_s.baseRadius = 1000; //scale of earth for this project, with other planets scaling with multipliers
	_s.planetThresh = 10000; //distance of planet sprite sphere and where planets appear

	_s.system = new THREE.Object3D();

	//for itteration, random selections, etc (better way?)
	_s.planetArray = [];

	//ROUGH planet location grid (good for quick vr tour): 
	//not exactly scientific YET, but estimated by art guy based on mad science representations by other artists... Yeah!
	_s.planets = {
		murcury: {
			name:'Murcury',
			x:-46000,
			y:0,
			z:28000,
			a:0.0001745329,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		venus: {
			name:'Venus',
			x:-46000,
			y:0,
			z:79000,
			a:3.08923,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		earth: {
			name:'Earth',
			x:-78000,
			y:0,
			z:-71000,
			a:0.401426,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		mars: {
			name:'Mars',
			x:-184000,
			y:0,
			z:39000,
			a:0.436332,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		jupiter: {
			name:'Jupiter',
			x:-594000,
			y:0,
			z:-144000,
			a:0.0523599,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		saturn: {
			name:'Saturn',
			x:-403000,
			y:0,
			z:1070000,
			a:0.471239,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		uranus: {
			name:'Uranus',
			x:2131000,
			y:0,
			z:-746000,
			a:1.71042,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		neptune: {
			name:'Neptune',
			x:3169000,
			y:0,
			z:1220000,
			a:0.523599,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		
		//I know... but they just flew by this king of the dwarfs and took pictures!
		pluto: {
			name:'Pluto',
			x:4954000,
			y:500000,
			z:-61200,
			a:0, //??
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		}
	};

	//!!! TEMPORARY FOR QUICK TESTS
	_s.getQuickPlanetMesh = function(color) {

		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			color: color,
			//emissive: color,
			shininess: 4.0
		});

		var mesh = new THREE.Mesh(geometry, material);

		return mesh;
	};

	//!!! hmmm
	_s.createSun = function() {
		//!!! We'll change this all up soon.

		//_s.sun.name = _s.planets.sun.name;
		//_s.setPosition(_s.sun, _s.planets.sun);

		/* //!!! light not work in Object3D? set in SpaceScene for now
		//sun light
		var light = new THREE.PointLight(0xffffff, 2);
		light.position.set(-5000,0,5000);
		_s.system.add(light);
		
		//some ambient light
		_s.system.add( new THREE.AmbientLight(0x111111));
		*/
		/*
		//currently eating everything until distance scaling is added:
		//var geometry = new THREE.SphereGeometry(_s.baseRadius * _s.planets.sun.s, 32, 32);
		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			emissive: 0xffffff
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _s.planets.sun.a;

		_s.sun.add(mesh);
		
		*/
	};

	_s.createMurcury = function() {
		_s.planets.murcury.planet.name = _s.planets.murcury.name;
		_s.setPosition(_s.planets.murcury.planet, _s.planets.murcury);


		/*
		var geometry = new THREE.SphereGeometry(_s.baseRadius * _s.planets.murcury.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mercurymap.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture("img/solar/mercurybump.jpg"),
			bumpScale: 1.0,
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _s.planets.murcury.a;

		_s.murcury.add(mesh);
		*/

		//test planet
		_s.planets.murcury.planet.add(_s.getQuickPlanetMesh(0x006fe1));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.murcury.sprite = new THREE.Sprite( material );
        
        _s.system.add(_s.planets.murcury.planet);
        _s.system.add(_s.planets.murcury.sprite);

	};

	//!!! find atmosphere version, not xray (covered in clouds), swap between the two?
	_s.createVenus = function() {
		_s.planets.venus.planet.name = _s.planets.venus.name;
		_s.setPosition(_s.planets.venus.planet, _s.planets.venus);

		/*
		var geometry = new THREE.SphereGeometry(_s.baseRadius * _s.planets.venus.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/venusmap.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture("img/solar/venusbump.jpg"),
			bumpScale: 1.0,
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _s.planets.venus.a;

		_s.venus.add(mesh);
		*/
		
		//test planet
		_s.planets.venus.planet.add(_s.getQuickPlanetMesh(0x006fe1));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.venus.sprite = new THREE.Sprite( material );
       
        _s.system.add(_s.planets.venus.planet);
        _s.system.add(_s.planets.venus.sprite);
	};

	//!!! don't forget the moon!
	//!!! add clouds!
	_s.createEarth = function() {
		_s.planets.earth.planet.name = _s.planets.earth.name;
		_s.setPosition(_s.planets.earth.planet, _s.planets.earth);

		/*
		var geometry = new THREE.SphereGeometry(_s.baseRadius * _s.planets.earth.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/earthmap1k.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture("img/solar/earthbump1k.jpg"),
			bumpScale: 1.0,
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _s.planets.earth.a;

		_s.earth.add(mesh);
		*/
		

		/*
		var atmosMaterial = new THREE.MeshPhongMaterial({ 
			map: new THREE.ImageUtils.loadTexture('img/solar/atmos.png'), 
			color: 0xe4986e, 
			transparent: true, 
			blending: THREE.AdditiveBlending
		});

		var atmosGeom = new THREE.PlaneGeometry(geometry.boundingSphere.radius * 2.8, geometry.boundingSphere.radius * 2.8, 2);
		var atmosMesh = new THREE.Mesh(atmosGeom, atmosMaterial);

		_s.earthAtmosphere.add(atmosMesh);
		
		_s.setPosition(_s.earthAtmosphere, _s.planets.earth);
		*/

		//test planet
		_s.planets.earth.planet.add(_s.getQuickPlanetMesh(0x006fe1));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.earth.sprite = new THREE.Sprite( material );
        
        _s.system.add(_s.planets.earth.planet);
        _s.system.add(_s.planets.earth.sprite);
	};

	_s.createMars = function() {
		_s.planets.mars.planet.name = _s.planets.mars.name;
		_s.setPosition(_s.planets.mars.planet, _s.planets.mars);

		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mars_1k_color.jpg'),
			normalMap: THREE.ImageUtils.loadTexture("img/solar/mars_1k_normal.jpg"),
			normalScale: new THREE.Vector2( 1.8, 1.8 ),
			shininess: 4.0
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		//!!! note: also need to check texture near poles (pinched)
		mesh.rotation.z = _s.planets.mars.a;
		
		_s.planets.mars.planet.add(mesh);
		
		
	
		/*
		var atmosMaterial = new THREE.MeshPhongMaterial({ 
			map: new THREE.ImageUtils.loadTexture('img/solar/atmos.png'), 
			color: 0xe4986e, 
			transparent: true, 
			blending: THREE.AdditiveBlending
		});

		var atmosGeom = new THREE.PlaneGeometry(geometry.boundingSphere.radius * 2.5, geometry.boundingSphere.radius * 2.5, 2);
		var atmosMesh = new THREE.Mesh(atmosGeom, atmosMaterial);

		_s.marsAtmosphere.add(atmosMesh);
		
		_s.setPosition(_s.marsAtmosphere, _s.planets.mars);
		*/

		//test planet
		//_s.planets.murcury.planet.add(_s.getQuickPlanetMesh(0x006fe1));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.mars.sprite = new THREE.Sprite( material );
        
        _s.system.add(_s.planets.mars.planet);
        _s.system.add(_s.planets.mars.sprite);
	};

	//!!! add glow?
	//!!! add moons!
	_s.createJupiter = function() {
		_s.planets.jupiter.planet.name = _s.planets.jupiter.name;
		_s.setPosition(_s.planets.jupiter.planet, _s.planets.jupiter);

		/*
		var geometry = new THREE.SphereGeometry(_s.baseRadius * _s.planets.jupiter.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/jupiter2_1k.jpg'),
			shininess: 0.0
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _s.planets.jupiter.a;

		_s.jupiter.add(mesh);
		*/
		
		//test planet
		_s.planets.jupiter.planet.add(_s.getQuickPlanetMesh(0x006fe1));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.jupiter.sprite = new THREE.Sprite( material );
        
        _s.system.add(_s.planets.jupiter.planet);
        _s.system.add(_s.planets.jupiter.sprite);
	};

	//!!! add rings!
	//!!! add moons!
	//!!! add glow?
	_s.createSaturn = function() {
		_s.planets.saturn.planet.name = _s.planets.saturn.name;
		_s.setPosition(_s.planets.saturn.planet, _s.planets.saturn);

		/*
		var geometry = new THREE.SphereGeometry(_s.baseRadius * _s.planets.saturn.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/saturnmap.jpg'),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _s.planets.saturn.a;

		_s.saturn.add(mesh);
		*/

		//test planet
		_s.planets.saturn.planet.add(_s.getQuickPlanetMesh(0x006fe1));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.saturn.sprite = new THREE.Sprite( material );
        
        _s.system.add(_s.planets.saturn.planet);
        _s.system.add(_s.planets.saturn.sprite);
		
	};

	//!!! add glow?
	_s.createUranus = function() {
		_s.planets.uranus.planet.name = _s.planets.uranus.name;
		_s.setPosition(_s.planets.uranus.planet, _s.planets.uranus);

		/*
		var geometry = new THREE.SphereGeometry(_s.baseRadius * _s.planets.uranus.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/uranusmap.jpg'),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _s.planets.uranus.a;

		_s.uranus.add(mesh);
		*/

		//test planet
		_s.planets.uranus.planet.add(_s.getQuickPlanetMesh(0x006fe1));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.uranus.sprite = new THREE.Sprite( material );
       
        _s.system.add(_s.planets.uranus.planet);
        _s.system.add(_s.planets.uranus.sprite);
		
	};

	//!!! add ring(s)?
	//!!! add glow?
	_s.createNeptune = function() {
		_s.planets.neptune.planet.name = _s.planets.neptune.name;
		_s.setPosition(_s.planets.neptune.planet, _s.planets.neptune);

		/*
		var geometry = new THREE.SphereGeometry(_s.baseRadius * _s.planets.neptune.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/neptunemap.jpg')
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _s.planets.neptune.a;

		_s.neptune.add(mesh);
		*/
		
		//test planet
		_s.planets.neptune.planet.add(_s.getQuickPlanetMesh(0x006fe1));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.neptune.sprite = new THREE.Sprite( material );
        
		_s.system.add(_s.planets.neptune.planet);
        _s.system.add(_s.planets.neptune.sprite);
	};

	//!!! add moons?
	_s.createPluto = function() {
		_s.planets.pluto.planet.name = _s.planets.pluto.name;
		_s.setPosition(_s.planets.pluto.planet, _s.planets.pluto);

		//!!! get the latest map!
		/*
		var geometry = new THREE.SphereGeometry(_s.baseRadius * _s.planets.pluto.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mars_1k_color.jpg'),
			normalMap: THREE.ImageUtils.loadTexture("img/solar/mars_1k_normal.jpg"),
			normalScale: new THREE.Vector2( 1.8, 1.8 ),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _s.planets.pluto.a;

		
		//_s.pluto.add(mesh);
		*/

		//test planet
		_s.planets.pluto.planet.add(_s.getQuickPlanetMesh(0x006fe1));
		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.pluto.sprite = new THREE.Sprite( material );
        
        

        _s.system.add(_s.planets.pluto.planet);
        _s.system.add(_s.planets.pluto.sprite);
		
	};

	//!!! How about the other three dwarf planets?

	_s.setPosition = function(target, info) {
		target.position.x = info.x;
		target.position.y = info.y;
		target.position.z = info.z; 
	}

	_s.atmosphereFaceCamera = function(target, camera) {
		var vec = target.parent.worldToLocal(camera.getWorldPosition());
		target.lookAt(vec);
	};

	//place distant planet sprites around ship
	//!!! don't do all this math if ship is stopped
	_s.scalePlanets = function(ship) {
		var i, shipPos, planetPos, spritePos, planetDist, scale, item;
		for (item in _s.planets) {
			shipPos = ship.getWorldPosition();
			planetPos = _s.planets[item].planet.getWorldPosition().sub(shipPos);
			spritePos = shipPos.add(THREE.Utils.moveVectorToSphereEdge(planetPos, _s.planetThresh));
			planetDist = ship.position.distanceTo(_s.planets[item].planet.position);

			//place and scale planet sprites
			if(planetDist > _s.planetThresh - 200) {
				_s.planets[item].sprite.visible = true;
				_s.planets[item].sprite.position.copy(spritePos);
				_s.planets[item].sprite.scale.x = 150;
				_s.planets[item].sprite.scale.y = 150;
				_s.planets[item].sprite.scale.z = 150;
			} else {
				_s.planets[item].sprite.visible = false;
			}

			//scale planets
			if(planetDist < _s.planetThresh) {
				_s.planets[item].planet.visible = true;
				scale = 1 - ((planetDist - _s.baseRadius - 200) / _s.planetThresh);
				//console.log(scale);

				_s.planets[item].planet.scale.x = scale;
				_s.planets[item].planet.scale.y = scale;
				_s.planets[item].planet.scale.z = scale;
			} else {
				_s.planets[item].planet.visible = false;
			}
		}
	}

	_s.init = function() {
		//_s.createSun();
		_s.createMurcury();
		_s.createVenus();
		_s.createEarth();
		_s.createMars();
		_s.createJupiter();
		_s.createSaturn();
		_s.createUranus();
		_s.createNeptune();
		_s.createPluto();

		//!!! temporary I think...
		for (var item in _s.planets) {
			_s.planetArray.push(_s.planets[item]);
		}
	};

	_s.update = function(camera, ship) {
		_s.scalePlanets(ship);
		//_s.scalePlanets();

		//_s.atmosphereFaceCamera(_s.marsAtmosphere, camera);
	};
}