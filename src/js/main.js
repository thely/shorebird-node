
// import '../sass/style.scss';
import p5 from 'p5';
import './lib/p5.canvascam.js';
import AudioManager from './audio.js';
import ShoreMap from './shoremap.js';
import Population from './population.js';
import cobb_data from './data/cobb-island-data.js';
import { bird_data } from './data/bird-species-data.js';
import { B_COLS, B_ROWS, B_MAPSCALE, B_MAXNODES } from './settings.js';

var audiom, map, popul, cam;
var dim = {};

const sketch = (p) => {
	var soundStarted;

	p.setup = () => {
		dim.view = p.createVector(700, 500);
		dim.map = p.createVector(
			B_COLS * B_MAPSCALE,
			B_ROWS * B_MAPSCALE
		);

		// a few more globals
		p.B_CENTER = p5.Vector.mult(dim.view, 0.5);
		p.B_MAPCENTER = p5.Vector.mult(dim.map, 0.5);
		p.B_OFFSET = p.createVector();
		p.B_PANNING = p.createVector();
		// p.B_MAXDIFF = p5.Vector.sub(dim.map, dim.view).add(p.B_CENTER).mult(0.5);
		p.B_USEDTILES = [];
		p.B_ZOOM = 1;
		
		p.createCanvas(dim.view.x, dim.view.y);
		p.background(40);

		cam = new p.CanvasCam(1, p.B_MAPCENTER.x, p.B_MAPCENTER.y);
		p.B_LIMIT = cam.dimensions(dim.view, dim.map);
		
		popul = new Population(p, dim, bird_data);
		popul.makeBirds(cobb_data["birds_and_days"][0]["count"], cobb_data["habitats_in_pixels"]);
		
		map = new ShoreMap(p, dim, cobb_data);
		// audiom = new AudioManager(p, B_MAXNODES);
		// audiom.setup(cobb_data["birds_and_days"][0]["count"], bird_data);
		soundStarted = false;

		p.frameRate(30);
		p.noLoop();
	};

	p.draw = () => {
		let pan = cam.getPanning();
		pan = p.createVector(pan.x, pan.y);
		popul.update(pan);
		map.drawFullMap(popul.getBirds());
	}

	p.mousePressed = () => {
		if (!soundStarted) {
			soundStarted = true;
		}
		p.loop();
	}

	p.mouseDragged = () => {
		let dx = cam.mouseX - cam.pmouseX;
		let dy = cam.mouseY - cam.pmouseY;
		cam.translate(-dx, -dy);

		return false;
	}

	p.mouseReleased = () => {
		p.noLoop();
	}

	// p.mouseWheel = (e) => {
	//   var factor = Math.pow(1.01, e.delta);
	//   cam.scale(factor, 0, 0);
	//   p.redraw();

	//   return false;
	// }


	p.keyPressed = () => {
		if (p.key == 'a') {
			p.B_ZOOM = cam.scale(1.1, 350, 250);
			p.redraw();
		}
		else if (p.key == 'z') {
			p.B_ZOOM = cam.scale(0.9, 350, 250);
			p.redraw();
		}
		else if (p.key == 'r') {
			cam.reset();
			p.redraw();
		}

		return false;
	}

	function __frameRates(pan) {
		p.push();
		p.textSize(12);
		p.fill("#FF0000");

		let d = p.createVector(150, 100);
		let text = 
		`panning: (${pan.x}, ${pan.y})\n
		offset: (${p.B_OFFSET.x}, ${p.B_OFFSET.y})\n
		maxdiff: (${p.B_MAXDIFF.x}, ${p.B_MAXDIFF.y})\n
		viewsize: (${p.width}, ${p.height})
		`;
		text = `panning: (${pan.x}, ${pan.y})\n`;
		p.textAlign(p.RIGHT);
		p.text(text, p.width - d.x, p.height - d.y, d.x, d.y);
		p.pop();
	}

}

new p5(sketch);


