//inspired by and referenced from Planets.js:
//https://github.com/jeromeetienne/threex.planets
//took an altered development route to address solar system travel and new shaders

function SolarSystem() {
	var _s = this;

	_s.baseRadius = 100; //scale of earth for this project, with other planets scaling with multipliers
	_s.planetThresh = 1100; //distance of planet sprite sphere and where planets appear

	_s.system = new THREE.Object3D();

	//for itteration, random selections, etc (better way?)
	_s.planetArray = [];

	//ROUGH planet location grid (good for quick vr tour):
	//not exactly scientific YET, but estimated by art guy based on mad science representations by other artists... Yeah!
	_s.planets = {
		murcury: {
			name:'Mercury',
			screenImg: 'img/screen/mercury/destination_mercury.png',
			x:-4600,
			y:0,
			z:2800,
			a:0.0001745329,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		venus: {
			name:'Venus',
			screenImg: 'img/screen/venus/destination_venus.png',
			x:-4600,
			y:0,
			z:7900,
			a:3.08923,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		earth: {
			name:'Earth',
			screenImg: 'img/screen/earth/destination_earth.png',
			x:-7800,
			y:0,
			z:-7100,
			a:0.401426,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		mars: {
			name:'Mars',
			screenImg: 'img/screen/mars/destination_mars.png',
			x:-18400,
			y:0,
			z:3900,
			a:0.436332,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		jupiter: {
			name:'Jupiter',
			screenImg: 'img/screen/jupiter/destination_jupiter.png',
			x:-59400,
			y:0,
			z:-14400,
			a:0.0523599,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		saturn: {
			name:'Saturn',
			screenImg: 'img/screen/saturn/destination_saturn.png',
			x:-40300,
			y:0,
			z:107000,
			a:0.471239,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		uranus: {
			name:'Uranus',
			screenImg: 'img/screen/uranus/destination_uranus.png',
			x:213100,
			y:0,
			z:-74600,
			a:1.71042,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		neptune: {
			name:'Neptune',
			screenImg: 'img/screen/neptune/destination_neptune.png',
			x:316900,
			y:0,
			z:122000,
			a:0.523599,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},

		//I know... but they just flew by this king of the dwarfs and took pictures!
		pluto: {
			name:'Pluto',
			screenImg: 'img/screen/pluto/destination_pluto.png',
			x:495400,
			y:50000,
			z:-6120,
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


		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshLambertMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mercurymap.jpg'),
			//normalMap: THREE.ImageUtils.loadTexture("img/solar/mercurybump.jpg"),
			//normalScale: new THREE.Vector2( 1.8, 1.8 ),
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		//mesh.rotation.y = Math.PI;
		mesh.rotation.z = _s.planets.murcury.a;

		_s.planets.murcury.planet.add(mesh);

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

		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshLambertMaterial({
			//map: THREE.ImageUtils.loadTexture('img/solar/venusclouds.jpg'), //!!! pending permission
			map: THREE.ImageUtils.loadTexture('img/solar/venusmap.jpg'),
			normalMap: THREE.ImageUtils.loadTexture("img/solar/venusbump.jpg"),
			normalScale: new THREE.Vector2( 1.8, 1.8 ),
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		//mesh.rotation.y = Math.PI;
		mesh.rotation.z = _s.planets.venus.a;

		_s.planets.venus.planet.add(mesh);

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
    _s.planets.venus.sprite = new THREE.Sprite( material );

    _s.system.add(_s.planets.venus.planet);
    _s.system.add(_s.planets.venus.sprite);
	};

  // Create the Earth and its moon.
  _s.createEarth = function() {
    // Set initial positioning.
		_s.planets.earth.planet.name = _s.planets.earth.name;
		_s.setPosition(_s.planets.earth.planet, _s.planets.earth);

    // Create the Earth geometry, textures, and mesh.
		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);
    loader = new THREE.TextureLoader();
    var texture = loader.load( './img/solar/earth/ColorMap.jpg' );
    var bump = loader.load( './img/solar/earth/Bump.jpg' );
    var spec = loader.load( './img/solar/earth/SpecMask.jpg' );
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 5,
      map: texture,
      specularMap: spec,
      specular: "#666666",
      bumpMap: bump,
      displacementMap: bump,
    });

		var mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Earth";

		// Create the clouds.
		var cloudGeometry = new THREE.SphereGeometry(_s.baseRadius + 1, 32, 32);
    loader = new THREE.TextureLoader();
    var alpha = loader.load( "./img/solar/earth/alphaMap.jpg" );
    alpha.wrapS = alpha.wrapT = THREE.RepeatWrapping;
    alpha.repeat.set( 1, 1 );

    var cloudMaterial = new THREE.MeshPhongMaterial({
      alphaMap: alpha,
    });
    cloudMaterial.transparent = true;

		var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.name = "Clouds";

		_s.planets.earth.planet.add(mesh);
		_s.planets.earth.planet.add(cloudMesh);

    // Create the moon and its rotation point.
    moonRotationPoint = new THREE.Object3D();
    _s.planets.earth.planet.add(moonRotationPoint);

    var moonGeometry = new THREE.SphereGeometry(_s.baseRadius/2, 32, 32);
    var moonTexture = loader.load( './img/solar/moon/ColorMap.jpg' );
    var moonBump = loader.load( './img/solar/moon/Bump.jpg' );
    var moonMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 5,
      map: moonTexture,
      specular: "#666666",
      displacementMap: moonBump,
      bumpMap: moonBump,
      bumpScale: 0.5,
    });
    var moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(_s.baseRadius * -4, 0, _s.baseRadius * 1.25);
    moonRotationPoint.add(moonMesh);

		// Create the distant sprite.
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

		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshLambertMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/jupitermap2.jpg'),
			//normalMap: THREE.ImageUtils.loadTexture("img/solar/"),
			//normalScale: new THREE.Vector2( 1.8, 1.8 ),
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		//mesh.rotation.y = Math.PI;
		mesh.rotation.z = _s.planets.jupiter.a;

		_s.planets.jupiter.planet.add(mesh);

		// Distant Sprite.
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
    _s.planets.jupiter.sprite = new THREE.Sprite( material );

    // Add Jupiter.
    _s.system.add(_s.planets.jupiter.planet);
    _s.system.add(_s.planets.jupiter.sprite);
	};

	//!!! add moons!
	//!!! add glow?
	_s.createSaturn = function() {
		_s.planets.saturn.planet.name = _s.planets.saturn.name;
		_s.setPosition(_s.planets.saturn.planet, _s.planets.saturn);

		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshLambertMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/saturnmap.jpg'),
			//normalMap: THREE.ImageUtils.loadTexture("img/solar/"),
			//normalScale: new THREE.Vector2( 1.8, 1.8 ),
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		//mesh.rotation.y = Math.PI;
		mesh.rotation.z = _s.planets.saturn.a;

		_s.planets.saturn.planet.add(mesh);

		//rings!
		//referenced from: http://codepen.io/marvindanig/pen/GJqepZ
		var ringMesh = new THREE.Mesh(new THREE.XRingGeometry(1.2 * _s.baseRadius, 2 * _s.baseRadius, 2 * 32, 5, 0, Math.PI * 2), new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/saturnrings.png'),
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.6
		}));

		ringMesh.rotation.z = _s.planets.saturn.a;

		_s.planets.saturn.planet.add(ringMesh);

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

		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshLambertMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/uranusmap.jpg'),
			//normalMap: THREE.ImageUtils.loadTexture("img/solar/"),
			//normalScale: new THREE.Vector2( 1.8, 1.8 ),
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		//mesh.rotation.y = Math.PI;
		mesh.rotation.z = _s.planets.uranus.a;

		_s.planets.uranus.planet.add(mesh);

		//rings!
		//referenced from: http://codepen.io/marvindanig/pen/GJqepZ
		var ringMesh = new THREE.Mesh(new THREE.XRingGeometry(1.5 * _s.baseRadius, 2 * _s.baseRadius, 2 * 32, 5, 0, Math.PI * 2), new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/uranusrings.png'),
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.25
		}));

		ringMesh.rotation.z = _s.planets.uranus.a;

		_s.planets.uranus.planet.add(ringMesh);

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _s.planets.uranus.sprite = new THREE.Sprite( material );

        _s.system.add(_s.planets.uranus.planet);
        _s.system.add(_s.planets.uranus.sprite);

	};

	//!!! add glow?
	_s.createNeptune = function() {
		_s.planets.neptune.planet.name = _s.planets.neptune.name;
		_s.setPosition(_s.planets.neptune.planet, _s.planets.neptune);

		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshLambertMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/neptunemap.jpg'),
			//normalMap: THREE.ImageUtils.loadTexture("img/solar/"),
			//normalScale: new THREE.Vector2( 1.8, 1.8 ),
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		//mesh.rotation.y = Math.PI;
		mesh.rotation.z = _s.planets.neptune.a;

		_s.planets.neptune.planet.add(mesh);

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

		var geometry = new THREE.SphereGeometry(_s.baseRadius, 32, 32);

		var material = new THREE.MeshLambertMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/plutomap.jpg'),
			//normalMap: THREE.ImageUtils.loadTexture("img/solar/"),
			//normalScale: new THREE.Vector2( 1.8, 1.8 ),
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		//mesh.rotation.z = _s.planets.pluto.a;
		mesh.rotation.y = Math.PI;

		_s.planets.pluto.planet.add(mesh);

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
			if(planetDist > _s.planetThresh - 20) {
				_s.planets[item].sprite.visible = true;
				_s.planets[item].sprite.position.copy(spritePos);
				_s.planets[item].sprite.scale.x = 15;
				_s.planets[item].sprite.scale.y = 15;
				_s.planets[item].sprite.scale.z = 15;
			} else {
				_s.planets[item].sprite.visible = false;
			}

			//scale planets
			if(planetDist < _s.planetThresh) {
				_s.planets[item].planet.visible = true;
				scale = 1 - ((planetDist - _s.baseRadius - 20) / _s.planetThresh);

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
		
		if(_s.planetArray[2].planet.visible == true) {
			// Rotate Earth's Clouds.
			_s.planetArray[2].planet.children[1].rotation.y += 0.00005;
			// Rotate the Earth.
			_s.planetArray[2].planet.children[0].rotation.y += 0.000025;
		}

	};

}

