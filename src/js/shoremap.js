

// Draws and updates the map.

import p5 from 'p5';
import IslandMap from './island-map.js';
import { B_DEBUG } from './settings.js';

function ShoreMap(p, dim, data) {
	// this.island = island;
	// this.birds = birds;
	this.p = p;
	this.dim = dim;
	console.log("inside the map: ");
	console.log(this.dim);
	this.center = { x: 0, y: 0 };

	this.island = new IslandMap(p, dim, data);
}

ShoreMap.prototype.clear = function() {
	this.island = null;
}

ShoreMap.prototype.setIsland = function(data) {
	this.island = new IslandMap(this.p, this.dim, data);
}

ShoreMap.prototype.drawFullMap = function(birds, panning) {
	var p = this.p;
	p.noStroke();
	p.fill("#FFFFF0");
	p.rect(0, 0, this.dim.view.x, this.dim.view.y);

	this.island.drawHabitats(panning);
	this.drawBirds(birds);
	// this.getLargerMap(panning);

	this.center = p5.Vector.div(this.dim.view, 2);
	// p.rect(0,0,10,10);
	
}

ShoreMap.prototype.drawBirds = function(birds) {
	for (var i = 0; i < birds.length; i++) {
		if (birds[i].isVisible()) {
			birds[i].draw();
		}
		
	}
	this.p.noStroke();
	this.p.strokeWeight(1);
}

ShoreMap.prototype.getCenter = function() {
	return {
		x: this.dim.view.w / 2,
		y: this.dim.view.h / 2
	};
}

ShoreMap.prototype.getLargerMap = function(panning) {
	var p = this.p;
	p.fill("#d3f2d3");
	var start;
	if (panning) {
		start = panning;
	}
	else {
		start = { x: 0, y: 0 };
	}
	
	p.rect(start.x, start.y, dim.map.x, dim.map.y);
}

export default ShoreMap;