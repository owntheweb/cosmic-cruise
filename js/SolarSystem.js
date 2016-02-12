//STATUS:
//Working on distant planetary sprites and navigation concepts,
//temporarily disabling planetary bodies

//inspired by and referenced from Planets.js:
//https://github.com/jeromeetienne/threex.planets
//took an altered development route to address solar system travel and new shaders

function SolarSystem() {
	var _self = this;

	_self.baseDiameter = 1000; //scale of earth for this project, with other planets scaling with multipliers

	_self.system = new THREE.Object3D();

	//for itteration, random selections, etc (better way?)
	_self.planetArray = [];

	//ROUGH planet location grid (good for quick vr tour): 
	//not exactly scientific YET, but estimated by art guy based on mad science representations by other artists... Yeah!
	_self.planets = {
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
	_self.getQuickPlanetMesh = function(color) {

		var geometry = new THREE.SphereGeometry(_self.baseDiameter, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			color: color,
			//emissive: color,
			shininess: 4.0
		});

		var mesh = new THREE.Mesh(geometry, material);

		return mesh;
	};

	//!!! hmmm
	_self.createSun = function() {
		//!!! We'll change this all up soon.

		//_self.sun.name = _self.planets.sun.name;
		//_self.setPosition(_self.sun, _self.planets.sun);

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
		//var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.sun.s, 32, 32);
		var geometry = new THREE.SphereGeometry(_self.baseDiameter, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			emissive: 0xffffff
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planets.sun.a;

		_self.sun.add(mesh);
		
		*/
	};

	_self.createMurcury = function() {
		_self.planets.murcury.planet.name = _self.planets.murcury.name;
		_self.setPosition(_self.planets.murcury.planet, _self.planets.murcury);


		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.murcury.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mercurymap.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture("img/solar/mercurybump.jpg"),
			bumpScale: 1.0,
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planets.murcury.a;

		_self.murcury.add(mesh);
		*/

		//test planet
		_self.planets.murcury.planet.add(_self.getQuickPlanetMesh(0xff9900));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.murcury.sprite = new THREE.Sprite( material );
        
        _self.system.add(_self.planets.murcury.planet);
        _self.system.add(_self.planets.murcury.sprite);

	};

	//!!! find atmosphere version, not xray (covered in clouds), swap between the two?
	_self.createVenus = function() {
		_self.planets.venus.planet.name = _self.planets.venus.name;
		_self.setPosition(_self.planets.venus.planet, _self.planets.venus);

		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.venus.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/venusmap.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture("img/solar/venusbump.jpg"),
			bumpScale: 1.0,
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planets.venus.a;

		_self.venus.add(mesh);
		*/
		
		//test planet
		_self.planets.venus.planet.add(_self.getQuickPlanetMesh(0xff9900));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.venus.sprite = new THREE.Sprite( material );
       
        _self.system.add(_self.planets.venus.planet);
        _self.system.add(_self.planets.venus.sprite);
	};

	//!!! don't forget the moon!
	//!!! add clouds!
	_self.createEarth = function() {
		_self.planets.earth.planet.name = _self.planets.earth.name;
		_self.setPosition(_self.planets.earth.planet, _self.planets.earth);

		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.earth.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/earthmap1k.jpg'),
			bumpMap: THREE.ImageUtils.loadTexture("img/solar/earthbump1k.jpg"),
			bumpScale: 1.0,
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planets.earth.a;

		_self.earth.add(mesh);
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

		_self.earthAtmosphere.add(atmosMesh);
		
		_self.setPosition(_self.earthAtmosphere, _self.planets.earth);
		*/

		//test planet
		_self.planets.earth.planet.add(_self.getQuickPlanetMesh(0xff9900));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.earth.sprite = new THREE.Sprite( material );
        
        _self.system.add(_self.planets.earth.planet);
        _self.system.add(_self.planets.earth.sprite);
	};

	_self.createMars = function() {
		_self.planets.mars.planet.name = _self.planets.mars.name;
		_self.setPosition(_self.planets.mars.planet, _self.planets.mars);

		var geometry = new THREE.SphereGeometry(_self.baseDiameter, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mars_1k_color.jpg'),
			normalMap: THREE.ImageUtils.loadTexture("img/solar/mars_1k_normal.jpg"),
			normalScale: new THREE.Vector2( 1.8, 1.8 ),
			shininess: 4.0
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		//!!! note: also need to check texture near poles (pinched)
		mesh.rotation.z = _self.planets.mars.a;
		
		_self.planets.mars.planet.add(mesh);
		
		
	
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
		
		_self.setPosition(_self.marsAtmosphere, _self.planets.mars);
		*/

		//test planet
		//_self.planets.murcury.planet.add(_self.getQuickPlanetMesh(0xff9900));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.mars.sprite = new THREE.Sprite( material );
        
        _self.system.add(_self.planets.mars.planet);
        _self.system.add(_self.planets.mars.sprite);
	};

	//!!! add glow?
	//!!! add moons!
	_self.createJupiter = function() {
		_self.planets.jupiter.planet.name = _self.planets.jupiter.name;
		_self.setPosition(_self.planets.jupiter.planet, _self.planets.jupiter);

		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.jupiter.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/jupiter2_1k.jpg'),
			shininess: 0.0
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planets.jupiter.a;

		_self.jupiter.add(mesh);
		*/
		
		//test planet
		_self.planets.jupiter.planet.add(_self.getQuickPlanetMesh(0xff9900));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.jupiter.sprite = new THREE.Sprite( material );
        
        _self.system.add(_self.planets.jupiter.planet);
        _self.system.add(_self.planets.jupiter.sprite);
	};

	//!!! add rings!
	//!!! add moons!
	//!!! add glow?
	_self.createSaturn = function() {
		_self.planets.pluto.planet.name = _self.planets.pluto.name;
		_self.setPosition(_self.planets.saturn.planet, _self.planets.saturn);

		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.saturn.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/saturnmap.jpg'),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planets.saturn.a;

		_self.saturn.add(mesh);
		*/

		//test planet
		_self.planets.saturn.planet.add(_self.getQuickPlanetMesh(0xff9900));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.saturn.sprite = new THREE.Sprite( material );
        
        _self.system.add(_self.planets.saturn.planet);
        _self.system.add(_self.planets.saturn.sprite);
		
	};

	//!!! add glow?
	_self.createUranus = function() {
		_self.planets.uranus.planet.name = _self.planets.uranus.name;
		_self.setPosition(_self.planets.uranus.planet, _self.planets.uranus);

		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.uranus.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/uranusmap.jpg'),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planets.uranus.a;

		_self.uranus.add(mesh);
		*/

		//test planet
		_self.planets.uranus.planet.add(_self.getQuickPlanetMesh(0xff9900));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.uranus.sprite = new THREE.Sprite( material );
       
        _self.system.add(_self.planets.uranus.planet);
        _self.system.add(_self.planets.uranus.sprite);
		
	};

	//!!! add ring(s)?
	//!!! add glow?
	_self.createNeptune = function() {
		_self.planets.neptune.planet.name = _self.planets.neptune.name;
		_self.setPosition(_self.planets.neptune.planet, _self.planets.neptune);

		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.neptune.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/neptunemap.jpg')
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planets.neptune.a;

		_self.neptune.add(mesh);
		*/
		
		//test planet
		_self.planets.neptune.planet.add(_self.getQuickPlanetMesh(0xff9900));

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.neptune.sprite = new THREE.Sprite( material );
        
		_self.system.add(_self.planets.neptune.planet);
        _self.system.add(_self.planets.neptune.sprite);
	};

	//!!! add moons?
	_self.createPluto = function() {
		_self.planets.pluto.planet.name = _self.planets.pluto.name;
		_self.setPosition(_self.planets.pluto.planet, _self.planets.pluto);

		//!!! get the latest map!
		/*
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.pluto.s, 32, 32);

		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('img/solar/mars_1k_color.jpg'),
			normalMap: THREE.ImageUtils.loadTexture("img/solar/mars_1k_normal.jpg"),
			normalScale: new THREE.Vector2( 1.8, 1.8 ),
			shininess: 0.5
		});

		var mesh = new THREE.Mesh(geometry, material);

		//!!! axis: check this, likely not correct!
		mesh.rotation.z = _self.planets.pluto.a;

		
		//_self.pluto.add(mesh);
		*/

		//test planet
		_self.planets.pluto.planet.add(_self.getQuickPlanetMesh(0xff9900));
		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.pluto.sprite = new THREE.Sprite( material );
        
        

        _self.system.add(_self.planets.pluto.planet);
        _self.system.add(_self.planets.pluto.sprite);
		
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

	_self.setDistantPlanetSprites = function(ship) {
		var i, shipPos, planetPos, spritePos, item;
		for (item in _self.planets) {
			shipPos = ship.getWorldPosition();
			planetPos = _self.planets[item].planet.getWorldPosition().sub(shipPos);
			spritePos = shipPos.add(THREE.Utils.moveVectorToSphereEdge(planetPos, 10000));

			_self.planets[item].sprite.position.copy(spritePos);
			_self.planets[item].sprite.scale.x = 200;
			_self.planets[item].sprite.scale.y = 200;
			_self.planets[item].sprite.scale.z = 200;
		}
	}

	//
	//hide planets that are too far away
	_self.scalePlanets = function() {

	};

	_self.init = function() {
		//_self.createSun();
		_self.createMurcury();
		_self.createVenus();
		_self.createEarth();
		_self.createMars();
		_self.createJupiter();
		_self.createSaturn();
		_self.createUranus();
		_self.createNeptune();
		_self.createPluto();

		//!!! temporary I think...
		for (var item in _self.planets) {
			_self.planetArray.push(_self.planets[item]);
		}
	};

	_self.update = function(camera, ship) {
		_self.setDistantPlanetSprites(ship);

		//_self.atmosphereFaceCamera(_self.marsAtmosphere, camera);
	};
}