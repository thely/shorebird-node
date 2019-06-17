
////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//      P 5 . J S       C A N V A S C A M                                     //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// @bitcraftlab 2013 - 2016

// This library provides a 2D camera for the canvas.
// Use this if you want to make your sketch zoomable and draggable
// Original java version here: https://github.com/bitcraftlab/canvascam/

import p5 from 'p5';

p5.prototype.CanvasCam = function(zoom, tx, ty) {

  // variables for storing defaults
  var zoom0, tx0, ty0;

  var limit = {};
  var dim = {};

  // self reference
  var cam = this;
  var w = this.height;
  var h = this.width;

  // reset to defaults
  reset(zoom, tx, ty);

  // reset(zoon, tx, ty) will reset to new defaults
  // reset() will reset to previous defaults
  function reset(_zoom, _tx, _ty) {
    zoom = zoom0 = _zoom || zoom0 || 1.0;
    tx = tx0 = _tx || tx0 || 0;
    ty = ty0 = _ty || ty0 || 0;
  }

  // update mouse coordinates of the camera
  var _updateNextMouseCoords = p5.prototype._updateNextMouseCoords;
  p5.prototype._updateNextMouseCoords = function(e) {
    _updateNextMouseCoords.bind(this)(e);
    cam.mouseX = camX.call(this, this.mouseX);
    cam.mouseY = camY.call(this, this.mouseY);
  };

  // update previous mouse coordinates of the camera
  var _updateMouseCoords = p5.prototype._updateMouseCoords;
  p5.prototype._updateMouseCoords = function(e) {
    _updateMouseCoords.bind(this)(e);
    cam.pmouseX = camX.call(this, this.pmouseX);
    cam.pmouseY = camY.call(this, this.pmouseY);
  };

  // reset the matrix to camera defaults (called at the beginning of every redraw function)
  p5.prototype.resetMatrix = function() {
    this._renderer.resetMatrix();
    this.translate(this.width/2, this.height/2);
    this.scale(zoom);
    this.translate(-tx, -ty);
    return this;
  };

  // cam x-coord to canvas x-coord
  function camX(x) {
    return tx + (x - this.width/2) / zoom;
  }

  // cam y-coord to canvas y-coord
  function camY(y) {
    return ty + (y - this.height/2) / zoom;
  }

  function constrain(val, min, max) {
    let x = (val <= min) ? min : val;
    x = (val >= max) ? max : x;
    return x;
  }

  // expose reset function
  this.reset = reset;

  // rescale the camera relative to the center
  this.scale = function(factor, centerX, centerY) {
    var newZoom = zoom * factor;
    var dx = centerX - dim.x/2;
    var dy = centerY - dim.y/2;
    tx += dx/zoom - dx/newZoom;
    ty += dy/zoom - dy/newZoom;
    zoom = newZoom;

    return zoom;
  };

  // translate the origin of the camera's coordinate system
  this.translate = function(dx, dy) {
    tx = constrain(tx + dx, limit.x.min, limit.x.max);
    ty = constrain(ty + dy, limit.y.min, limit.y.max);
  };

  this.getPanning = function() {
    return {x: tx, y: ty};
  }

  this.dimensions = function(view, map) {
    dim.x = view.x;
    dim.y = view.y;
    limit.x = {
      min: view.x / 2,
      max: map.x - (view.x / 2)
    };
    limit.y = {
      min: view.y / 2,
      max: map.y - (view.y / 2)
    };
    console.log("dimensions: ");
    console.log(limit);

    return limit;
  }


};

export default p5.prototype.CanvasCam;