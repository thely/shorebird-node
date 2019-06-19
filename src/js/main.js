
// import '../sass/style.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import './lib/p5.canvascam.js';
import AudioManager from './audio.js';
import ShoreMap from './shoremap.js';
import Population from './population.js';
import cobb_data from './data/cobb-island-data.js';
// import { bird_data } from './data/bird-species-data.js';
import all_bird_data from './data/all_bird_data.js';
import { B_COLS, B_ROWS, B_MAPSCALE, B_MAXNODES } from './settings.js';

var audiom, map, popul, cam, useData, cnv;
var islandSel, dateSel;
var dim = {};
var soundStarted, mouseOverCanvas;

const sketch = (p) => {

	function __defaults(dim) {
		// a few more globals
		p.B_CENTER = p5.Vector.mult(dim.view, 0.5);
		p.B_MAPCENTER = p5.Vector.mult(dim.map, 0.5);
		p.B_OFFSET = p.createVector();
		p.B_PANNING = p.createVector();
		p.B_USEDTILES = [];
		p.B_ZOOM = 1;
	}

	p.setup = () => {
		dim.view = p.createVector(700, 500);
		dim.map = p.createVector(
			B_COLS * B_MAPSCALE,
			B_ROWS * B_MAPSCALE
		);

		__defaults(dim);
		
		cnv = p.createCanvas(dim.view.x, dim.view.y);
		cnv.mouseOver(function() { mouseOverCanvas = true; });
		cnv.mouseOut(function() { mouseOverCanvas = false; });
		p.background(40);

		cam = new p.CanvasCam(1, p.B_MAPCENTER.x, p.B_MAPCENTER.y);
		cam.dimensions(dim.view, dim.map);

		islandSel = p.select(".island-select");
		islandSel.changed(changeIsland);
		dateSel = p.select(".date-select");
		dateSel.changed(changeDate);

		popul = new Population(p, dim, all_bird_data);
		audiom = new AudioManager(p, B_MAXNODES);

		p.frameRate(30);
		p.noLoop();
	};

	function changeIsland() {
		console.log(islandSel.value());
		if (islandSel.value() == "cobb_data") {
			useData = cobb_data;
		}
		else if (islandSel.value() == "hog_data") { // TODO: change me when Hog exists
			useData = cobb_data;
		}

		console.log(useData);
		map = new ShoreMap(p, dim, useData);

		for (let i = 0; i < useData["birds_and_days"].length; i++) {
			dateSel.option(useData["birds_and_days"][i]["date"], i);
		}
	}

	function changeDate() {
		let i = dateSel.value();
		// console.log("new date: "+i);
		// console.log(useData["birds_and_days"][i]["count"]);
		
		__defaults(dim);
		popul.clear();
		map.clear();
		p.clear();
		cam.reset();

		popul.makeBirds(useData["birds_and_days"][i]["count"], useData["habitats_in_pixels"], cam.getPanning());
		map.setIsland(useData);
		console.log(popul.getBirds());
		audiom.setup(useData["birds_and_days"][i]["count"], all_bird_data);
		// soundStarted = false;

		p.redraw();
	}

	p.draw = () => {
		let pan = cam.getPanning();
		pan = p.createVector(pan.x, pan.y);
		popul.update(pan);
		map.drawFullMap(popul.getVisibleBirds());
		audiom.update(popul.getVisibleBirds(), popul.getBirds());
	}

	p.mousePressed = () => {
		if (!soundStarted) {
			soundStarted = true;
		}
		if (mouseOverCanvas){
			p.loop();	
		}
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

	p.keyPressed = () => {
		if (p.key == 'a') {
			p.B_ZOOM = cam.scale(1.1, p.B_CENTER.x, p.B_CENTER.y);
			p.redraw();
		}
		else if (p.key == 'z') {
			p.B_ZOOM = cam.scale(0.9, p.B_CENTER.x, p.B_CENTER.y);
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


