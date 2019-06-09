
import { AudioContext } from 'standardized-audio-context';
import { loadAudioBuffer } from 'audiobuffer-loader';
import SampleManager from 'sample-manager';
import AudioNode from './audionode.js';

function AudioManager(p, max) {
	this.p = p;

	this.ctx = new AudioContext();
	this.mng = new SampleManager(this.ctx, 'assets/audio/', 'ogg');
	this.max = max;

	this.masterGain = this.ctx.createGain();
	this.masterGain.gain.value = 0.5;
	this.masterGain.connect(this.ctx.destination);

	this.nodes = {
		active: [],
		inactive: []
	};
	this.flags = {
		soundsLoaded: false,
		sceneChanged: false
	};
}

AudioManager.prototype.setup = function(today, birdData) {
	this.setDate(today, birdData);
}

// call when the date changes to refigure the files needed
AudioManager.prototype.setDate = function(today, birdData) {
	if (!this.sounds) {
		this.sounds = {
			loadedTotal: [], 	// the fnames we've loaded in total
			needForScene: [], 	// the fnames we need to play right now
			needToLoad: [] 		// the fnames we need to load
		};
	}
	console.log(this.sounds);

	__getSoundFilenames.call(this, today, birdData);
	console.log(this.sounds);
	__loadFiles.call(this);
}

// build the nodes out when the player is created
// ************
AudioManager.prototype.makeNodes = function() {
	var hrtf = __getHRTF.call(this);

	for (var i = 0; i < this.max; i++) {
		var source = this.p.random(this.mng.getAllSamples()).audioBuffer;
		this.nodes.inactive[i] = new AudioNode(this.p, this.ctx, hrtf, source);
		this.nodes.inactive[i].connect(this.ctx.destination);
	}
}

// update the nodes
AudioManager.prototype.update = function(birds) {
	this.updateNodes(birds);
}

AudioManager.prototype.updateNodes = function(birds) {
	this.p.shuffle(birds, true);

	for (var i = this.nodes.active.length - 1; i >= 0; i--) {

		// check if the bird we know is in the visible list
		var b = __birdFromId(birds, this.nodes.active[i].bird.id);
		if (b.length > 0) {
			this.moveVisibleNode(b[0], this.nodes.active[i]);
		}
		// our bird is gone
		else {
			if (this.nodes.active[i].fadeout && this.nodes.active[i].gain() == 0) {
				this.nodes.active[i].stop();
				this.nodes.active[i].bird.hasAudioNode = false; // this should be illegal!!!
				this.nodes.active[i].bird = null;
				let n = this.nodes.active.splice(i, 1);
				this.nodes.inactive.push(n[0]);
			}
			else {
				this.nodes.active[i].fadeout = true;
			}
		}
	}

	// all our nodes are presently in use
	if (this.nodes.inactive.length <= 0) {
		console.log("all the inactive nodes are taken!");
		return;
	}

	// adding new birds if they don't have nodes
	for (let i = 0; i < birds.length; i++) {
		// if we weren't visible last frame, we haven't been added yet
		if (!birds[i].hasAudioNode && this.nodes.inactive.length > 0) {
			// console.log("our next bird: ");
			console.log(birds[i]);
			let n = this.nodes.inactive.pop();
			n.bird = birds[i];
			birds[i].hasAudioNode = true;

			// var file = this.files[birds[i].species];
			let file = __getFile.call(this, birds[i].name);
			this.moveVisibleNode(birds[i], n);
			this.nodes.active.unshift(n);
			this.nodes.active[0].play(file);
		}
	}
}

AudioManager.prototype.moveVisibleNode = function(b, n) {
	if (b.visible.now) {
		console.log("yes exist");
		n.pan(b.azi, b.dist);
				
		var x = __gainFromDistance(b.dist, 0.4);
		n.gain(x);
	}

	// just left the viewport
	else if ((!b.visible.now && b.visible.then) || n.fadeout) {
		console.log("fadeout");
		n.gain(0.00001);
	}

	// bird has been gone from the viewport, maybe still fading out
	else if (!b.visible.now && !b.visible.then) {
		console.log("no dead");
		if (n.gain() <= 0.00001) {
			n.gain(0);
			// n.stop();
		}
	}

	// just entered the viewport
	else if (b.visible.now && !b.visible.then) {
		console.log("fadein");
		// n.play();
		var x = __gainFromDistance(b.dist, 0.4);
		n.gain(x);
	}
}

AudioManager.prototype.master = function(val) {
	if (val != 0) { 
		this.masterGain.gain.exponentialRampToValueAtTime(val, this.context.currentTime + 0.5);
	}
	else {
		this.masterGain.gain.value = 0;	
	}
}

// Load files in as needed
function __loadFiles() {
	var samps = this.sounds.needToLoad.map(name => ({name}));	
	this.mng.addSamples(samps);
	this.mng.loadAllSamples().then(() => {
		console.log("sounds loaded!");
		this.sounds.loadedTotal = this.sounds.needToLoad; //TODO: alter this when you start changing date
		this.makeNodes();
		// console.log(this.mng);
		// create all nodes from this point probably
		// var s = this.ctx.createBufferSource();
		// s.buffer = this.mng.getAllSamples()[0].audioBuffer;
		// s.connect(this.ctx.destination);
		// s.start();
	});
}

// function __mergeLoadedList() {

// }

// get just the names of new files to be added
function __getSoundFilenames(today, birdData) {
	this.sounds.needToLoad = [];
	this.sounds.needForScene = [];

	for (var i = 0; i < today.length; i++) {
		if (today[i] > 0) {
			console.log(today[i]);
			this.sounds.needForScene[i] = birdData[i].name;
			this.sounds.needToLoad[i] = birdData[i].name;

			// if (!this.sounds.loadedTotal || !this.sounds.loadedTotal.contains(birdData[i].name)) {
			// 	this.sounds.needToLoad[i] = birdData[i].name;
			// }
		}
	}
}

function __getFile(species) {
	return this.mng.getSampleByName(species).audioBuffer;
}

// Recreate a buffer file for the HRTF out of the numeric data in hrtfs.js
function __getHRTF() {
	for (var i = 0; i < hrtfs.length; i++) {
		var buffer = this.ctx.createBuffer(2, 512, 44100);
		var buffLeft = buffer.getChannelData(0);
		var buffRight = buffer.getChannelData(1);
		for (var e = 0; e < hrtfs[i].fir_coeffs_left.length; e++) {
			buffLeft[e] = hrtfs[i].fir_coeffs_left[e];
			buffRight[e] = hrtfs[i].fir_coeffs_right[e];
		}
		hrtfs[i].buffer = buffer;
	}

	return hrtfs;
}

function __birdFromId(arr, birdId) {
  return arr.filter(function(el) {
      return el.id == birdId;
  });
}

function __gainFromDistance(dist, max) {
	// var x = Math.min(1 / (0.5 * Math.PI * Math.pow(dist, 2) + 1), max);
	var x = Math.min(1 / (0.5 * dist), max);
	return x;
}


export default AudioManager;


