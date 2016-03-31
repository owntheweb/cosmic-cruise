//manage audio scores that trigger events and events that trigger audio

//!!! set and save options in an options screen
//!!! Update/reset audio after options have been saved

function ScoreManager() {

	var _s = this;

	//!!! edit these in options screen
	_s.playMusic = true;
	_s.playVoice = true;
	_s.subtitles = true; //!!! may need to move this?

	_s.talk;
	_s.talking = false; //Don't interrupt when someone is talking! (or interrupt with new content most likely)
	_s.talkLoaded = false; //Don't talk unless you have something to say!

	_s.music;
	_s.musicLoaded = false;
	_s.musicPlaying = false;
	_s.musicPlaylistInt = 0;

	_s.flightSound;
	_s.flightSoundLoaded = false;
	_s.flightSoundPlaying = false;

	_s.idleDelay = 12;

	_s.destinationTalk = [
		{
			id:'sun',
			file:'audio/voice/destination/sun.mp3',
			delay:0,
			scoreEvents:[]
		},
		{
			id:'mercury',
			file:'audio/voice/destination/mercury.mp3',
			delay:0,
			scoreEvents:[]
		},
		{
			id:'venus',
			file:'audio/voice/destination/venus.mp3',
			delay:0,
			scoreEvents:[]
		},
		{
			id:'earth',
			file:'audio/voice/destination/earth.mp3',
			delay:0,
			scoreEvents:[]
		},
		{
			id:'mars',
			file:'audio/voice/destination/mars.mp3',
			delay:0,
			scoreEvents:[]
		},
		{
			id:'jupiter',
			file:'audio/voice/destination/jupiter.mp3',
			delay:0,
			scoreEvents:[]
		},
		{
			id:'saturn',
			file:'audio/voice/destination/saturn.mp3',
			delay:0,
			scoreEvents:[]
		},
		{
			id:'uranus',
			file:'audio/voice/destination/uranus.mp3',
			delay:0,
			scoreEvents:[]
		},
		{
			id:'neptune',
			file:'audio/voice/destination/neptune.mp3',
			delay:0,
			scoreEvents:[]
		},
		{
			id:'pluto',
			file:'audio/voice/destination/pluto.mp3',
			delay:0,
			scoreEvents:[]
		}
	];

	_s.idleTalk = [
		{
			id:'test1',
			file:'audio/voice/idle/test1.mp3',
			delay:0,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'test2',
			file:'audio/voice/idle/test2.mp3',
			delay:10000,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'test3',
			file:'audio/voice/idle/test3.mp3',
			delay:0,
			playOnlyOnce:true,
			timesPlayed:0,
			scoreEvents:[]
		}
	];

	_s.travelTalk = [
		{
			id:'test1',
			file:'audio/voice/travel/test1.mp3',
			delay:0,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'test2',
			file:'audio/voice/travel/test2.mp3',
			delay:10000,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'test3',
			file:'audio/voice/travel/test3.mp3',
			delay:0,
			playOnlyOnce:true,
			timesPlayed:0,
			scoreEvents:[]
		}
	];

	_s.systemTalkGo = [
		{
			id:'engaged',
			file:'audio/voice/system/acknowledged.mp3',
			delay:0,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'understood',
			file:'audio/voice/system/affirmative.mp3',
			delay:0,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'driveActivated',
			file:'audio/voice/system/driveActivated.mp3',
			delay:0,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'affirmative',
			file:'audio/voice/system/engaged.mp3',
			delay:0,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'fasterThanLight',
			file:'audio/voice/system/fasterThanLightSpeedDriveInitiated.mp3',
			delay:0,
			playOnlyOnce:true,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'fasterThanLight',
			file:'audio/voice/system/understood.mp3',
			delay:0,
			playOnlyOnce:true,
			timesPlayed:0,
			scoreEvents:[]
		}
	];

	_s.systemTalkSpec = [
		{
			id:'empty',
			file:'audio/voice/system/empty.mp3',
			delay:0,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'thankYouDonation',
			file:'audio/voice/system/thankYouDonation.mp3',
			delay:0,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		},
		{
			id:'thankYouShare',
			file:'audio/voice/system/thankYouDonation.mp3',
			delay:0,
			playOnlyOnce:false,
			timesPlayed:0,
			scoreEvents:[]
		}
	];

	_s.musicPlaylist = [
		'audio/Psychadelik_Pedestrian_-_07_-_Pacific.mp3'
	];

	//start the music, cycling through files in _s.musicPlaylist every time this function is called
	_s.startMusic = function() {
		var file, loop = false;

		_s.musicLoaded = false;
		_s.musicPlaying = false;

		//set music source
		file = _s.musicPlaylist[_s.musicPlaylistInt];

		//loop if only one song in the queue
		if(_s.musicPlaylist.length == 1) {
			loop = true;
		}

		if(runningIn == "Android") {
			//!!! Android stock browser can only play one file at a time. PhoneGap's media api to handle more at a time.
			var onSuccess = function() {
				console.log('Android: music completed');
				_s.startMusic();
			};

			var onError = function() {
				console.log('Android: music error');
			};

			_s.music = new Media('/android_asset/www/' + file, onSuccess, onError);
			_s.music.play();

		} else {
			//init if not already
			if(_s.music == undefined) {
				_s.music = new Howl({
					src: file,
					autoplay: false,
					loop: loop,
					volume: 0.4,
					buffer: true,
					onload: function() {
						_s.musicLoaded = true;
						console.log('music loaded');
					},
					onplay: function() {
						_s.musicPlaying = true;
						console.log('music started');
					},
					onend: function() {
						_s.musicPlaying = false;
						console.log('music stopped');
						
						//play the next song
						_s.startMusic();
					}
				});
				_s.music.play();
			}
		}
			
		_s.musicPlaylistInt++;
		if(_s.musicPlaylistInt >= _s.musicPlaylist.length) {
			_s.musicPlaylistInt = 0;
		}
	};

	//!!! edit this to "pull marbles out of a jar" when random, not repeating the same thing until all items in a group are played
	_s.playTalk = function(group, id) {

		var talkItem, i, match = false, timeout;

		if(id == -1) {
			//play a random item in the group
			talkItem = group[Math.floor(Math.random() * group.length)];
		} else {
			//search for and play an item by id
			for(i=0; i<group.length; i++) {
				if(group[i].id == id) {
					match = true;
					talkItem = group[i];
					break;
				}
			}

			//no match? Play something random in the group
			if(match == false) {
				talkItem = group[Math.floor(Math.random() * group.length)];
			}
		}

		console.log("times played: " + talkItem.timesPlayed);

		//tally play count
		talkItem.timesPlayed += 1;

		//remove talk item from group array if only to be played once
		if(talkItem.playOnlyOnce == true) {
			group.splice(i,1);
		}

		//delay if present, or simply wait until the stack clears to play if 0 
		timeout = setTimeout(function() {
			//_s.talk.src = talkItem.file;

			//initiate "talk channel", seperate from music, can be inturrupted by other talk
			//src required to start, loads empty
			if(_s.talk != undefined) {
				_s.talk.unload();
			}
			_s.talk = new Howl({
				src: talkItem.file,
				autoplay: false,
				loop: false,
				volume: 1.0,
				buffer: true,
				onload: function() {
					_s.talkLoaded = true;
					console.log('talk loaded');
				},
				onplay: function() {
					_s.talkPlaying = true;
					console.log('talk started');
				},
				onend: function() {
					_s.talkPlaying = false;
					_s.talkLoaded = false;
					console.log('talk stopped');
				}
			});
			_s.talk.play();
		}, talkItem.delay);

	};

	_s.playFlightSound = function() {
		if(runningIn == "Android") {

			//!!! Android stock browser can only play one file at a time. PhoneGap's media api to handle more at a time.
			var onSuccess = function() {
				console.log('Android: flight sound completed');
			};

			var onError = function() {
				console.log('Android: flight sound error');
			};

			_s.flightSound = new Media('/android_asset/www/' + 'audio/flight.mp3', onSuccess, onError);
			_s.flightSound.play();

		} else {
			//!!! need to fully reload for iOS, otherwise it "forgets" file before played
			//!!! maybe make a runningIn == "browser" version that just seeks to the beginning and plays again
			_s.flightSound = new Howl({
				src: 'audio/flight.mp3',
				autoplay: false,
				loop: false,
				volume: 1.0,
				buffer: true,
				onload: function() {
					_s.playSoundLoaded = true;
					console.log('flight sound loaded');
				},
				onplay: function() {
					_s.playSoundPlaying = true;
					console.log('flight sound started');
				},
				onend: function() {
					_s.playSoundPlaying = false;
					_s.playSoundLoaded = false;
					console.log('flight sound stopped');
				}
			});
			_s.flightSound.play();
		}
	};

	//get it started!
	_s.init = function() {
		//!!! let's see if a delay helps resolve odd sound issues that seem random on the phone (crazy slow-mo music or no sound at times on iPhone)
		var setupDelay = setTimeout(function() { 
			//start music
			if(_s.playMusic == true) {
				_s.startMusic();
			}
		}, 1000);
	};

	_s.update = function() {
		//
	};
}
