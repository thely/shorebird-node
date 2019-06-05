
import { AudioContext } from 'standardized-audio-context';
import { loadAudioBuffer } from 'audiobuffer-loader';
import SampleManager from 'sample-manager';

function AudioManager() {
	this.ctx = new AudioContext();
	this.mng = new SampleManager(this.ctx, 'assets/audio/', 'ogg');

	loadFiles.call(this);
}

function loadFiles() {
	var samps = ['ACTMCL','AMMMRT'].map(name => ({name}));	
	this.mng.addSamples(samps);
	this.mng.loadAllSamples().then(() => {
		console.log(this.mng);
		var s = this.ctx.createBufferSource();
		s.buffer = this.mng.getAllSamples()[0].audioBuffer;
		s.connect(this.ctx.destination);
		s.start();
	});
}

export default AudioManager;