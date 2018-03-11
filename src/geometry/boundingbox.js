
Scintilla.BoundingBox = function(x,y,width,height) {

this.center = new Scintilla.Vector(x+width/2,y+height/2);
this.size = new Scintilla.Vector(width,height);
this.min = new Scintilla.Vector(x,y);
this.max = new Scintilla.Vector(x+width,y+height);
this.box = new Scintilla.Rect(x,y,width,height);

}

Scintilla.BoundingBox.prototype = {

set : function(minX,minY,maxX,maxY) {

this.min.set(minX,minY);
this.max.set(maxX,maxY);
this.box.set(this.min.x,this.min.y,this.max.x-this.min.x,this.max.y-this.min.y);
this.center.x = (this.max.x-this.min.x)/2;
this.center.y = (this.max.y-this.min.y)/2;

},


// position (vector)
// scale (vector)
// rotation (vector x = cos, y = sin)
setup : function(pos, scale, rotation, anchor, width, height) {

  var coords = [];
  var negx = 1;
  var negy = 1;

  if (scale.x < 0)
        negx = -1;
  if (scale.y < 0)
        negy = -1;



  this.size.x = width*scale.x*negx;
  this.size.y = height*scale.y*negy;
  anchor.x *= scale.x*negx;
  anchor.y *= scale.y*negy;
  pos.x -= anchor.x;
  pos.y -= anchor.y;
  anchor.x += pos.x;
  anchor.y += pos.y;

  var callback = null;

  if (rotation instanceof  Scintilla.Vector)
      callback = this['calcCoordsCosSin'];
    else
      callback = this['calcCoords'];

  coords[0] = callback( pos.x, pos.y, anchor, rotation);
  coords[1] = callback( pos.x + this.size.x,  pos.y, anchor,rotation);

  coords[2] = callback( pos.x , pos.y + this.size.y, anchor,rotation);
  coords[3] = callback( pos.x + this.size.x , pos.y + this.size.y,anchor, rotation);



  this.min.x = Math.min(coords[0].x,coords[1].x,coords[2].x,coords[3].x);
  this.min.y = Math.min(coords[0].y,coords[1].y,coords[2].y,coords[3].y);

  this.max.x = Math.max(coords[0].x,coords[1].x,coords[2].x,coords[3].x);
  this.max.y = Math.max(coords[0].y,coords[1].y,coords[2].y,coords[3].y);
  this.center.x = pos.x+(this.max.x-this.min.x)/2;
  this.center.y = pos.y+(this.max.y-this.min.y)/2;
  this.box.set(this.min.x,this.min.y,this.max.x-this.min.x,this.max.y-this.min.y);

},

/*setBySprite : function(sprite, position, scale, rotation) {

    //this.set(position,scale,rotation,);

}*/

setByGameObject : function(gameObject, local) {

  //if (gameObject.render != null) {

    if (local) {
      this.setup(gameObject.position,
              gameObject.scale,
              gameObject._cosSin,
              gameObject.render.origin,
              gameObject.render.width,
              gameObject.render.height
            );
    } else {

      var frame = gameObject.component['render'].frame;

      var pos = {x:gameObject.worldPosition.x, y:gameObject.worldPosition.y};
      var org = {
        x:gameObject.origin.x * frame.width,
        y:gameObject.origin.y * frame.height};

      pos.x += gameObject.game.camera.view.x;
      pos.y += gameObject.game.camera.view.y;

      this.setup(pos,
              gameObject.worldScale,
              gameObject.worldRotation,
              org,
              frame.width,
              frame.height
            );
    }


  return this;


},

setByPosition : function(position) {

  this.min.set(position.x,position.y);
  this.max.set(position.x+1,position.y+1)
  this.box.set(position.x,position.y,1,1);

},

setByShape : function(shape,position) {


  var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  var type = shape.getType();

  if (type == "Polygon") {

    var points = shape.getPoints();

    points.forEach(function (point) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);

    });



  }

  if (position !== undefined) {
    minX += position.x;
    minY += position.y;
    maxX += position.x;
    maxY += position.y;
  }


  this.min.set(minX,minY);
  this.max.set(maxX,maxY)
  this.box.set(minX,minY,maxX-minX,maxY-minY);

},

calcCoordsCosSin : function(x, y, anchor, cos_and_sin) {

  var coord = {x:0,y:0};

  coord.x = anchor.x + ((x-anchor.x) * cos_and_sin.x) - ((y-anchor.y) * cos_and_sin.y);
  coord.y = anchor.y - ((x-anchor.x) * cos_and_sin.y) - ((y-anchor.y) * cos_and_sin.x);

    return coord;

},

calcCoords : function(x,y,anchor,rotation) {

  var coord = {x:0,y:0};

  coord.x = anchor.x + ((x-anchor.x) * Math.cos(rotation)) - ((y-anchor.y) * Math.sin(rotation));
  coord.y = anchor.y - ((x-anchor.x) * Math.sin(rotation)) - ((y-anchor.y) * Math.cos(rotation));

    return coord;

}



}
