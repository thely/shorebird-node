
// import '../sass/style.scss';
import p5 from 'p5';
import { Camera } from './lib/p5.canvascam.js';
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
		p.B_PANNING = p5.Vector.mult(p.B_CENTER, -1);
		// p.B_PANNING = p.createVector();
		p.B_MAXDIFF = p5.Vector.sub(dim.map, dim.view).add(p.B_CENTER).mult(0.5);
		p.B_USEDTILES = [];
		p.B_ZOOM = 1;
		
		p.createCanvas(dim.view.x, dim.view.y);
		p.background(40);

		cam = new p5.Camera();
		
		popul = new Population(p, dim, bird_data);
		popul.makeBirds(cobb_data["birds_and_days"][0]["count"], cobb_data["habitats_in_pixels"]);
		
		map = new ShoreMap(p, dim, cobb_data);
		audiom = new AudioManager(p, B_MAXNODES);
		audiom.setup(cobb_data["birds_and_days"][0]["count"], bird_data);
		soundStarted = false;

		p.frameRate(30);
		p.noLoop();
	};

	p.draw = () => {
		// map.drawFullMap(popul.getVisibleBirds(), p.createVector(p.B_PANNING.x-p.B_CENTER.x, p.B_PANNING.y-p.B_CENTER.y));
		p.push();
		p.translate(p.width/2, p.height/2);
		p.scale(p.B_ZOOM);
		p.translate(p.B_PANNING.x/p.B_ZOOM, p.B_PANNING.y/p.B_ZOOM);


		p.fill("#FF0000");
		p.rect(0, 0, 10, 10);
		
		popul.update(p.B_PANNING);
		map.drawFullMap(popul.getBirds(), p.B_PANNING);
		audiom.update(popul.getVisibleBirds());

		p.pop();

		__frameRates(p.B_PANNING);
	}

	p.mousePressed = () => {
		if (!soundStarted) {
			soundStarted = true;
		}
		p.loop();
	}

	p.mouseDragged = () => {
		p.B_OFFSET = p.createVector(p.mouseX - p.pmouseX, p.mouseY - p.pmouseY);
		p.B_PANNING.add(p.createVector(p.mouseX - p.pmouseX, p.mouseY - p.pmouseY));
		p.B_PANNING.x = p.round(p.constrain(p.B_PANNING.x, -p.B_MAXDIFF.x, -p.B_CENTER.x/2));
		p.B_PANNING.y = p.round(p.constrain(p.B_PANNING.y, -p.B_MAXDIFF.y, -p.B_CENTER.y/2));

		return false;
	}

	p.mouseReleased = () => {
		p.noLoop();
	}

	p.keyPressed = () => {
		if (p.key == 'a') {
			p.B_ZOOM += 0.1;
		}
		else if (p.key == 'z') {
			p.B_ZOOM -= 0.1;
		}

		p.redraw();
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
		p.textAlign(p.RIGHT);
		p.text(text, p.width - d.x, p.height - d.y, d.x, d.y);
		p.pop();
	}

}

new p5(sketch);


