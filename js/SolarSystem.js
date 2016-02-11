//STATUS:
//Working on distant planetary sprites and navigation concepts,
//temporarily disabling planetary bodies

//inspired by and referenced from Planets.js:
//https://github.com/jeromeetienne/threex.planets
//took an altered development route to address solar system travel and new shaders

function SolarSystem() {
	var _self = this;

	_self.baseDiameter = 500; //scale of earth for this project, with other planets scaling with multipliers

	_self.system = new THREE.Object3D();

	//for itteration, random selections, etc (better way?)
	_self.planetArray = [];

	//ROUGH planet location grid (good for quick vr tour): 
	//not exactly scientific YET, but estimated by art guy based on mad science representations by other artists... Yeah!
	_self.planets = {
		murcury: {
			name:'Murcury',
			x:-4600,
			y:0,
			z:2800,
			a:0.0001745329,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		venus: {
			name:'Venus',
			x:-4600,
			y:0,
			z:7900,
			a:3.08923,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		earth: {
			name:'Earth',
			x:-7800,
			y:0,
			z:-7100,
			a:0.401426,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		mars: {
			name:'Mars',
			x:-18400,
			y:0,
			z:3900,
			a:0.436332,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		jupiter: {
			name:'Jupiter',
			x:-59400,
			y:0,
			z:-14400,
			a:0.0523599,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		saturn: {
			name:'Saturn',
			x:-40300,
			y:0,
			z:107000,
			a:0.471239,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		uranus: {
			name:'Uranus',
			x:213100,
			y:0,
			z:-74600,
			a:1.71042,
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		},
		neptune: {
			name:'Neptune',
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
			x:495400,
			y:50000,
			z:-61200,
			a:0, //??
			sprite: new THREE.Sprite(),
			planet: new THREE.Object3D()
		}
	}

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
		_self.planets.murcury.planet.name = _self.planets.murcury.n;
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

		//distant sprite
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.murcury.sprite = new THREE.Sprite( material );
        
        _self.system.add(_self.planets.murcury.planet);
        _self.system.add(_self.planets.murcury.sprite);

	};

	//!!! find atmosphere version, not xray (covered in clouds), swap between the two?
	_self.createVenus = function() {
		_self.planets.venus.planet.name = _self.planets.venus.n;
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
		

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.venus.sprite = new THREE.Sprite( material );
       
        _self.system.add(_self.planets.venus.planet);
        _self.system.add(_self.planets.venus.sprite);
	};

	//!!! don't forget the moon!
	//!!! add clouds!
	_self.createEarth = function() {
		_self.planets.earth.planet.name = _self.planets.earth.n;
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

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.earth.sprite = new THREE.Sprite( material );
        
        _self.system.add(_self.planets.earth.planet);
        _self.system.add(_self.planets.earth.sprite);
	};

	_self.createMars = function() {
		_self.planets.mars.planet.name = _self.planets.mars.n;
		_self.setPosition(_self.planets.mars.planet, _self.planets.mars);

		
		var geometry = new THREE.SphereGeometry(_self.baseDiameter * _self.planets.mars.s, 32, 32);

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

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.mars.sprite = new THREE.Sprite( material );
        
        _self.system.add(_self.planets.mars.planet);
        _self.system.add(_self.planets.mars.sprite);
	};

	//!!! add glow?
	//!!! add moons!
	_self.createJupiter = function() {
		_self.planets.jupiter.planet.name = _self.planets.jupiter.n;
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
		_self.planets.pluto.planet.name = _self.planets.pluto.n;
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

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.saturn.sprite = new THREE.Sprite( material );
        
        _self.system.add(_self.planets.saturn.planet);
        _self.system.add(_self.planets.saturn.sprite);
		
	};

	//!!! add glow?
	_self.createUranus = function() {
		_self.planets.uranus.planet.name = _self.planets.uranus.n;
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

		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.uranus.sprite = new THREE.Sprite( material );
       
        _self.system.add(_self.planets.uranus.planet);
        _self.system.add(_self.planets.uranus.sprite);
		
	};

	//!!! add ring(s)?
	//!!! add glow?
	_self.createNeptune = function() {
		_self.planets.neptune.planet.name = _self.planets.neptune.n;
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
		
		var map = new THREE.TextureLoader().load( "img/planetSprite.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        _self.planets.neptune.sprite = new THREE.Sprite( material );
        
		_self.system.add(_self.planets.neptune.planet);
        _self.system.add(_self.planets.neptune.sprite);
	};

	//!!! add moons?
	_self.createPluto = function() {
		_self.planets.pluto.planet.name = _self.planets.pluto.n;
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
		//for(i=0; i<_self.planetArray.length; i++) {
		for (item in _self.planets) {
			shipPos = ship.getWorldPosition();
			//shipPos = new THREE.Vector3(ship.position.x, ship.position.y, ship.position.z);
			planetPos = _self.planets[item].planet.getWorldPosition().sub(shipPos);
			//planetPos = _self.planets[item].planet.position;
			spritePos = shipPos.add(THREE.Utils.moveVectorToSphereEdge(planetPos, 10000));
			//spritePos = THREE.Utils.moveVectorToSphereEdge(planetPos, 500);


			_self.planets[item].sprite.position.copy(spritePos);
			_self.planets[item].sprite.scale.x = 200;
			_self.planets[item].sprite.scale.y = 200;
			_self.planets[item].sprite.scale.z = 200;
		}

		//console.log(spritePos);
	}

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