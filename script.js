// Creating global variable for use in the file
const FPS = 30; // Setting the frames per second
const friction = 0.5; // Friction coefficient of space
const shipBlinkDuration = 0.1; // In seconds
const shipExplodeDuration = 0.3;
const shipInvisibilityDuration = 3; // In seconds
const shipSize = 30; // Height in pixels
const shipThrust = 5; // Acceleration of the ship in pixels per second
const shipTurnSpeed = 360; // Degrees per second
const laserDist = 0.4; // Max distance laser can travel
const laserExplodeDuration = 0.1;
const laserMax = 10; // Number of lasers allowed on the screen at one time
const laserSpeed = 500; // Pixels per second
const roidsJag = 0.3; // Jaggedness of asteroids
const roidsNum = 1; // Starting number of asteroids
const roidsSize = 100; // Starting size of asteroids in pixels
const roidsSpeed = 50; // Max pixels per second
const roidsVert = 10; //Average number of vertices on each asteroid
const gameLives = 3; // Starting number of lives
const textFadeTime = 3; // In seconds
const textSize = 40; // In pixels
const roidLargePts = 20; // Points scored for large asteroids
const roidMediumPts = 50; // Points scored for medium asteroids
const roidSmallPts = 100; // Points scored for small asteroids
const saveScore = `highScore`; // Save key for local storage
let soundOn = false;
let musicOn = false;

let canvas = document.getElementById(`gameCanvas`);
let context = document.getContext(`2d`);
document.querySelector(`main`).focus();


// SOUND EFFECTS
function Sound(src, maxStreams = 1, vol = 1.0) {
	this.streamNum = 0;
	this.streams = [];
	for (let i = 0; i < maxStreams; i++) {
		this.streams.push(new Audio(src));
		this.streams[i].volume = vol;
	}
	this.play = function () {
		if (soundOn) {
		this.streamNum = (this.streamNum + 1) % maxStreams;
		this.streams[this.streamNum].play();
		}
	}
	this.stop = function () {
		this.streams[this.streamNum].pause();
		this.streams[this.streamNum].currentTime = 0;
	}
}
let laserSound = new Sound("https://margaux-dev.github.io/asteroids-game/asteroids-game-sounds/pew.m4a", 5, 0.4);
let thrustSound = new Sound("https://margaux-dev.github.io/asteroids-game/asteroids-game-sounds/thrust.m4a");
let hitSound = new Sound("https://margaux-dev.github.io/asteroids-game/asteroids-game-sounds/hit.m4a", 5, 0.8);
let explosionSound = new Sound("https://margaux-dev.github.io/asteroids-game/asteroids-game-sounds/explosion.m4a", 1, 0.7);

//MUSIC
let music = new Music("https://margaux-dev.github.io/asteroids-game/asteroids-game-sounds/music-high.m4a","https://margaux-dev.github.io/asteroids-game/asteroids-game-sounds/music-low.m4a");
let roidsLeft, roidsTotal;
function Music (srcA, srcB) {
	this.soundA = new Audio(srcA);
	this.soundB = new Audio(srcB);
	this.a = true;
	this.tempo = 1.0;
	this.beatTime = 0;
	this.play = function () {
		if (musicOn) {
			if (this.a) {
				this.soundA.play();
			} else {
				this.soundB.play();
			}
			this.a = !this.a;
		}
	}
	this.setAsteroidRatio = function (ratio) {
		this.tempo = 1 - 0.75 * (1 - ratio);
	}
	this.tick = function () {
		if (this.beatTime === 0) {
			this.play();
			this.beatTime = Math.ceil(this.tempo * FPS);
		} else {
			this.beatTime--;
		}
	}
}


// SET UP GAME LOOP