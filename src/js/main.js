
// import '../sass/style.scss';
import p5 from 'p5';
import AudioManager from './audio.js';
import ShoreMap from './shoremap.js';
import Population from './population.js';
import cobb_data from './data/cobb-island-data.js';
import { bird_data } from './data/bird-species-data.js';
import { B_COLS, B_ROWS, B_MAPSCALE, B_MAXNODES } from './settings.js';

var audiom, map, popul;
var dim = {};

const sketch = (p) => {
	var soundStarted;

	p.setup = () => {
		dim.view = p.createVector(700, 500);
		dim.map = p.createVector(
			B_COLS * B_MAPSCALE,
			B_ROWS * B_MAPSCALE
		);

		// a few more constants
		p.B_CENTER = p5.Vector.mult(dim.view, 0.5);
		p.B_PANNING = p.createVector();
		p.B_MAXDIFF = p5.Vector.sub(dim.map, dim.view);
		p.B_USEDTILES = [];
		
		p.createCanvas(dim.view.x, dim.view.y);
		p.background(40);
		
		popul = new Population(p, dim, bird_data);
		popul.makeBirds(cobb_data["birds_and_days"][0]["count"], cobb_data["habitats_in_pixels"]);
		
		map = new ShoreMap(p, dim, cobb_data);
		audiom = new AudioManager(p, B_MAXNODES);
		audiom.setup(cobb_data["birds_and_days"][0]["count"], bird_data);
		soundStarted = false;

		p.noLoop();
	};

	p.draw = () => {
		map.drawFullMap(popul.getVisibleBirds(), p.B_PANNING);
	}

	p.mousePressed = () => {
		if (!soundStarted) {
			soundStarted = true;
		}
		p.loop();
	}

	p.mouseDragged = () => {
		p.B_PANNING.add(p.createVector(p.mouseX - p.pmouseX, p.mouseY - p.pmouseY));
		p.B_PANNING.x = p.constrain(p.B_PANNING.x, -p.B_MAXDIFF.x, 0);
		p.B_PANNING.y = p.constrain(p.B_PANNING.y, -p.B_MAXDIFF.y, 0);
		
		popul.update(p.B_PANNING);
		audiom.update(popul.getVisibleBirds());

		return false;
	}

	p.mouseReleased = () => {
		p.noLoop();
	}
}

new p5(sketch);


