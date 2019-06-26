import p5 from 'p5';
import { B_ROWS, B_MAPSCALE } from './settings.js';

function Bird(p, info, dim, habitats, color) {
	this.p = p;
	this.name = info.name;
	this.info = info;
	this.pickHabitat(info.land_preference, habitats);

	// find the top-left start pos of this tile
	var start = p.createVector(
		parseInt(Math.floor(this.tile / dim.tiles.y) * B_MAPSCALE),
		parseInt(((this.tile) % dim.tiles.y) * B_MAPSCALE)
	);
	// generate a bird position inside the tile
	this.fixedPos = p.createVector(
		p.round(p.random(start.x, start.x + B_MAPSCALE)),
		p.round(p.random(start.y, start.y + B_MAPSCALE))
	);

	// this.fixedPos = __compensatePosition(p, this.fixedPos);
	this.pos = this.fixedPos.copy();

	this.visible = {
		then: false,
		now: false
	};

	this.hasAudioNode = false;

	// get the azimuth/distance for binaural panning and gain
	this.audioPosition(p);

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

Bird.prototype.update = function(bounds, pan) {
	this.pos = p5.Vector.sub(this.fixedPos, pan);
	this.checkIsVisible(bounds, pan);
	if (this.visible.now) {
		this.audioPosition(this.p);
	}
}

Bird.prototype.draw = function() {
	this.p.fill(this.color.r, this.color.g, this.color.b);
	this.p.rect(this.fixedPos.x, this.fixedPos.y, 5, 5);
	
	__nameText.call(this);
}

function __positionText() {
	this.p.push();
	this.p.translate(this.fixedPos.x, this.fixedPos.y);
	this.p.textSize(12);
	let str = this.id +"\n("+this.fixedPos.x+","+this.fixedPos.y+")\n("+this.pos.x+","+this.pos.y+")";
	this.p.text(str, 10, 0);
	this.p.pop();
}

function __nameText() {
	this.p.push();
	this.p.translate(this.fixedPos.x, this.fixedPos.y);
	this.p.textSize(12);
	// let str = this.id +"\n("+this.fixedPos.x+","+this.fixedPos.y+")\n("+this.pos.x+","+this.pos.y+")";
	let str = `${this.info.common_name} (${this.info.name})`;
	this.p.text(str, 10, 0);
	this.p.pop();	
}

function __compensatePosition(p, pos) {
	return p5.Vector.sub(pos, p.B_CENTER);
}

// ------------------------------------------
// Methods for checking map visibility
Bird.prototype.isVisible = function() {
	return this.visible.now;
}

Bird.prototype.checkIsVisible = function(pos2, pan) {
	this.visible.then = this.visible.now;
	this.visible.now = __checkBounds(this.p, this.pos, pos2, pan);
}

function __checkBounds(p, pos1, pos2, pan) {
	if (pos1.x < -pos2.x/p.B_ZOOM || pos1.y < -pos2.y/p.B_ZOOM) {
		return false;
	}
	if (pos1.x >= pos2.x/p.B_ZOOM || pos1.y >= pos2.y/p.B_ZOOM) {
		return false;
	}
	return true;
}

// ------------------------------------------
// Methods for generating angles for binaural audio
Bird.prototype.audioPosition = function(p) {
	p.push();
	p.translate(p.B_CENTER.x, p.B_CENTER.y);
	this.azi = calcAngle(p, this.pos);
	this.dist = calcDistance(p, this.pos);
	p.pop();
}

//p1 is the centerpoint in all cases
function calcAngle(p,p2) {
	// var diff = p5.Vector.sub(p.B_CENTER, p2).rotate(p.HALF_PI);
	// var diff = 
	var azi = p.degrees(p2.rotate(p.HALF_PI).heading());
	return azi; 
}

function calcDistance(p,p2) {
	// var diff = p5.Vector.sub(p.B_CENTER, p2);
	var c = p2.mag() / 4;
	// console.log(c);

	return c;
}

export default Bird;