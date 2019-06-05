// Generates and updates bird data off of defaults from globals.js, and eventually
// from the JSON bird data.

import p5 from 'p5';
import Bird from './bird.js';

function Population(p, dim, bird_data) {
	this.p = p;
	this.dim = dim;
	this.bird_data = bird_data;
	this.visibleBirds = [];
	// this.birds = this.makeBirds(today, habitats);
	// this.center = p5.Vector.mult(this.dim.view, 0.5);
}

// only returns currently visible birds!!
Population.prototype.getBirds = function() {
	return this.birds;
}

Population.prototype.getVisibleBirds = function() {
	return this.visibleBirds;
}

Population.prototype.makeBirds = function(today, habitats) {
	var birds = [];
	var center = this.center;
	let p = this.p;
	console.log(today);
	console.log(habitats);

	this.visibleBirds = [];
	var totalBirds = 0;

	// cycle through list of birds/day
	var bCount = 0;
	for (var i = 0; i < today.length; i++) {
		if (today[i] > 0) {
			// one color per species
			var color = {
				r: Math.random() * 255,
				g: Math.random() * 255,
				b: Math.random() * 255
			};

			// // place # birds of species i
			var pop = Math.ceil(today[i] * p.B_POPSCALE);
			console.log("the pop: "+pop);
			totalBirds += pop;

			for (var j = 0; j < pop; j++) {
				var b = new Bird(p, this.bird_data[i], habitats, color);
				b.species = i;
				b.id = bCount;
				
				// add to the list of lived-in tiles for collision detection/etc
				p.B_USEDTILES.push(b.tile);
				if (b.visible.now) {
					this.visibleBirds.push(b);
				}
				birds[bCount] = b;
				bCount++;
			}
		}
	}
	console.log(totalBirds);
	this.birds = birds;
	return birds;
}

Population.prototype.update = function(panning) {
	this.visibleBirds = [];
	let p = this.p;

	for (var i = 0; i < this.birds.length; i++) {
		var bird = this.birds[i];
		bird.pos = p5.Vector.add(bird.fixedPos, panning);
		bird.checkIsVisible(this.dim.view);
		if (bird.visible.now) {
			this.visibleBirds.push(bird);
			bird.audioPosition(p);
		}

		this.birds[i] = bird;
	}

	return this.visibleBirds;
}

export default Population;

