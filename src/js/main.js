
// import '../sass/style.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import './lib/p5.canvascam.js';
import AudioManager from './audio.js';
import ShoreMap from './shoremap.js';
import Population from './population.js';
import PopChart from './pop-chart.js';
import cobb_data from './data/cobb-island-data.js';
import hog_data  from './data/hog-island-data.js';
import all_bird_data from './data/all_bird_data.js';
import Bowser from "bowser";
import { B_WIDTH, B_HEIGHT, B_COLS, B_ROWS, B_MAPSCALE, B_MAXNODES, B_CANVAS_ID } from './settings.js';

var audiom, map, popul, cam, useData, cnv, chart, browser;
var islandSel, dateSel, birdSelected;
var dim = {};
var soundStarted, mouseOverCanvas;

const sketch = (p) => {

	function __defaults(dim) {
		// a few more globals
		p.B_CENTER = p5.Vector.mult(dim.view, 0.5);
		p.B_MAPCENTER = p5.Vector.mult(dim.map, 0.5);
		p.B_USEDTILES = [];
		p.B_ZOOM = 1;
	}

	p.setup = () => {
		// Establishing browser + map dimensions
		browser = Bowser.getParser(window.navigator.userAgent);
		console.log(`Viewing this in ${browser.getBrowserName()}`);
		dim.view = p.createVector(B_WIDTH, B_HEIGHT);
		dim.tiles = p.createVector( B_COLS, B_ROWS );
		dim.map = p.createVector(
			dim.tiles.x * B_MAPSCALE,
			dim.tiles.y * B_MAPSCALE
		);

		__defaults(dim);
		
		// Creating canvas
		cnv = p.createCanvas(dim.view.x, dim.view.y);
		cnv.parent(B_CANVAS_ID);
		cnv.mouseOver(function() { mouseOverCanvas = true; });
		cnv.mouseOut(function() { mouseOverCanvas = false; });
		p.background(40);

		// Creating camera
		cam = new p.CanvasCam(1, p.B_MAPCENTER.x, p.B_MAPCENTER.y);
		cam.dimensions(dim.view, dim.map);

		// Getting dropdowns for selecting island/date
		islandSel = p.select(".island-select");
		islandSel.changed(changeIsland);
		var parent = p.select(".data-menu");
		dateSel = p.createSelect().addClass("date-select");
		dateSel.changed(changeDate);
		parent.child(dateSel);

		// Building objects for population, chart, audio
		popul = new Population(p, dim, all_bird_data);
		chart = new PopChart();
		// audiom = new AudioManager(p, B_MAXNODES, browser.getBrowserName());
		birdSelected = {};

		p.frameRate(30);
		p.noLoop();
	};

	function changeIsland() {
		console.log(islandSel.value());

		// get the right data set
		if (islandSel.value() == "cobb_data") {
			useData = cobb_data;
		}
		else if (islandSel.value() == "hog_data") {
			useData = hog_data;
		}

		popul = new Population(p, dim, all_bird_data);
		map = new ShoreMap(p, dim, useData);

		// clear select list and begin anew
		p.removeElements();

		var parent = p.select(".data-menu");
		dateSel = p.createSelect().addClass("date-select");
		dateSel.changed(changeDate);
		parent.child(dateSel);

		for (let i = 0; i < useData["birds_and_days"].length; i++) {
			dateSel.option(useData["birds_and_days"][i]["date"], i);
		}
	}

	function changeDate() {
		let i = dateSel.value();
		
		__defaults(dim);
		popul.clear();
		map.clear();
		p.clear();
		cam.reset();

		popul.makeBirds(useData["birds_and_days"][i]["count"], useData["habitats_in_pixels"], cam.getPanning());
		chart.addData(all_bird_data, useData["birds_and_days"][i]["count"], popul.getColors());
		map.setIsland(useData);
		console.log(popul.getBirds());
		// audiom.setup(useData["birds_and_days"][i]["count"], all_bird_data);
		// soundStarted = false;

		p.redraw();
	}

	p.draw = () => {
		let pan = cam.getPanning();
		let zoom = cam.getZoom();
		pan = p.createVector(pan.x, pan.y);
		map.drawFullMap(popul.getVisibleBirds());
		popul.update(pan);
		popul.draw(zoom, birdSelected);
		// audiom.update(popul.getVisibleBirds(), popul.getBirds());
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

	p.mouseClicked = () => {
		birdSelected = chart.getSelected();
		p.redraw();
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

}

new p5(sketch);


