import { B_ROWS, B_MAPSCALE } from './settings.js';

function IslandMap(p, dim, data) {
	this.p = p;
	this.dim = dim;
	this.name = data["name"];
	this.pixelList = data["pixel_cover_list"];
	this.colorList = __fixColors(data["habitat_pixel_colors"]);
}

IslandMap.prototype.drawHabitats = function(panning) {
	var p = this.p;

	if (!panning) {
		panning = p.createVector();
	}

	for (var i = 0; i < this.pixelList.length; i++) {
		var hab = this.pixelList[i];

		// top-left of the tile & size of that tile
		var start = p.createVector(
			(Math.floor(i / B_ROWS) * B_MAPSCALE) + panning.x,
			((i % B_ROWS) * B_MAPSCALE) + panning.y
		);
		var size = p.createVector(B_MAPSCALE, B_MAPSCALE);

		// draw that tile, if you can see it!
		if (__isTileVisible(start, size, this.dim.view)) {
			var color = this.colorList[hab];
			__drawTile(p, color, start, size);
		}
	}
}

function __drawTile(p, color, start, size) {
	p.push();
	p.noStroke();

	p.fill(color[0], color[1], color[2]);
	p.rect(start.x, start.y, size.x, size.y);

	p.pop();
}

function __drawTileBorders(i) {
	// ----- tile border visualization when desired
	if (B_USEDTILES.includes(i)) {
		this.p.stroke("#FFFF00");
		this.p.rect(start.x, start.y, size.x, size.y);
	}
}

function __generateColor(color) {
	return [color[0]*255, color[1]*255, color[2]*255];
	// return c;
}

function __fixColors(colorList) {
	for (let c in colorList) {
		colorList[c] = __generateColor(colorList[c]);
	}

	return colorList;
}

function __isTileVisible(start, size, mapDim) {
	if (start.x + size.x < 0 && start.y + size.y < 0) {
		return false;
	}
	if (start.x >= mapDim.x && start.y >= mapDim.y) {
		return false;
	}
	return true;
}

export default IslandMap;
