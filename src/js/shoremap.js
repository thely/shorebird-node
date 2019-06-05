
// Draws and updates the map.

import p5 from 'p5';
import IslandMap from './island-map.js';

function ShoreMap(p, dim, data) {
	// this.island = island;
	// this.birds = birds;
	this.p = p;
	this.dim = dim;
	this.center = { x: 0, y: 0 };

	this.island = new IslandMap(p, dim, data);
}

ShoreMap.prototype.drawFullMap = function(birds, panning) {
	this.baseMap(panning);
	this.drawBirds(birds);
}

ShoreMap.prototype.baseMap = function(panning) {
	var p = this.p;
	p.noStroke();
	p.fill("#FFFFF0");
	p.rect(0, 0, this.dim.view.x, this.dim.view.y);

	this.island.drawHabitats(panning);
	// this.getLargerMap(panning);

	this.center = p5.Vector.div(this.dim.view, 2);
	p.fill("#000000");
	p.rect(this.center.x, this.center.y, 2, 2);
}

ShoreMap.prototype.drawBirds = function(birds) {
	for (var i = 0; i < birds.length; i++) {
		if (birds[i].visible.now) {
			this.p.fill(birds[i].color.r, birds[i].color.g, birds[i].color.b);
			this.p.rect(birds[i].pos.x, birds[i].pos.y, 5, 5);
		}
	}
}

ShoreMap.prototype.getCenter = function() {
	return {
		x: this.dim.view.w / 2,
		y: this.dim.view.h / 2
	};
}

ShoreMap.prototype.getLargerMap = function(panning) {
	fill("#d3f2d3");
	var start;
	if (panning) {
		start = panning;
	}
	else {
		start = { x: 0, y: 0 };
	}
	
	rect(start.x, start.y, dim.map.x, dim.map.y);
}

export default ShoreMap;