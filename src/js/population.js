// Generates and updates bird data off of defaults from globals.js, and eventually
// from the JSON bird data.

import p5 from 'p5';
import Bird from './bird.js';
import PopChart from './pop-chart.js';
import { B_POPSCALE } from './settings.js';

function Population(p, dim, bird_data) {
	this.p = p;
	this.dim = dim;
	this.bird_data = bird_data;
	this.visibleBirds = [];
}

// only returns currently visible birds!!
Population.prototype.getBirds = function() {
	return this.birds;
}

Population.prototype.getVisibleBirds = function() {
	return this.visibleBirds;
}

Population.prototype.getColors = function() {
	return this.colors;
}

Population.prototype.makeChart = function(birdNames, today, colors) {
	this.chart = new PopChart(birdNames, today, colors);
	return this.chart;
}

Population.prototype.makeBirds = function(today, habitats, pan) {
	let birds = [];
	let colors = [];
	let birdNames = [];
	let center = this.center;
	let p = this.p;

	this.visibleBirds = [];
	let totalBirds = 0;

	// cycle through list of birds/day
	let bCount = 0;
	for (let i = 0; i < today.length; i++) {
		birdNames[i] = this.bird_data[i].name;

		if (today[i] > 0) {
			let color = __randomColor();
			colors[i] = color;

			// place # birds of species i
			let pop = Math.ceil(today[i] * B_POPSCALE);
			// console.log("the pop: "+pop+", i: "+i);
			totalBirds += pop;

			for (let j = 0; j < pop; j++) {
				let b = new Bird(p, this.bird_data[i], this.dim, habitats, color);
				b.species = i;
				b.id = bCount;
				b.update(this.dim.view, pan);
				
				// add to the list of lived-in tiles for collision detection/etc
				p.B_USEDTILES.push(b.tile);
				if (b.isVisible()) {
					this.visibleBirds.push(b);
				}
				birds[bCount] = b;
				bCount++;
			}
		}
	}
	console.log("total birds: " + totalBirds);
	// this.makeChart(this.bird_data, today, colors);

	this.colors = colors;
	this.birds = birds;
	return birds;
}

Population.prototype.draw = function(zoom, birdSelected) {
	for (var i = 0; i < this.visibleBirds.length; i++) {
		this.visibleBirds[i].draw(zoom, birdSelected);
		
	}
}

Population.prototype.update = function(panning) {
	this.visibleBirds = [];
	let p = this.p;

	for (var i = 0; i < this.birds.length; i++) {
		this.birds[i].update(p.B_CENTER, panning);
		if (this.birds[i].isVisible()) {
			this.visibleBirds.push(this.birds[i]);
		}
	}
	
	return this.visibleBirds;
}

Population.prototype.clear = function() {
	this.birds = [];
	this.visibleBirds = [];
}

function __randomColor() {
	return {
				r: Math.random() * 255,
				g: Math.random() * 255,
				b: Math.random() * 255
			};
}

export default Population;

