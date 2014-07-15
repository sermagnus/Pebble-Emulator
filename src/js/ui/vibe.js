var Vibe = {};
var simply = require('./simply');

Vibe.vibrate = function(type) {
  simply.impl.vibe(type);
};

module.exports = Vibe;