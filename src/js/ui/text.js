var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var Propable = require('./propable');
var StageElement = require('./element');

var textProps = [
  'text',
  'font',
  'color',
  'textOverflow',
  'textAlign',
  'updateTimeUnits',
];

var defaults = {
  backgroundColor: 'clear',
  borderColor: 'clear',
  color: 'white',
};

var Text = function(elementDef) {
  StageElement.call(this, elementDef);
  myutil.shadow(defaults, this.state);
  this.state.type = 3;
};

util2.inherit(Text, StageElement);

Propable.makeAccessors(textProps, Text.prototype);

module.exports = Text;
