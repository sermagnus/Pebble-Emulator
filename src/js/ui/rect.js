var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var StageElement = require('./element');

var defaults = {
  backgroundColor: 'white',
  borderColor: 'clear',
};

var Rect = function(elementDef) {
  StageElement.call(this, elementDef);
  myutil.shadow(defaults, this.state);
  this.state.type = 1;
};

util2.inherit(Rect, StageElement);

module.exports = Rect;
