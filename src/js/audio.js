
import { AudioContext } from 'standardized-audio-context';
import { loadAudioBuffer } from 'audiobuffer-loader';
import SampleManager from 'sample-manager';
import hrtfs from './data/hrtf.js';
import AudioNode from './audionode.js';

function AudioManager(today, birdData, max) {
	this.ctx = new AudioContext();
	this.mng = new SampleManager(this.ctx, 'assets/audio/', 'ogg');
	this.max = max;

	this.setDate(today, birdData);

	this.masterGain = this.ctx.createGain();
	this.masterGain.gain.value = 0.5;
	this.masterGain.connect(this.ctx.destination);
}

AudioManager.prototype.setDate = function(today, birdData) {
	if (!this.sounds) {
		this.sounds = [];
	}
	var newSounds = __getSoundFilenames(today, birdData, this.sounds);

	__loadFiles.call(this, newSounds);
}

AudioPlayer.prototype.makeNodes = function(birds) {
	var hrtf = getHRTF(this.context);
	var list = this.bufferLoader.bufferList;
	this.files = list;

	for (var i = 0; i < this.total; i++) {
		var source = list[i]; // so the source node doesn't get angry
		this.inactiveNodes[i] = new AudioNode(this.context, this.masterGain, hrtf, source);
	}
	console.log(this.inactiveNodes);
}

AudioManager.prototype.update = function(birds) {

}

AudioPlayer.prototype.master = function(val) {
	if (val != 0) { 
		this.masterGain.gain.exponentialRampToValueAtTime(val, this.context.currentTime + 0.5);
	}
	else {
		this.masterGain.gain.value = 0;	
	}
}

function __loadFiles(samps) {
	var samps = ['ACTMCL','AMMMRT'].map(name => ({name}));	
	this.mng.addSamples(samps);
	this.mng.loadAllSamples().then(() => {
		console.log(this.mng);
		// create all nodes from this point probably
		// var s = this.ctx.createBufferSource();
		// s.buffer = this.mng.getAllSamples()[0].audioBuffer;
		// s.connect(this.ctx.destination);
		s.start();
	});
}

function __getSoundFilenames(today, birdData, prevSounds) {
	var fList = [];
	for (var i = 0; i < today.length; i++) {
		if (today[i] > 0 && !prevSounds[i].contains(birdData[i].name)) {
			var filename = B_FILEFOLDER + "audio/"+birdData[i].name+".ogg";
			fList[i] = filename;
		}
		else {
			fList[i] = "";
		}
	}
	return fList;
}

function __getHRTF(ctx) {
	// Recreate a buffer file for the HRTF out of the numeric data in hrtfs.js
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

export default AudioManager;


