import p5 from 'p5';
import { B_ROWS, B_MAPSCALE } from './settings.js';

function Bird(p, info, habitats, color) {
	this.p = p;
	this.name = info.name;
	this.pickHabitat(info.land_preference, habitats);

	// find the top-left start pos of this tile
	var start = p.createVector(
		parseInt(Math.floor(this.tile / B_ROWS) * B_MAPSCALE),
		parseInt(((this.tile) % B_ROWS) * B_MAPSCALE)
	);
	// generate a bird position inside the tile
	this.pos = p.createVector(
		p.random(start.x, start.x + B_MAPSCALE),
		p.random(start.y, start.y + B_MAPSCALE)
	);
	this.fixedPos = this.pos.copy();

	this.visible = {
		then: false,
		now: false
	};
	// this.checkIsVisible(dim.view);

	this.hasAudioNode = false;

	// get the azimuth/distance for binaural panning and gain
	p.push();
	p.translate(p.B_CENTER.x, p.B_CENTER.y);
	this.audioPosition(p);
	p.pop();

	this.color = color;
}

Bird.prototype.pickHabitat = function(prefs, habitats) {
	let p = this.p;

	var ret = [];
	var hab = p.random(prefs);
	while (!(hab in habitats)) {
		hab = p.random(prefs);
	}
	var tile = p.random(habitats[hab]);
	this.tile = tile - 1;
	this.hab = hab;
	
	return tile;
}

Bird.prototype.checkIsVisible = function(pos2) {
	this.visible.then = this.visible.now;
	this.visible.now = checkBounds(this.pos, pos2);
}

function checkBounds(pos1, pos2) {
	if (pos1.x < 0 || pos1.y < 0) {
		return false;
	}
	if (pos1.x >= pos2.x || pos1.y >= pos2.y) {
		return false;
	}
	return true;
}

Bird.prototype.audioPosition = function(p) {
	p.push();
	p.translate(p.B_CENTER.x, p.B_CENTER.y);
	this.azi = calcAngle(p, this.pos);
	this.dist = calcDistance(p, this.pos);
	p.pop();
}

//p1 is the centerpoint in all cases
function calcAngle(p,p2) {
	var diff = p5.Vector.sub(p.B_CENTER, p2).rotate(p.HALF_PI);
	var azi = p.degrees(diff.heading()).toFixed(2);
	return -azi; 
}

function calcDistance(p,p2) {
	var diff = p5.Vector.sub(p.B_CENTER, p2);
	var c = diff.mag().toFixed(2);

	return c / 300;
}

export default Bird;