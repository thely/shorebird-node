// A collection of three nodes: a source node, a binaural FIR panner node,
// and a gain node. Innocuous edit

import BinauralFIR from 'binauralfir';

function AudioNode(p, ctx, hrtf, source) {
	this.p = p;
	this.active = false;
	this.fadeout = false;
	this.birdID = null;
	this.ctx = ctx;
	this.source = source;

	this.SoundSource = ctx.createBufferSource(); 
	this.SoundSource.buffer = source;
	this.SoundSource.loop = true;

	this.BinPan = new BinauralFIR({
		audioContext: ctx
	});
	this.BinPan.HRTFDataset = hrtf;
	this.BinPan.setCrossfadeDuration(200);

	this.GainNode = ctx.createGain();
	// this.GainNode.gain.value = __gainFromDistance(dist, 0.4);
	this.GainNode.gain.value = 0;

	this.SoundSource.connect(this.GainNode);
	this.GainNode.connect(this.BinPan.input);

	// this.BinPan.setPosition(azi, 0, dist);
}

AudioNode.prototype.connect = function(out) {
	this.BinPan.connect(out);
}

AudioNode.prototype.play = function(source) {
	this.SoundSource = this.ctx.createBufferSource(); 
	this.SoundSource.buffer = this.source;
	this.SoundSource.loop = true;
	this.SoundSource.loopStart = source.start;
	this.SoundSource.loopEnd = source.end;

	var fileStartWhen = this.p.random(0, 2);
	var fileStartPos = this.p.random(source.start, source.end);
	this.SoundSource.connect(this.GainNode);
	this.SoundSource.start(fileStartWhen, fileStartPos);
}

AudioNode.prototype.stop = function() {
	this.SoundSource.stop();
}

AudioNode.prototype.gain = function(val) {
	if (!val) {
		return this.GainNode.gain.value;
	}
	else if (val != 0) { 
		this.GainNode.gain.linearRampToValueAtTime(val, this.ctx.currentTime + 0.5);
		this.active = true;
	}
	else {
		this.GainNode.gain.value = 0;
		this.active = false;
	}
}

AudioNode.prototype.pan = function(azi, dist) {
	this.BinPan.setPosition(azi, 0, dist);
}

AudioNode.prototype.file = function(file) {
	if (file) {
		this.SoundSource.buffer = file;
	}
	return this.SoundSource.buffer;
}

export default AudioNode;
