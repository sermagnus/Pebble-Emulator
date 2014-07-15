(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('./ui');
var Vector2 = require('./lib/vector2');
//var Settings = require('./settings');

Settings.config(
  { url: 'configurable.html' },
  function(e) {
    console.log('opening configurable');
  },
  function(e) {
    console.log('closed configurable');
    // Show the parsed response
    console.log("new options: ",e.options);
  }
);

var main = new UI.Card({
  title: 'Benvenuti in Virtual Pebble!',
  icon: 'images/menu_icon.png',
  subtitle: 'Cos\'è VirtualPebble',
  body: 'E\' emulatore Pebble compatibile con il framework pebblejs! Premi un tasto per una demo funzionalità implementate in questa release.'
});

main.on('click', 'up', showrell);
main.on('click', 'select', showrell);
main.on('click', 'down', showrell);
main.show();

function showrell(){
    var menu = new UI.Menu({
                    sections: [{
                        items: [{
                            title: 'Simple Card',
                            }, {
                            title: 'Window + Text',
                            }, {
                            title: 'Window + Action Bar',
                            }, {
                            title: 'Complex Menu',
                            }, {
                            title: 'Test Buttons',
                            }, {
                            title: 'Time Text',
                            }, {
                            title: 'Settings',
                            }, {
                            title: 'Animations',
                            }, {
                            title: 'Vibration',
                            }]
                    }]
                });
    menu.on('select', function(e) {
        demoHandler(e.item);
    });
    menu.show();
};

function demoHandler(id){
    
    switch(id){
        
        case 0:
            demoCard();
        break;
        
        case 1:
            demoWindowAndText();
        break;
        
        case 2:
            demoActionBar();
        break;
        
        case 3:
            demoComplexMenu();
        break;
        
        case 4:
            demoTestPulsanti();
        break;
        
        case 5:
            demoTimeText();
        break;
        
        case 6:
            demoSettings();
        break;
        
        case 7:
            demoAnimations();
        break;
        
        case 8:
            demoVibration();
        break;
        
    }
}

function demoComplexMenu(){
    var menu = new UI.Menu({
        sections: [{
            items: [{
                    title: 'Menu Title 1',
                    icon: 'images/menu_icon.png',
                    subtitle: 'Scegli me!'
                }, {
                    title: 'Second Title',
                    subicon: 'images/menu_icon.png',
                    subtitle: 'No scegli me!'
                }, {
                    title: 'Third Title',
                    subtitle: 'Cliccami!'
                }, {
                    title: 'Forth Title',
                    subtitle: 'Non pensarli, clicca me!'
                }]
        }]
    });
    var section = {
        title: 'Questa è una sezione',
        items: [{
                title: 'Sapevi che i menu si possono dividere su più sezioni?'
            }]
    };
    menu.section(1, section);
    menu.on('select', function(e) {
        var card = new UI.Card();
        card.body('Hai scelto un elemento, della sezione: ' + e.section + ' e in posizione: ' + e.item);
        card.show();
    });
    menu.show();
}

function demoCard(){
    var card = new UI.Card({
      fullscreen: true
    });
    card.title('Simple Card');
    card.icon('images/menu_icon.png');
    card.subtitle('Una semplice Finesta');
    card.body('Con Pebblejs le Card sono facilmente configurabili: questa ad esempio è in modalità fullscreen ed ha un icona!');
    card.show();
}

function demoActionBar(){
    var wind = new UI.Window({
        action: {
            //backgroundColor: 'black',
            up: 'images/up.png',
            down: 'images/down.png',
            select: 'images/setup.png'
        }
    });
    var textfield = new UI.Text({
        position: new Vector2(0, 50),
        size: new Vector2(120, 30),
        font: 'gothic-24-bold',
        text: 'Questa finestra ha un action bar!',
        textAlign: 'center'
    });
    wind.add(textfield);
    wind.show();
}

function demoWindowAndText(){
    var win = new UI.Window();
    win.add(new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(50, 60),
        text: 'Questa è una finestra',
        textAlign: 'left'
    }));
        win.add(new UI.Text({
        position: new Vector2(44, 52),
        size: new Vector2(100, 30),
        text: 'Con caselle di testo di tipo UI.Text, posizionate arbitrariamente',
        textAlign: 'right'
    }));
    win.show();
}


function demoTestPulsanti(){    
    var card = new UI.Card({
      title: 'Test Pulsanti',
      subtitle: 'Io gestisco click e longclick!'
    });
    
    card.on('click', 'up', function(){
        mostraRisultato('click', 'up');
    });    
    card.on('longClick', 'up', function(){
        mostraRisultato('longClick', 'up');
    });
    
    card.on('click', 'down', function(){
        mostraRisultato('click', 'down');
    });    
    card.on('longClick', 'down', function(){
        mostraRisultato('longClick', 'down');
    });
    
    card.on('click', 'select', function(){
        mostraRisultato('click', 'select');
    });    
    card.on('longClick', 'select', function(){
        mostraRisultato('longClick', 'select');
    });
    
    var resultTimeout = null;
    function mostraRisultato(tipo_click, tipo_pulsante){
        clearTimeout(resultTimeout);
        var result = new UI.Card({
            title: 'Hai fatto un',
            subtitle: '"'+tipo_click+'" su "'+tipo_pulsante+'"',
            body: 'Se aspetti, scompaio automaticamente tra 3 secondi'
          });
        result.show();
        resultTimeout = window.setTimeout(function(){
            result.hide();
            result = null;
        }, 3000);
    };
    
    card.show();
}

function demoTimeText(){
    var win = new UI.Window();
    var timetextfield = new UI.TimeText({
        position: new Vector2(0, 50),
        size: new Vector2(120, 30),
        font: 'gothic-24-bold',
        text: 'Oggi è %A %d %B e sono le %H:%M:%S',
        textAlign: 'center',
        updateTimeUnits: '1000' //specifiche non chiare, come specifico l'updateTimeUnit?
    });
    win.add(timetextfield);
    win.show();
}

function demoSettings(){
    
    var savedOptions = Settings.option();
    var selectedColors = [];
    
    if(savedOptions['checkbox-red']) selectedColors.push('Red');
    if(savedOptions['checkbox-blue']) selectedColors.push('Blue');
    if(savedOptions['checkbox-green']) selectedColors.push('Green');
    if(savedOptions['checkbox-yellow']) selectedColors.push('Yellow');
    
    var menu = new UI.Menu({
        sections: [{
            title: 'Impostazioni salvate',
            items: [{
                    title: 'Inserisci del testo',
                    subtitle: savedOptions.note ? savedOptions.note : 'non inserito'
                }, {
                    title: 'Usa funzioni speciali:',
                    subtitle: savedOptions['special-feature'] ? 'Si' : 'No'
                }, {
                    title: 'Colori scelti',
                    subtitle: selectedColors.length>0 ? selectedColors.join(',') : 'nessuno'
                }]
        }]
    });
    menu.show();

}

function demoAnimations(){
    
    var win = new UI.Window();
    var textfield = new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(20, 20),
        text: 'A',
        textAlign: 'center'
    });
    win.add(textfield);
    win.show();
    
    function first(){
        return textfield.animate({
            size: new Vector2(144, 20),
            position: new Vector2(0, 132)
        },2000);
    }
    function second(){
        return textfield.animate({
            size: new Vector2(0, 0),
            position: new Vector2(20, 20)
        },2000);
    }
    
    textfield.animate({
                    size: new Vector2(144, 20),
                    position: new Vector2(0, 132)
                },2000);
    textfield.queue(function(next){
                    this.backgroundColor('white');
                    console.log("white")
                    next();
                })
    textfield.animate({
                size: new Vector2(0, 0),
                position: new Vector2(20, 20)
            },2000);
    
    
}


function demoVibration(){

    var vibemenu = new UI.Menu({
        sections: [{
            title: 'Tipo di vibrazione',
            items: [{
                    title: 'Short',
                }, {
                    title: 'Long',
                }, {
                    title: 'Double'
                }]
        }]
    });
    
    vibemenu.on('select', function(e) {
        switch(e.item){
            
            case 0: // short
                Vibe.vibration('short');
                break;
                
            case 1: // long
                Vibe.vibration('short');
                break;
                
            case 2: // double
                Vibe.vibration('double');
                break;
        }
    });
    vibemenu.show();

}



},{"./lib/vector2":8,"./ui":10}],2:[function(require,module,exports){
/*
 * ajax.js by Meiguro - MIT License
 */

var ajax = (function(){

var formify = function(data) {
  var params = [], i = 0;
  for (var name in data) {
    params[i++] = encodeURIComponent(name) + '=' + encodeURIComponent(data[name]);
  }
  return params.join('&');
};

var deformify = function(form) {
  var params = {};
  form.replace(/(?:([^=&]*)=?([^&]*)?)(?:&|$)/g, function(_, name, value) {
    if (name) {
      params[name] = value || true;
    }
    return _;
  });
  return params;
};

/**
 * ajax options. There are various properties with url being the only required property.
 * @typedef ajaxOptions
 * @property {string} [method='get'] - The HTTP method to use: 'get', 'post', 'put', 'delete', 'options',
 *    or any other standard method supported by the running environment.
 * @property {string} url - The URL to make the ajax request to. e.g. 'http://www.example.com?name=value'
 * @property {string} [type='text'] - The expected response format. Specify 'json' to have ajax parse
 *    the response as json and pass an object as the data parameter.
 * @property {object} [data] - The request body, mainly to be used in combination with 'post' or 'put'.
 *    e.g. { username: 'guest' }
 * @property {object} headers - Custom HTTP headers. Specify additional headers.
 *    e.g. { 'x-extra': 'Extra Header' }
 * @property {boolean} [async=true] - Whether the request will be asynchronous.
 *    Specify false for a blocking, synchronous request.
 * @property {boolean} [cache=true] - Whether the result may be cached.
 *    Specify false to use the internal cache buster which appends the URL with the query parameter _
 *    set to the current time in milliseconds.
 */

/**
 * ajax allows you to make various http or https requests.
 * See {@link ajaxOptions}
 * @global
 * @param {ajaxOptions} opt - Options specifying the type of ajax request to make.
 * @param {function} success - The success handler that is called when a HTTP 200 response is given.
 * @param {function} failure - The failure handler when the HTTP request fails or is not 200.
 */
var ajax = function(opt, success, failure) {
  if (typeof opt === 'string') {
    opt = { url: opt };
  }
  var method = opt.method || 'GET';
  var url = opt.url;
  //console.log(method + ' ' + url);

  var onHandler = ajax.onHandler;
  if (onHandler) {
    if (success) { success = onHandler('success', success); }
    if (failure) { failure = onHandler('failure', failure); }
  }

  if (opt.cache === false) {
    var appendSymbol = url.indexOf('?') === -1 ? '?' : '&';
    url += appendSymbol + '_=' + new Date().getTime();
  }

  var req = new XMLHttpRequest();
  req.open(method.toUpperCase(), url, opt.async !== false);

  var headers = opt.headers;
  if (headers) {
    for (var name in headers) {
      req.setRequestHeader(name, headers[name]);
    }
  }

  var data = null;
  if (opt.data) {
    if (opt.type === 'json') {
      req.setRequestHeader('Content-Type', 'application/json');
      data = JSON.stringify(opt.data);
    } else {
      data = formify(opt.data);
    }
  }

  req.onreadystatechange = function(e) {
    if (req.readyState == 4) {
      var body = req.responseText;
      var failed = req.status != 200;
      if (opt.type == 'json') {
        try {
          body = JSON.parse(body);
        }
        catch (err) {
          failed = true;
        }
      }
      var callback = !failed ? success : failure;
      if (callback) {
        callback(body, req.status, req);
      }
    }
  };

  req.send(data);
};

ajax.formify = formify;
ajax.deformify = deformify;

if (typeof module !== 'undefined') {
  module.exports = ajax;
} else {
  window.ajax = ajax;
}

return ajax;

})();

},{}],3:[function(require,module,exports){

var Emitter = function() {
  this._events = {};
};

Emitter.prototype.wrapHandler = function(handler) {
  return handler;
};

Emitter.prototype._on = function(type, subtype, handler) {
  var typeMap = this._events || ( this._events = {} );
  var subtypeMap = typeMap[type] || ( typeMap[type] = {} );
  (subtypeMap[subtype] || ( subtypeMap[subtype] = [] )).push({
    id: handler,
    handler: this.wrapHandler(handler),
  });
};

Emitter.prototype._off = function(type, subtype, handler) {
  if (!type) {
    this._events = {};
    return;
  }
  var typeMap = this._events;
  if (!handler && subtype === 'all') {
    delete typeMap[type];
    return;
  }
  var subtypeMap = typeMap[type];
  if (!subtypeMap) { return; }
  if (!handler) {
    delete subtypeMap[subtype];
    return;
  }
  var handlers = subtypeMap[subtype];
  if (!handlers) { return; }
  var index = -1;
  for (var i = 0, ii = handlers.length; i < ii; ++i) {
    if (handlers[i].id === handler) {
      index = i;
      break;
    }
  }
  if (index === -1) { return; }
  handlers.splice(index, 1);
};

Emitter.prototype.on = function(type, subtype, handler) {
  if (!handler) {
    handler = subtype;
    subtype = 'all';
  }
  this._on(type, subtype, handler);
  if (Emitter.onAddHandler) {
    Emitter.onAddHandler(type, subtype, handler);
  }
  if (this.onAddHandler) {
    this.onAddHandler(type, subtype, handler);
  }
};

Emitter.prototype.off = function(type, subtype, handler) {
  if (!handler) {
    handler = subtype;
    subtype = 'all';
  }
  this._off(type, subtype, handler);
  if (Emitter.onRemoveHandler) {
    Emitter.onRemoveHandler(type, subtype, handler);
  }
  if (this.onRemoveHandler) {
    this.onRemoveHandler(type, subtype, handler);
  }
};

Emitter.prototype.listeners = function(type, subtype) {
  if (!subtype) {
    subtype = 'all';
  }
  var typeMap = this._events;
  if (!typeMap) { return; }
  var subtypeMap = typeMap[type];
  if (!subtypeMap) { return; }
  return subtypeMap[subtype];
};

Emitter.prototype.listenerCount = function(type, subtype) {
  var listeners = this.listeners(type, subtype);
  return listeners ? listeners.length : 0;
};

Emitter.prototype.forEachListener = function(type, subtype, callback) {
  var typeMap = this._events;
  if (!typeMap) { return; }
  var subtypeMap;
  if (typeof callback === 'function') {
    var handlers = this.listeners(type, subtype);
    if (!handlers) { return; }
    for (var i = 0, ii = handlers.length; i < ii; ++i) {
      callback.call(this, type, subtype, handlers[i]);
    }
  } else if (typeof subtype === 'function') {
    callback = subtype;
    subtypeMap = typeMap[type];
    if (!subtypeMap) { return; }
    for (subtype in subtypeMap) {
      this.forEachListener(type, subtype, callback);
    }
  } else if (typeof type === 'function') {
    callback = type;
    for (type in typeMap) {
      this.forEachListener(type, callback);
    }
  }
};

var emitToHandlers = function(type, handlers, e) {
  if (!handlers) { return; }
  for (var i = 0, ii = handlers.length; i < ii; ++i) {
    var handler = handlers[i].handler;
    if (handler.call(this, e, type, i) === false) {
      return false;
    }
  }
  return true;
};

Emitter.prototype.emit = function(type, subtype, e) {
  if (!e) {
    e = subtype;
    subtype = null;
  }
  e.type = type;
  if (subtype) {
    e.subtype = subtype;
  }
  var typeMap = this._events;
  if (!typeMap) { return; }
  var subtypeMap = typeMap[type];
  if (!subtypeMap) { return; }
  var hadSubtype = emitToHandlers.call(this, type, subtypeMap[subtype], e);
  if (hadSubtype === false) {
    return false;
  }
  var hadAll = emitToHandlers.call(this, type, subtypeMap.all, e);
  if (hadAll === false) {
    return false;
  }
  if (hadSubtype || hadAll) {
    return true;
  }
};

module.exports = Emitter;

},{}],4:[function(require,module,exports){
/* global PNG */

var image = {};

var getPos = function(width, x, y) {
  return y * width * 4 + x * 4;
};

var getPixelGrey = function(pixels, pos) {
  return ((pixels[pos] + pixels[pos + 1] + pixels[pos + 2]) / 3) & 0xFF;
};

image.greyscale = function(pixels, width, height) {
  for (var y = 0, yy = height; y < yy; ++y) {
    for (var x = 0, xx = width; x < xx; ++x) {
      var pos = getPos(width, x, y);
      var newColor = getPixelGrey(pixels, pos);
      for (var i = 0; i < 3; ++i) {
        pixels[pos + i] = newColor;
      }
    }
  }
};

image.dithers = {};

image.dithers['floyd-steinberg'] = [
  [ 1, 0, 7/16],
  [-1, 1, 3/16],
  [ 0, 1, 5/16],
  [ 1, 1, 1/16]];

image.dithers['jarvis-judice-ninke'] = [
  [ 1, 0, 7/48],
  [ 2, 0, 5/48],
  [-2, 1, 3/48],
  [-1, 1, 5/48],
  [ 0, 1, 7/48],
  [ 1, 1, 5/48],
  [ 2, 1, 3/48],
  [-2, 2, 1/48],
  [-1, 2, 3/48],
  [ 0, 2, 5/48],
  [ 1, 2, 3/48],
  [ 2, 2, 1/48]];

image.dithers.sierra = [
  [ 1, 0, 5/32],
  [ 2, 0, 3/32],
  [-2, 1, 2/32],
  [-1, 1, 4/32],
  [ 0, 1, 5/32],
  [ 1, 1, 4/32],
  [ 2, 1, 2/32],
  [-1, 2, 2/32],
  [ 0, 2, 3/32],
  [ 1, 2, 2/32]];

image.dithers['default'] = image.dithers.sierra;

image.dither = function(pixels, width, height, dithers) {
  dithers = dithers || image.dithers['default'];
  var numdithers = dithers.length;
  for (var y = 0, yy = height; y < yy; ++y) {
    for (var x = 0, xx = width; x < xx; ++x) {
      var pos = getPos(width, x, y);
      var oldColor = pixels[pos];
      var newColor = oldColor >= 128 ? 255 : 0;
      var error = oldColor - newColor;
      pixels[pos] = newColor;
      for (var i = 0; i < numdithers; ++i) {
        var dither = dithers[i];
        var x2 = x + dither[0], y2 = y + dither[1];
        if (x2 >= 0 && x2 < width && y < height) {
          pixels[getPos(width, x2, y2)] += parseInt(error * dither[2]);
        }
      }
      for (var j = 1; j < 3; ++j) {
        pixels[pos + j] = newColor;
      }
    }
  }
};

image.resizeNearest = function(pixels, width, height, newWidth, newHeight) {
  var newPixels = new Array(newWidth * newHeight * 4);
  var widthRatio = width / newWidth;
  var heightRatio = height / newHeight;
  for (var y = 0, yy = newHeight; y < yy; ++y) {
    for (var x = 0, xx = newWidth; x < xx; ++x) {
      var x2 = parseInt(x * widthRatio);
      var y2 = parseInt(y * heightRatio);
      var pos2 = getPos(width, x2, y2);
      var pos = getPos(newWidth, x, y);
      for (var i = 0; i < 4; ++i) {
        newPixels[pos + i] = pixels[pos2 + i];
      }
    }
  }
  return newPixels;
};

image.resizeSample = function(pixels, width, height, newWidth, newHeight) {
  var newPixels = new Array(newWidth * newHeight * 4);
  var widthRatio = width / newWidth;
  var heightRatio = height / newHeight;
  for (var y = 0, yy = newHeight; y < yy; ++y) {
    for (var x = 0, xx = newWidth; x < xx; ++x) {
      var x2 = Math.min(parseInt(x * widthRatio), width - 1);
      var y2 = Math.min(parseInt(y * heightRatio), height - 1);
      var pos = getPos(newWidth, x, y);
      for (var i = 0; i < 4; ++i) {
        newPixels[pos + i] = ((pixels[getPos(width, x2  , y2  ) + i] +
                               pixels[getPos(width, x2+1, y2  ) + i] +
                               pixels[getPos(width, x2  , y2+1) + i] +
                               pixels[getPos(width, x2+1, y2+1) + i]) / 4) & 0xFF;
      }
    }
  }
  return newPixels;
};

image.resize = function(pixels, width, height, newWidth, newHeight) {
  if (newWidth < width || newHeight < height) {
    return image.resizeSample.apply(this, arguments);
  } else {
    return image.resizeNearest.apply(this, arguments);
  }
};

image.toGbitmap = function(pixels, width, height) {
  var rowBytes = width * 4;

  var gpixels = [];
  var growBytes = Math.ceil(width / 32) * 4;
  for (var i = 0, ii = height * growBytes; i < ii; ++i) {
    gpixels[i] = 0;
  }

  for (var y = 0, yy = height; y < yy; ++y) {
    for (var x = 0, xx = width; x < xx; ++x) {
      var grey = 0;
      var pos = y * rowBytes + parseInt(x * 4);
      for (var j = 0; j < 3; ++j) {
        grey += pixels[pos + j];
      }
      grey /= 3 * 255;
      if (grey >= 0.5) {
        var gbytePos = y * growBytes + parseInt(x / 8);
        gpixels[gbytePos] += 1 << (x % 8);
      }
    }
  }

  var gbitmap = {
    width: width,
    height: height,
    pixels: gpixels,
  };

  return gbitmap;
};

image.load = function(img, callback) {
  PNG.load(img.url, function(png) {
    var pixels = png.decode();
    var width = png.width;
    var height = png.height;
    image.greyscale(pixels, width, height);
    if (img.width) {
      if (!img.height) {
        img.height = parseInt(height * (img.width / width));
      }
    } else if (img.height) {
      if (!img.width) {
        img.width = parseInt(width * (img.height / height));
      }
    } else {
      img.width = width;
      img.height = height;
    }
    if (img.width !== width || img.height !== height) {
      pixels = image.resize(pixels, width, height, img.width, img.height);
      width = img.width;
      height = img.height;
    }
    if (img.dither) {
      var dithers = image.dithers[img.dither];
      image.dither(pixels, width, height, dithers);
    }
    img.gbitmap = image.toGbitmap(pixels, width, height);
    if (callback) {
      callback(img);
    }
  });
  return img;
};

module.exports = image;

},{}],5:[function(require,module,exports){
var util2 = require('./util2');

var myutil = {};

myutil.shadow = function(a, b) {
  for (var k in a) {
    if (typeof b[k] === 'undefined') {
      b[k] = a[k];
    }
  }
  return b;
};

myutil.defun = function(fn, fargs, fbody) {
  if (!fbody) {
    fbody = fargs;
    fargs = [];
  }
  return new Function('return function ' + fn + '(' + fargs.join(', ') + ') {' + fbody + '}')();
};

myutil.slog = function() {
  var args = [];
  for (var i = 0, ii = arguments.length; i < ii; ++i) {
    args[i] = util2.toString(arguments[i]);
  }
  return args.join(' ');
};

myutil.toObject = function(key, value) {
  if (typeof key === 'object') {
    return key;
  }
  var obj = {};
  obj[key] = value;
  return obj;
};

myutil.flag = function(flags) {
  if (typeof flags === 'boolean') {
    return flags;
  }
  for (var i = 1, ii = arguments.length; i < ii; ++i) {
    if (flags[arguments[i]]) {
      return true;
    }
  }
  return false;
};

myutil.toFlags = function(flags) {
  if (typeof flags === 'string') {
    flags = myutil.toObject(flags, true);
  } else {
    flags = !!flags;
  }
  return flags;
};

/**
 * Returns an absolute path based on a root path and a relative path.
 */
myutil.abspath = function(root, path) {
  if (!path) {
    path = root;
  }
  if (path.match(/^\/\//)) {
    var m = root && root.match(/^(\w+:)\/\//);
    path = (m ? m[1] : 'http:') + path;
  }
  if (root && !path.match(/^\w+:\/\//)) {
    path = root + path;
  }
  return path;
};

/**
 *  Converts a name to a C constant name format of UPPER_CASE_UNDERSCORE.
 */
myutil.toCConstantName = function(x) {
  x = x.toUpperCase();
  x = x.replace(/[- ]/g, '_');
  return x;
};

module.exports = myutil;

},{"./util2":7}],6:[function(require,module,exports){
/* safe.js - Building a safer world for Pebble.JS Developers
 *
 * This library provides wrapper around all the asynchronous handlers that developers
 * have access to so that error messages are caught and displayed nicely in the pebble tool
 * console.
 */

/* global __loader */

var ajax = require('./ajax');

var safe = {};

/* The name of the concatenated file to translate */
safe.translateName = 'pebble-js-app.js';

safe.indent = '    ';

/* Translates a source line position to the originating file */
safe.translatePos = function(name, lineno, colno) {
  if (name === safe.translateName) {
    var pkg = __loader.getPackageByLineno(lineno);
    if (pkg) {
      name = pkg.filename;
      lineno -= pkg.lineno;
    }
  }
  return name + ':' + lineno + ':' + colno;
};


/* Translates an iOS stack tace line to node style */
safe.translateLineIOS = function(line, scope, name, lineno, colno) {
  var pos = safe.translatePos(name, lineno, colno);
  return safe.indent + 'at ' + (scope ? scope  + ' (' + pos + ')' : pos);
};

/* Matches (<scope> '@' )? <name> ':' <lineno> ':' <colno> */
var stackLineRegExp = /(?:([^\s@]+)@)?([^\s@:]+):(\d+):(\d+)/;

safe.translateStackIOS = function(stack) {
  var lines = stack.split('\n');
  for (var i = lines.length - 1; i >= 0; --i) {
    var line = lines[i];
    var m = line.match(stackLineRegExp);
    if (m) {
      line = lines[i] = safe.translateLineIOS.apply(this, m);
    }
    if (line.match(module.filename)) {
      lines.splice(--i, 2);
    }
  }
  return lines.join('\n');
};

safe.translateStackAndroid = function(stack) {
  var lines = stack.split('\n');
  for (var i = lines.length - 1; i > 0; --i) {
    var line = lines[i];
    var name, lineno, colno;
    if (line.match(/jskit_startup\.html/)) {
      lines.splice(i, 1);
    } else {
      var m = line.match(/^.*\/(.*?):(\d+):(\d+)/);
      if (m) {
        name = m[1];
        lineno = m[2];
        colno = m[3];
      }
    }
    if (name) {
      var pos = safe.translatePos(name, lineno, colno);
      console.log(pos, name, lineno, colno);
      if (line.match(/\(.*\)/)) {
        line = line.replace(/\(.*\)/, '(' + pos + ')');
      } else {
        line = line.replace(/[^\s\/]*\/.*$/, pos);
      }
      lines[i] = line;
    }
  }
  return lines.join('\n');
};

/* Translates a stack trace to the originating files */
safe.translateStack = function(stack) {
  if (stack.match('com.getpebble.android')) {
    return safe.translateStackAndroid(stack);
  } else {
    return safe.translateStackIOS(stack);
  }
};

safe.translateError = function(err) {
  var name = err.name;
  var message = err.message;
  var stack = err.stack;
  var result = ['JavaScript Error:'];
  if (message && (!stack || !stack.match(message))) {
    if (name && !message.match(message)) {
      message = name + ': ' + message;
    }
    result.push(message);
  }
  if (stack) {
    result.push(safe.translateStack(stack));
  }
  return result.join('\n');
};

/* We use this function to dump error messages to the console. */
safe.dumpError = function(err) {
  if (typeof err === 'object') {
      console.log(safe.translateError(err));
  } else {
    console.log('dumpError :: argument is not an object');
  }
};

/* Takes a function and return a new function with a call to it wrapped in a try/catch statement */
safe.protect = function(fn) {
  return function() {
    try {
      return fn.apply(this, arguments);
    }
    catch (err) {
      safe.dumpError(err);
    }
  };
};

/* Wrap event handlers added by Pebble.addEventListener */
var pblAddEventListener = Pebble.addEventListener;
Pebble.addEventListener = function(eventName, eventCallback) {
  pblAddEventListener.call(this, eventName, safe.protect(eventCallback));
};

var pblSendMessage = Pebble.sendAppMessage;
Pebble.sendAppMessage = function(message, success, failure) {
  return pblSendMessage.call(this, message, safe.protect(success), safe.protect(failure));
};

/* Wrap setTimeout and setInterval */
var originalSetTimeout = setTimeout;
window.setTimeout = function(callback, delay) {
  return originalSetTimeout(safe.protect(callback), delay);
};
var originalSetInterval = setInterval;
window.setInterval = function(callback, delay) {
  return originalSetInterval(safe.protect(callback), delay);
};

/* Wrap the success and failure callback of the ajax library */
ajax.onHandler = function(eventName, callback) {
  return safe.protect(callback);
};

/* Wrap the geolocation API Callbacks */
var watchPosition = navigator.geolocation.watchPosition;
navigator.geolocation.watchPosition = function(success, error, options) {
  return watchPosition.call(this, safe.protect(success), safe.protect(error), options);
};
var getCurrentPosition = navigator.geolocation.getCurrentPosition;
navigator.geolocation.getCurrentPosition = function(success, error, options) {
  return getCurrentPosition.call(this, safe.protect(success), safe.protect(error), options);
};

module.exports = safe;

},{"./ajax":2}],7:[function(require,module,exports){
/*
 * util2.js by Meiguro - MIT License
 */

var util2 = (function(){

var util2 = {};

util2.noop = function() {};

util2.count = function(o) {
  var i = 0;
  for (var k in o) { ++i; }
  return i;
};

util2.copy = function(a, b) {
  b = b || (a instanceof Array ? [] : {});
  for (var k in a) { b[k] = a[k]; }
  return b;
};

util2.toInteger = function(x) {
  if (!isNaN(x = parseInt(x))) { return x; }
};

util2.toNumber = function(x) {
  if (!isNaN(x = parseFloat(x))) { return x; }
};

util2.toString = function(x) {
  return typeof x === 'object' ? JSON.stringify.apply(this, arguments) : '' + x;
};

util2.toArray = function(x) {
  if (x instanceof Array) { return x; }
  if (x[0]) { return util2.copy(x, []); }
  return [x];
};

util2.trim = function(s) {
  return s ? s.toString().trim() : s;
};

util2.last = function(a) {
  return a[a.length-1];
};

util2.inherit = function(child, parent, proto) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
  if (proto) {
    util2.copy(proto, child.prototype);
  }
  return child.prototype;
};

var chunkSize = 128;

var randomBytes = function(chunkSize) {
  var z = [];
  for (var i = 0; i < chunkSize; ++i) {
    z[i] = String.fromCharCode(Math.random() * 256);
  }
  return z.join('');
};

util2.randomString = function(regex, size, acc) {
  if (!size) {
    return '';
  }
  if (typeof regex === 'string') {
    regex = new RegExp('(?!'+regex+')[\\s\\S]', 'g');
  }
  acc = acc || '';
  var buf = randomBytes(chunkSize);
  if (buf) {
    acc += buf.replace(regex, '');
  }
  if (acc.length >= size) {
    return acc.substr(0, size);
  } else {
    return util2.randomString(regex, size, acc);
  }
};

var varpat = new RegExp("^([\\s\\S]*?)\\$([_a-zA-Z0-9]+)", "m");

util2.format = function(text, table) {
  var m, z = '';
  while ((m = text.match(varpat))) {
    var subtext = m[0], value = table[m[2]];
    if (typeof value === 'function') { value = value(); }
    z += value !== undefined ? m[1] + value.toString() : subtext;
    text = text.substring(subtext.length);
  }
  z += text;
  return z;
};

if (typeof module !== 'undefined') {
  module.exports = util2;
}

return util2;

})();

},{}],8:[function(require,module,exports){
/**
 * Vector2 from three.js
 * https://github.com/mrdoob/three.js
 *
 * @author mr.doob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

/**
 * Create a new vector with given dimensions.
 * @param x
 * @param y
 */
var Vector2 = function ( x, y ) {

  this.x = x || 0;
  this.y = y || 0;

};

Vector2.prototype = {

  constructor: Vector2,

  set: function ( x, y ) {

    this.x = x;
    this.y = y;

    return this;

  },

  copy: function ( v ) {

    this.x = v.x;
    this.y = v.y;

    return this;

  },

  clone: function () {

    return new Vector2( this.x, this.y );

  },

  add: function ( v1, v2 ) {

    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;

    return this;

  },

  addSelf: function ( v ) {

    this.x += v.x;
    this.y += v.y;

    return this;

  },

  sub: function ( v1, v2 ) {

    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;

    return this;

  },

  subSelf: function ( v ) {

    this.x -= v.x;
    this.y -= v.y;

    return this;

  },

  multiplyScalar: function ( s ) {

    this.x *= s;
    this.y *= s;

    return this;

  },

  divideScalar: function ( s ) {

    if ( s ) {

      this.x /= s;
      this.y /= s;

    } else {

      this.set( 0, 0 );

    }

    return this;

  },


  negate: function() {

    return this.multiplyScalar( -1 );

  },

  dot: function ( v ) {

    return this.x * v.x + this.y * v.y;

  },

  lengthSq: function () {

    return this.x * this.x + this.y * this.y;

  },

  length: function () {

    return Math.sqrt( this.lengthSq() );

  },

  normalize: function () {

    return this.divideScalar( this.length() );

  },

  distanceTo: function ( v ) {

    return Math.sqrt( this.distanceToSquared( v ) );

  },

  distanceToSquared: function ( v ) {

    var dx = this.x - v.x, dy = this.y - v.y;
    return dx * dx + dy * dy;

  },


  setLength: function ( l ) {

    return this.normalize().multiplyScalar( l );

  },

  equals: function( v ) {

    return ( ( v.x === this.x ) && ( v.y === this.y ) );

  }

};

if (typeof module !== 'undefined') {
  module.exports = Vector2;
}

},{}],9:[function(require,module,exports){
/*
 * This is the main PebbleJS file. You do not need to modify this file unless
 * you want to change the way PebbleJS starts, the script it runs or the libraries
 * it loads.
 *
 * By default, this will run app.js
 */

require('./lib/safe.js');

Pebble.addEventListener('ready', function(e) {
  // Initialize the Pebble protocol
  require('./ui/simply-pebble.js').init();
  // Load local file
  require('./app.js');
});

},{"./app.js":1,"./lib/safe.js":6,"./ui/simply-pebble.js":23}],10:[function(require,module,exports){
var UI = require('./ui/index.js');

module.exports = UI;
},{"./ui/index.js":17}],11:[function(require,module,exports){
var Emitter = require('../lib/emitter');

var Accel = new Emitter();

module.exports = Accel;

var WindowStack = require('./windowstack');
var Window = require('./window');
var simply = require('./simply');

var state;

Accel.init = function() {
  if (state) {
    Accel.off();
  }

  state = Accel.state = {
    rate: 100,
    samples: 25,
    subscribe: false,
    subscribeMode: 'auto',
    listeners: [],
  };
};

Accel.onAddHandler = function(type, subtype) {
  if (type === 'data') {
    Accel.autoSubscribe();
  }
};

Accel.onRemoveHandler = function(type, subtype) {
  if (!type || type === 'accelData') {
    Accel.autoSubscribe();
  }
};

var accelDataListenerCount = function() {
  var count = Accel.listenerCount('data');
  var wind = WindowStack.top();
  if (wind) {
    count += wind.listenerCount('accelData');
  }
  return count;
};

Accel.autoSubscribe = function() {
  if (state.subscribeMode !== 'auto') { return; }
  var subscribe = (accelDataListenerCount() > 0);
  if (subscribe !== state.subscribe) {
    return Accel.config(subscribe, true);
  }
};

/**
 * The accelerometer configuration parameter for {@link simply.accelConfig}.
 * The accelerometer data stream is useful for applications such as gesture recognition when accelTap is too limited.
 * However, keep in mind that smaller batch sample sizes and faster rates will drastically impact the battery life of both the Pebble and phone because of the taxing use of the processors and Bluetooth modules.
 * @typedef {object} simply.accelConf
 * @property {number} [rate] - The rate accelerometer data points are generated in hertz. Valid values are 10, 25, 50, and 100. Initializes as 100.
 * @property {number} [samples] - The number of accelerometer data points to accumulate in a batch before calling the event handler. Valid values are 1 to 25 inclusive. Initializes as 25.
 * @property {boolean} [subscribe] - Whether to subscribe to accelerometer data events. {@link simply.accelPeek} cannot be used when subscribed. Simply.js will automatically (un)subscribe for you depending on the amount of accelData handlers registered.
 */

/**
 * Changes the accelerometer configuration.
 * See {@link simply.accelConfig}
 * @memberOf simply
 * @param {simply.accelConfig} accelConf - An object defining the accelerometer configuration.
 */
Accel.config = function(opt, auto) {
  if (typeof opt === 'undefined') {
    return {
      rate: state.rate,
      samples: state.samples,
      subscribe: state.subscribe,
    };
  } else if (typeof opt === 'boolean') {
    opt = { subscribe: opt };
  }
  for (var k in opt) {
    if (k === 'subscribe') {
      state.subscribeMode = opt[k] && !auto ? 'manual' : 'auto';
    }
    state[k] = opt[k];
  }
  return simply.impl.accelConfig.apply(this, arguments);
};

/**
 * Peeks at the current accelerometer values.
 * @memberOf simply
 * @param {simply.eventHandler} callback - A callback function that will be provided the accel data point as an event.
 */
Accel.peek = function(callback) {
  if (state.subscribe) {
    throw new Error('Cannot use accelPeek when listening to accelData events');
  }
  return simply.impl.accelPeek.apply(this, arguments);
};

/**
 * Simply.js accel tap event.
 * Use the event type 'accelTap' to subscribe to these events.
 * @typedef simply.accelTapEvent
 * @property {string} axis - The axis the tap event occurred on: 'x', 'y', or 'z'. This is also the event subtype.
 * @property {number} direction - The direction of the tap along the axis: 1 or -1.
 */

Accel.emitAccelTap = function(axis, direction) {
  var e = {
    axis: axis,
    direction: direction,
  };
  if (Window.emit('accelTap', axis, e) === false) {
    return false;
  }
  Accel.emit('tap', axis, e);
};

/**
 * Simply.js accel data point.
 * Typical values for gravity is around -1000 on the z axis.
 * @typedef simply.accelPoint
 * @property {number} x - The acceleration across the x-axis.
 * @property {number} y - The acceleration across the y-axis.
 * @property {number} z - The acceleration across the z-axis.
 * @property {boolean} vibe - Whether the watch was vibrating when measuring this point.
 * @property {number} time - The amount of ticks in millisecond resolution when measuring this point.
 */

/**
 * Simply.js accel data event.
 * Use the event type 'accelData' to subscribe to these events.
 * @typedef simply.accelDataEvent
 * @property {number} samples - The number of accelerometer samples in this event.
 * @property {simply.accelPoint} accel - The first accel in the batch. This is provided for convenience.
 * @property {simply.accelPoint[]} accels - The accelerometer samples in an array.
 */

Accel.emitAccelData = function(accels, callback) {
  var e = {
    samples: accels.length,
    accel: accels[0],
    accels: accels,
  };
  if (callback) {
    return callback(e);
  }
  if (Window.emit('accelData', null, e) === false) {
    return false;
  }
  Accel.emit('data', e);
};

},{"../lib/emitter":3,"./simply":24,"./window":29,"./windowstack":30}],12:[function(require,module,exports){
var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var Emitter = require('../lib/emitter');
var WindowStack = require('./windowstack');
var Propable = require('./propable');
var Window = require('./window');
var simply = require('./simply');

/**
 * Sets the title field. The title field is the first and largest text field available.
 * @memberOf simply
 * @param {string} text - The desired text to display.
 * @param {boolean} [clear] - If true, all other text fields will be cleared.
 */

/**
 * Sets the subtitle field. The subtitle field is the second large text field available.
 * @memberOf simply
 * @param {string} text - The desired text to display.
 * @param {boolean} [clear] - If true, all other text fields will be cleared.
 */

/**
 * Sets the body field. The body field is the last text field available meant to display large bodies of text.
 * This can be used to display entire text interfaces.
 * You may even clear the title and subtitle fields in order to display more in the body field.
 * @memberOf simply
 * @param {string} text - The desired text to display.
 * @param {boolean} [clear] - If true, all other text fields will be cleared.
 */

var textProps = [
  'title',
  'subtitle',
  'body',
];

var imageProps = [
  'icon',
  'subicon',
  'image',
];

var actionProps = [
  'up',
  'select',
  'back',
];

/**
 * Set the Pebble UI style.
 * The available styles are 'small', 'large', and 'mono'. Small and large correspond to the system notification styles.
 * Mono sets a monospace font for the body textfield, enabling more complex text UIs or ASCII art.
 * @memberOf simply
 * @param {string} type - The type of style to set: 'small', 'large', or 'mono'.
 */

var configProps = [
  'style',
];

var accessorProps = textProps.concat(imageProps).concat(configProps);
var clearableProps = textProps.concat(imageProps);

var Card = function(cardDef) {
  Window.call(this, cardDef);
  this._dynamic = false;
};

Card._codeName = 'card';

util2.inherit(Card, Window);

util2.copy(Emitter.prototype, Card.prototype);

Propable.makeAccessors(accessorProps, Card.prototype);

Card.prototype._prop = function() {
  if (this === WindowStack.top()) {
    simply.impl.card.apply(this, arguments);
  }
};

Card.prototype._clear = function(flags) {
  flags = myutil.toFlags(flags);
  if (myutil.flag(flags, 'all')) {
    clearableProps.forEach(myutil.unset.bind(this));
  } else if (myutil.flag(flags, 'action')) {
    this._clearAction();
  }
};

module.exports = Card;

},{"../lib/emitter":3,"../lib/myutil":5,"../lib/util2":7,"./propable":20,"./simply":24,"./window":29,"./windowstack":30}],13:[function(require,module,exports){
var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var StageElement = require('./element');

var defaults = {
  backgroundColor: 'white',
  borderColor: 'clear',
};

var Circle = function(elementDef) {
  StageElement.call(this, elementDef);
  myutil.shadow(defaults, this.state);
  this.state.type = 2;
};

util2.inherit(Circle, StageElement);

module.exports = Circle;

},{"../lib/myutil":5,"../lib/util2":7,"./element":14}],14:[function(require,module,exports){
var util2 = require('../lib/util2');
var Vector2 = require('../lib/vector2');
var myutil = require('../lib/myutil');
var WindowStack = require('./windowstack');
var Propable = require('./propable');
var simply = require('./simply');

var elementProps = [
  'position',
  'size',
  'borderColor',
  'backgroundColor',
];

var accessorProps = elementProps;

var nextId = 1;

var StageElement = function(elementDef) {
  this.state = elementDef || {};
  this.state.id = nextId++;
  this._queue = [];
};

util2.copy(Propable.prototype, StageElement.prototype);

Propable.makeAccessors(accessorProps, StageElement.prototype);

StageElement.prototype._reset = function() {
  this._queue = [];
};

StageElement.prototype._id = function() {
  return this.state.id;
};

StageElement.prototype._type = function() {
  return this.state.type;
};

StageElement.prototype._prop = function(elementDef) {
  if (!this.state.position) {
    this.state.position = new Vector2();
  }
  if (!this.state.size) {
    this.state.size = new Vector2();
  }
  if (this.parent === WindowStack.top()) {
    simply.impl.stageElement(this._id(), this._type(), elementDef);
  }
};

StageElement.prototype.index = function() {
  if (!this.parent) { return -1; }
  return this.parent.index(this);
};

StageElement.prototype.remove = function(broadcast) {
  if (!this.parent) { return this; }
  this.parent.remove(this, broadcast);
  return this;
};

StageElement.prototype._animate = function(animateDef, duration) {
  if (this.parent === WindowStack.top()) {
    simply.impl.stageAnimate(this._id(), animateDef, duration || 400, animateDef.easing || 'easeInOut');
  }
};

StageElement.prototype.animate = function(field, value, duration) {
  if (typeof field === 'object') {
    duration = value;
  }
  var animateDef = myutil.toObject(field, value);
  util2.copy(animateDef, this.state);
  function animate() {
    this._animate(animateDef, duration);
  }
  if (this._queue.length === 0) {
    animate.call(this);
  } else {
    this.queue(animate);
  }
  return this;
};

StageElement.prototype.queue = function(callback) {
  this._queue.push(callback);
};

StageElement.prototype.dequeue = function() {
  var callback = this._queue.shift();
  if (!callback) { return; }
  callback.call(this, this.dequeue.bind(this));
};

StageElement.emitAnimateDone = function(index) {
  if (index === -1) { return; }
  var wind = WindowStack.top();
  if (!wind || !wind._dynamic) { return; }
  var element = wind.at(index);
  if (!element) { return; }
  element.dequeue();
};

module.exports = StageElement;

},{"../lib/myutil":5,"../lib/util2":7,"../lib/vector2":8,"./propable":20,"./simply":24,"./windowstack":30}],15:[function(require,module,exports){
var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var Propable = require('./propable');
var StageElement = require('./element');

var imageProps = [
  'image',
  'compositing',
];

var defaults = {
  backgroundColor: 'clear',
  borderColor: 'clear',
};

var ImageElement = function(elementDef) {
  StageElement.call(this, elementDef);
  myutil.shadow(defaults, this.state);
  this.state.type = 4;
};

util2.inherit(ImageElement, StageElement);

Propable.makeAccessors(imageProps, ImageElement.prototype);

module.exports = ImageElement;

},{"../lib/myutil":5,"../lib/util2":7,"./element":14,"./propable":20}],16:[function(require,module,exports){
var imagelib = require('../lib/image');
var myutil = require('../lib/myutil');
var Resource = require('./resource');
var simply = require('./simply');

var ImageService = module.exports;

var state;

ImageService.init = function() {
  state = Image.state = {
    cache: {},
    nextId: Resource.items.length + 1,
    rootURL: null
  };
};

var makeImageHash = function(image) {
  var url = image.url;
  var hashPart = '';
  if (image.width) {
    hashPart += ',width:' + image.width;
  }
  if (image.height) {
    hashPart += ',height:' + image.height;
  }
  if (image.dither) {
    hashPart += ',dither:' + image.dither;
  }
  if (hashPart) {
    url += '#' + hashPart.substr(1);
  }
  return url;
};

var parseImageHash = function(hash) {
  var image = {};
  hash = hash.split('#');
  image.url = hash[0];
  hash = hash[1];
  if (!hash) { return image; }
  var args = hash.split(',');
  for (var i = 0, ii = args.length; i < ii; ++i) {
    var arg = args[i];
    if (arg.match(':')) {
      arg = arg.split(':');
      var v = arg[1];
      image[arg[0]] = !isNaN(Number(v)) ? Number(v) : v;
    } else {
      image[arg] = true;
    }
  }
  return image;
};

ImageService.load = function(opt, reset, callback) {
  if (typeof opt === 'string') {
    opt = parseImageHash(opt);
  }
  if (typeof reset === 'function') {
    callback = reset;
    reset = null;
  }
  var url = myutil.abspath(state.rootURL, opt.url);
  var hash = makeImageHash(opt);
  var image = state.cache[hash];
  if (image) {
    if ((opt.width && image.width !== opt.width) ||
        (opt.height && image.height !== opt.height) ||
        (opt.dither && image.dither !== opt.dither)) {
      reset = true;
    }
    if (reset !== true) {
      return image.id;
    }
  }
  image = {
    id: state.nextId++,
    url: url,
    width: opt.width,
    height: opt.height,
    dither: opt.dither,
  };
  state.cache[hash] = image;
  imagelib.load(image, function() {
    simply.impl.image(image.id, image.gbitmap);
    if (callback) {
      var e = {
        type: 'image',
        image: image.id,
        url: image.url,
      };
      callback(e);
    }
  });
  return image.id;
};

ImageService.setRootURL = function(url) {
  state.rootURL = url;
};

/**
 * Resolve an image path to an id. If the image is defined in appinfo, the index of the resource is used,
 * otherwise a new id is generated for dynamic loading.
 */
ImageService.resolve = function(opt) {
  var id = Resource.getId(opt);
  return typeof id !== 'undefined' ? id : ImageService.load(opt);
};

},{"../lib/image":4,"../lib/myutil":5,"./resource":22,"./simply":24}],17:[function(require,module,exports){
var UI = {};

UI.Vector2 = require('../lib/vector2');
UI.Window = require('./window');
UI.Card = require('./card');
UI.Menu = require('./menu');
UI.Rect = require('./rect');
UI.Circle = require('./circle');
UI.Text = require('./text');
UI.TimeText = require('./timetext');
UI.Image = require('./image');
UI.Inverter = require('./inverter');
UI.Vibe = require('./vibe');

module.exports = UI;

},{"../lib/vector2":8,"./card":12,"./circle":13,"./image":15,"./inverter":18,"./menu":19,"./rect":21,"./text":26,"./timetext":27,"./vibe":28,"./window":29}],18:[function(require,module,exports){
var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var StageElement = require('./element');

var Inverter = function(elementDef) {
  StageElement.call(this, elementDef);
  this.state.type = 5;
};

util2.inherit(Inverter, StageElement);

module.exports = Inverter;

},{"../lib/myutil":5,"../lib/util2":7,"./element":14}],19:[function(require,module,exports){
var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var Emitter = require('../lib/emitter');
var WindowStack = require('./windowstack');
var Window = require('./window');
var simply = require('./simply');

var Menu = function(menuDef) {
  Window.call(this, menuDef);
  this._dynamic = false;
  this._sections = {};
};

Menu._codeName = 'menu';

util2.inherit(Menu, Window);

util2.copy(Emitter.prototype, Menu.prototype);

Menu.prototype._show = function() {
  this._resolveMenu();
  Window.prototype._show.apply(this, arguments);
};

Menu.prototype._prop = function() {
  if (this === WindowStack.top()) {
    simply.impl.menu.apply(this, arguments);
  }
};

Menu.prototype.action = function() {
  throw new Error("Menus don't support action bars.");
};

Menu.prototype._buttonInit = function() {};

Menu.prototype.buttonConfig = function() {
  throw new Error("Menus don't support changing button configurations.");
};

Menu.prototype._buttonAutoConfig = function() {};

var getMetaSection = function(sectionIndex) {
  return (this._sections[sectionIndex] || ( this._sections[sectionIndex] = {} ));
};

var getSections = function() {
  var sections = this.state.sections;
  if (sections instanceof Array) {
    return sections;
  }
  if (typeof sections === 'number') {
    sections = new Array(sections);
    return (this.state.sections = sections);
  }
  if (typeof sections === 'function') {
    this.sectionsProvider = this.state.sections;
    delete this.state.sections;
  }
  if (this.sectionsProvider) {
    sections = this.sectionsProvider.call(this);
    if (sections) {
      this.state.sections = sections;
      return getSections.call(this);
    }
  }
  return (this.state.sections = []);
};

var getSection = function(e, create) {
  var sections = getSections.call(this);
  var section = sections[e.section];
  if (section) {
    return section;
  }
  if (this.sectionProvider) {
    section = this.sectionProvider.call(this, e);
    if (section) {
      return (sections[e.section] = section);
    }
  }
  if (!create) { return; }
  return (sections[e.section] = {});
};

var getItems = function(e, create) {
  var section = getSection.call(this, e, create);
  if (!section) {
    if (e.section > 0) { return; }
    section = this.state.sections[0] = {};
  }
  if (section.items instanceof Array) {
    return section.items;
  }
  if (typeof section.items === 'number') {
    return (section.items = new Array(section.items));
  }
  if (typeof section.items === 'function') {
    this._sections[e.section] = section.items;
    delete section.items;
  }
  var itemsProvider = getMetaSection.call(this, e.section).items || this.itemsProvider;
  if (itemsProvider) {
    var items = itemsProvider.call(this, e);
    if (items) {
      section.items = items;
      return getItems.call(this, e, create);
    }
  }
  return (section.items = []);
};

var getItem = function(e, create) {
  var items = getItems.call(this, e, create);
  var item = items[e.item];
  if (item) {
    return item;
  }
  var itemProvider = getMetaSection.call(this, e.section).item || this.itemProvider;
  if (itemProvider) {
    item = itemProvider.call(this, e);
    if (item) {
      return (items[e.item] = item);
    }
  }
  if (!create) { return; }
  return (items[e.item] = {});
};

Menu.prototype._resolveMenu = function() {
  var sections = getSections.call(this);
  if (this === WindowStack.top()) {
    simply.impl.menu.call(this, this.state);
  }
};

Menu.prototype._resolveSection = function(e, clear) {
  var section = getSection.call(this, e);
  if (!section) { return; }
  section.items = getItems.call(this, e);
  if (this === WindowStack.top()) {
    simply.impl.menuSection.call(this, e.section, section, clear);
  }
};

Menu.prototype._resolveItem = function(e) {
  var item = getItem.call(this, e);
  if (!item) { return; }
  if (this === WindowStack.top()) {
    simply.impl.menuItem.call(this, e.section, e.item, item);
  }
};

Menu.prototype._emitSelect = function(e) {
  var item = getItem.call(this, e);
  if (!item) { return; }
  switch (e.type) {
    case 'select':
      if (typeof item.select === 'function') {
        if (item.select(e) === false) {
          return false;
        }
      }
      break;
    case 'longSelect':
      if (typeof item.longSelect === 'function') {
        if (item.longSelect(e) === false) {
          return false;
        }
      }
      break;
  }
};

Menu.prototype.sections = function(sections) {
  if (typeof sections === 'function') {
    delete this.state.sections;
    this.sectionsProvider = sections;
    this._resolveMenu();
    return this;
  }
  this.state.sections = sections;
  this._resolveMenu();
  return this;
};

Menu.prototype.section = function(sectionIndex, section) {
  if (typeof sectionIndex === 'object') {
    sectionIndex = sectionIndex.section || 0;
  } else if (typeof sectionIndex === 'function') {
    this.sectionProvider = sectionIndex;
    return this;
  }
  var menuIndex = { section: sectionIndex };
  if (!section) {
    return getSection.call(this, menuIndex);
  }
  var sections = getSections.call(this);
  var prevLength = sections.length;
  sections[sectionIndex] = util2.copy(section, sections[sectionIndex]);
  if (sections.length !== prevLength) {
    this._resolveMenu();
  }
  this._resolveSection(menuIndex, typeof section.items !== 'undefined');
  return this;
};

Menu.prototype.items = function(sectionIndex, items) {
  if (typeof sectionIndex === 'object') {
    sectionIndex = sectionIndex.section || 0;
  } else if (typeof sectionIndex === 'function') {
    this.itemsProvider = sectionIndex;
    return this;
  }
  if (typeof items === 'function') {
    getMetaSection.call(this, sectionIndex).items = items;
    return this;
  }
  var menuIndex = { section: sectionIndex };
  if (!items) {
    return getItems.call(this, menuIndex);
  }
  var section = getSection.call(this, menuIndex, true);
  section.items = items;
  this._resolveSection(menuIndex, true);
  return this;
};

Menu.prototype.item = function(sectionIndex, itemIndex, item) {
  if (typeof sectionIndex === 'object') {
    item = itemIndex || item;
    itemIndex = sectionIndex.item;
    sectionIndex = sectionIndex.section || 0;
  } else if (typeof sectionIndex === 'function') {
    this.itemProvider = sectionIndex;
    return this;
  }
  if (typeof itemIndex === 'function') {
    item = itemIndex;
    itemIndex = null;
  }
  if (typeof item === 'function') {
    getMetaSection.call(this, sectionIndex).item = item;
    return this;
  }
  var menuIndex = { section: sectionIndex, item: itemIndex };
  if (!item) {
    return getItem.call(this, menuIndex);
  }
  var items = getItems.call(this, menuIndex, true);
  var prevLength = items.length;
  items[itemIndex] = util2.copy(item, items[itemIndex]);
  if (items.length !== prevLength) {
    this._resolveSection(menuIndex);
  }
  this._resolveItem(menuIndex);
  return this;
};

Menu.emit = function(type, subtype, e) {
  Window.emit(type, subtype, e, Menu);
};

Menu.emitSection = function(section) {
  var menu = WindowStack.top();
  if (!(menu instanceof Menu)) { return; }
  var e = {
    section: section
  };
  if (Menu.emit('section', null, e) === false) {
    return false;
  }
  menu._resolveSection(e);
};

Menu.emitItem = function(section, item) {
  var menu = WindowStack.top();
  if (!(menu instanceof Menu)) { return; }
  var e = {
    section: section,
    item: item,
  };
  if (Menu.emit('item', null, e) === false) {
    return false;
  }
  menu._resolveItem(e);
};

Menu.emitSelect = function(type, section, item) {
  var menu = WindowStack.top();
  if (!(menu instanceof Menu)) { return; }
  var e = {
    section: section,
    item: item,
  };
  switch (type) {
    case 'menuSelect': type = 'select'; break;
    case 'menuLongSelect': type = 'longSelect'; break;
  }
  if (Menu.emit(type, null, e) === false) {
    return false;
  }
  menu._emitSelect(e);
};

module.exports = Menu;

},{"../lib/emitter":3,"../lib/myutil":5,"../lib/util2":7,"./simply":24,"./window":29,"./windowstack":30}],20:[function(require,module,exports){
var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');

var Propable = function(def) {
  this.state = def || {};
};

Propable.makeAccessor = function(k) {
  return function(value) {
    if (arguments.length === 0) {
      return this.state[k];
    }
    this.state[k] = value;
    this._prop(myutil.toObject(k, value));
    return this;
  };
};

Propable.makeAccessors = function(props, proto) {
  proto = proto || {};
  props.forEach(function(k) {
    proto[k] = Propable.makeAccessor(k);
  });
  return proto;
};

Propable.prototype.unset = function(k) {
  delete this.state[k];
};

Propable.prototype._clear = function() {
  this.state = {};
};

Propable.prototype._prop = function(def) {
};

Propable.prototype.prop = function(field, value, clear) {
  if (arguments.length === 0) {
    return util2.copy(this.state);
  }
  if (arguments.length === 1 && typeof field !== 'object') {
    return this.state[field];
  }
  if (typeof field === 'object') {
    clear = value;
  }
  if (clear) {
    this._clear('all');
  }
  var def = myutil.toObject(field, value);
  util2.copy(def, this.state);
  this._prop(def);
  return this;
};

module.exports = Propable;

},{"../lib/myutil":5,"../lib/util2":7}],21:[function(require,module,exports){
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

},{"../lib/myutil":5,"../lib/util2":7,"./element":14}],22:[function(require,module,exports){
var myutil = require('../lib/myutil');
var appinfo = {
  "uuid": "133215f0-cf20-4c05-997b-3c9be5a64e5b",
  "shortName": "Pebble.js",
  "longName": "Pebble.js",
  "companyName": "",
  "versionCode": 1,
  "versionLabel": "0.4.0",
  "capabilities": [ "configurable" ],
  "watchapp": {
    "watchface": false
  },
  "appKeys": {},
  "resources": {
    "media": [
      {
        "menuIcon": true,
        "type": "png",
        "name": "IMAGE_MENU_ICON",
        "file": "images/menu_icon.png"
      }, {
        "type": "png",
        "name": "IMAGE_LOGO_SPLASH",
        "file": "images/logo_splash.png"
      }, {
        "type": "png",
        "name": "IMAGE_TILE_SPLASH",
        "file": "images/tile_splash.png"
      }, {
        "type": "font",
        "name": "MONO_FONT_14",
        "file": "fonts/UbuntuMono-Regular.ttf"
      }, {
        "type": "png",
        "name": "ACTION_UP",
        "file": "images/up.png"
      }, {
        "type": "png",
        "name": "ACTION_DOWN",
        "file": "images/down.png"
      }, {
        "type": "png",
        "name": "ACTION_CONFIG",
        "file": "images/setup.png"
      }
    ]
  }
};

var resources = (function() {
  var resources = appinfo.resources;
  return resources && resources.media || [];
})();

var Resource = {};

Resource.items = resources;

Resource.getId = function(opt) {
  var path = opt;
  if (typeof opt === 'object') {
    path = opt.url;
  }
  path = path.replace(/#.*/, '');
  var cname = myutil.toCConstantName(path);
  for (var i = 0, ii = resources.length; i < ii; ++i) {
    var res = resources[i];
    if (res.name === cname || res.file === path) {
      return i + 1;
    }
  }
};

module.exports = Resource;

},{"../lib/myutil":5}],23:[function(require,module,exports){
var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var Resource = require('./resource');
var Accel = require('./accel');
var ImageService = require('./imageservice');
var WindowStack = require('./windowstack');
var Window = require('./window');
var Menu = require('./menu');
var StageElement = require('./element');

var simply = require('./simply');

/** 
 * This package provides the underlying implementation for the ui/* classes.
 *
 * This implementation uses PebbleKit JS AppMessage to send commands to a Pebble Watch.
 */

/* Make JSHint happy */
if (typeof Image === 'undefined') {
  window.Image = function(){};
}

/**
 * First part of this file is defining the commands and types that we will use later.
 */

var Color = function(x) {
  switch (x) {
    case 'clear': return ~0;
    case 'black': return 0;
    case 'white': return 1;
  }
  return Number(x);
};
window.Color = Color;

var Font = function(x) {
  var id = Resource.getId(x);
  if (id) {
    return id;
  }
  x = myutil.toCConstantName(x);
  if (!x.match(/^RESOURCE_ID/)) {
    x = 'RESOURCE_ID_' + x;
  }
  x = x.replace(/_+/g, '_');
  return x;
};
window.Font = Font;

var TextOverflowMode = function(x) {
  switch (x) {
    case 'wrap'    : return 0;
    case 'ellipsis': return 1;
    case 'fill'    : return 2;
  }
  return Number(x);
};
window.TextOverflowMode = TextOverflowMode;

var TextAlignment = function(x) {
  switch (x) {
    case 'left'  : return 0;
    case 'center': return 1;
    case 'right' : return 2;
  }
  return Number(x);
};
window.TextAlignment = TextAlignment;

var TimeUnits = function(x) {
  var z = 0;
  x = myutil.toObject(x, true);
  for (var k in x) {
    switch (k) {
      case 'seconds': z |= (1 << 0); break;
      case 'minutes': z |= (1 << 1); break;
      case 'hours'  : z |= (1 << 2); break;
      case 'days'   : z |= (1 << 3); break;
      case 'months' : z |= (1 << 4); break;
      case 'years'  : z |= (1 << 5); break;
    }
  }
  return z;
};
window.TimeUnits = TimeUnits;

var CompositingOp = function(x) {
  switch (x) {
    case 'assign':
    case 'normal': return 0;
    case 'assignInverted':
    case 'invert': return 1;
    case 'or'    : return 2;
    case 'and'   : return 3;
    case 'clear' : return 4;
    case 'set'   : return 5;
  }
  return Number(x);
};
window.CompositingOp = CompositingOp;

var AnimationCurve = function(x) {
  switch (x) {
    case 'linear'   : return 0;
    case 'easeIn'   : return 1;
    case 'easeOut'  : return 2;
    case 'easeInOut': return 3;
  }
  return Number(x);
};
window.AnimationCurve = AnimationCurve;

var setWindowParams = [{
  name: 'clear',
}, {
  name: 'id',
}, {
  name: 'pushing',
  type: Boolean,
}, {
  name: 'action',
  type: Boolean,
}, {
  name: 'actionUp',
  type: Image,
}, {
  name: 'actionSelect',
  type: Image,
}, {
  name: 'actionDown',
  type: Image,
}, {
  name: 'actionBackgroundColor',
  type: Color,
}, {
  name: 'backgroundColor',
  type: Color,
}, {
  name: 'fullscreen',
  type: Boolean,
}, {
  name: 'scrollable',
  type: Boolean,
}];
window.setWindowParams = setWindowParams;

var setCardParams = setWindowParams.concat([{
  name: 'title',
  type: String,
}, {
  name: 'subtitle',
  type: String,
}, {
  name: 'body',
  type: String,
}, {
  name: 'icon',
  type: Image,
}, {
  name: 'subicon',
  type: Image,
}, {
  name: 'image',
  type: Image,
}, {
  name: 'style'
}]);
window.setCardParams = setCardParams;

var setMenuParams = setWindowParams.concat([{
  name: 'sections',
  type: Number,
}]);
window.setMenuParams = setMenuParams;

var setStageParams = setWindowParams;
window.setStageParams = setStageParams;

var commands = [{
  name: 'setWindow',
  params: setWindowParams,
}, {
  name: 'windowShow',
  params: [{
    name: 'id'
  }]
}, {
  name: 'windowHide',
  params: [{
    name: 'id'
  }]
}, {
  name: 'setCard',
  params: setCardParams,
}, {
  name: 'click',
  params: [{
    name: 'button',
  }],
}, {
  name: 'longClick',
  params: [{
    name: 'button',
  }],
}, {
  name: 'accelTap',
  params: [{
    name: 'axis',
  }, {
    name: 'direction',
  }],
}, {
  name: 'vibe',
  params: [{
    name: 'type',
  }],
}, {
  name: 'accelData',
  params: [{
    name: 'transactionId',
  }, {
    name: 'numSamples',
  }, {
    name: 'accelData',
  }],
}, {
  name: 'getAccelData',
  params: [{
    name: 'transactionId',
  }],
}, {
  name: 'configAccelData',
  params: [{
    name: 'rate',
  }, {
    name: 'samples',
  }, {
    name: 'subscribe',
  }],
}, {
  name: 'configButtons',
  params: [{
    name: 'back',
  }, {
    name: 'up',
  }, {
    name: 'select',
  }, {
    name: 'down',
  }],
}, {
  name: 'setMenu',
  params: setMenuParams,
}, {
  name: 'setMenuSection',
  params: [{
    name: 'clear',
    type: Boolean,
  }, {
    name: 'section',
  }, {
    name: 'items',
  }, {
    name: 'title',
    type: String,
  }],
}, {
  name: 'getMenuSection',
  params: [{
    name: 'section',
  }],
}, {
  name: 'setMenuItem',
  params: [{
    name: 'section',
  }, {
    name: 'item',
  }, {
    name: 'title',
    type: String,
  }, {
    name: 'subtitle',
    type: String,
  }, {
    name: 'icon',
    type: Image,
  }],
}, {
  name: 'getMenuItem',
  params: [{
    name: 'section',
  }, {
    name: 'item',
  }],
}, {
  name: 'menuSelect',
  params: [{
    name: 'section',
  }, {
    name: 'item',
  }],
}, {
  name: 'menuLongSelect',
  params: [{
    name: 'section',
  }, {
    name: 'item',
  }],
}, {
  name: 'image',
  params: [{
    name: 'id',
  }, {
    name: 'width',
  }, {
    name: 'height',
  }, {
    name: 'pixels',
  }],
}, {
  name: 'setStage',
  params: setStageParams,
}, {
  name: 'stageElement',
  params: [{
    name: 'id',
  }, {
    name: 'type',
  }, {
    name: 'index',
  }, {
    name: 'x',
  }, {
    name: 'y',
  }, {
    name: 'width',
  }, {
    name: 'height',
  }, {
    name: 'backgroundColor',
    type: Color,
  }, {
    name: 'borderColor',
    type: Color,
  }, {
    name: 'radius',
  }, {
    name: 'text',
    type: String,
  }, {
    name: 'font',
    type: Font,
  }, {
    name: 'color',
    type: Color,
  }, {
    name: 'textOverflow',
    type: TextOverflowMode,
  }, {
    name: 'textAlign',
    type: TextAlignment,
  }, {
    name: 'updateTimeUnits',
    type: TimeUnits,
  }, {
    name: 'image',
    type: Image,
  }, {
    name: 'compositing',
    type: CompositingOp,
  }],
}, {
  name: 'stageRemove',
  params: [{
    name: 'id',
  }],
}, {
  name: 'stageAnimate',
  params: [{
    name: 'id',
  }, {
    name: 'x',
  }, {
    name: 'y',
  }, {
    name: 'width',
  }, {
    name: 'height',
  }, {
    name: 'duration',
  }, {
    name: 'easing',
    type: AnimationCurve,
  }],
}, {
  name: 'stageAnimateDone',
  params: [{
    name: 'index',
  }],
}];
window.commands = commands;

// Build the commandMap and map each command to an integer.

var commandMap = {};

for (var i = 0, ii = commands.length; i < ii; ++i) {
  var command = commands[i];
  commandMap[command.name] = command;
  command.id = i;

  var params = command.params;
  if (!params) {
    continue;
  }

  var paramMap = command.paramMap = {};
  for (var j = 0, jj = params.length; j < jj; ++j) {
    var param = params[j];
    paramMap[param.name] = param;
    param.id = j + 1;
  }
}

var buttons = [
  'back',
  'up',
  'select',
  'down',
];

var accelAxes = [
  'x',
  'y',
  'z',
];

var vibeTypes = [
  'short',
  'long',
  'double',
];

var styleTypes = [
  'small',
  'large',
  'mono',
];

var clearFlagMap = {
  action: (1 << 0),
  text: (1 << 1),
  image: (1 << 2),
};

var actionBarTypeMap = {
  up: 'actionUp',
  select: 'actionSelect',
  down: 'actionDown',
  backgroundColor: 'actionBackgroundColor',
};


/**
 * SimplyPebble object provides the actual methods to communicate with Pebble.
 *
 * It's an implementation of an abstract interface used by all the other classes.
 */

var SimplyPebble = {};

SimplyPebble.init = function() {
  // Register listeners for app message communication
  Pebble.addEventListener('appmessage', SimplyPebble.onAppMessage);

  // Register this implementation as the one currently in use
  simply.impl = SimplyPebble;
};


var toParam = function(param, v) {
  if (param.type === String) {
    v = typeof v !== 'undefined' ? v.toString() : '';
  } else if (param.type === Boolean) {
    v = v ? 1 : 0;
  } else if (param.type === Image && typeof v !== 'number') {
    v = ImageService.resolve(v);
  } else if (typeof param.type === 'function') {
    v = param.type(v);
  }
  return v;
};

var setPacket = function(packet, command, def, typeMap) {
  var paramMap = command.paramMap;
  for (var k in def) {
    var paramName = typeMap && typeMap[k] || k;
    if (!paramName) { continue; }
    var param = paramMap[paramName];
    if (param) {
      packet[param.id] = toParam(param, def[k]);
    }
  }
  return packet;
};

var makePacket = function(command, def) {
  var packet = {};
  packet[0] = command.id;
  if (def) {
    setPacket(packet, command, def);
  }
  return packet;
};

SimplyPebble.sendPacket = (function() {
  var queue = [];
  var sending = false;

  function stop() {
    sending = false;
  }

  function consume() {
    queue.splice(0, 1);
    if (queue.length === 0) { return stop(); }
    cycle();
  }

  function cycle() {
    var head = queue[0];
    if (!head) { return stop(); }
    Pebble.sendAppMessage(head, consume, cycle);
  }

  function send(packet) {
    queue.push(packet);
    if (sending) { return; }
    sending = true;
    cycle();
  }

  return send;
})();

SimplyPebble.buttonConfig = function(buttonConf) {
  var command = commandMap.configButtons;
  var packet = makePacket(command, buttonConf);
  SimplyPebble.sendPacket(packet);
};

var toClearFlags = function(clear) {
  if (clear === true) {
    clear = 'all';
  }
  if (clear === 'all') {
    clear = ~0;
  } else if (typeof clear === 'string') {
    clear = clearFlagMap[clear];
  } else if (typeof clear === 'object') {
    var flags = 0;
    for (var k in clear) {
      if (clear[k] === true) {
        flags |= clearFlagMap[k];
      }
    }
    clear = flags;
  }
  return clear;
};

var setActionPacket = function(packet, command, actionDef) {
  if (actionDef) {
    if (typeof actionDef === 'boolean') {
      actionDef = { action: actionDef };
    }
    setPacket(packet, command, actionDef, actionBarTypeMap);
  }
  return packet;
};

SimplyPebble.window = function(windowDef, clear) {
  var command = commandMap.setWindow;
  var packet = makePacket(command, windowDef);
  if (clear) {
    clear = toClearFlags(clear);
    packet[command.paramMap.clear.id] = clear;
  }
  setActionPacket(packet, command, windowDef.action);
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.windowHide = function(windowId) {
  var command = commandMap.windowHide;
  var packet = makePacket(command);
  packet[command.paramMap.id.id] = windowId;
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.card = function(cardDef, clear, pushing) {
  var command = commandMap.setCard;
  var packet = makePacket(command, cardDef);
  if (clear) {
    clear = toClearFlags(clear);
    packet[command.paramMap.clear.id] = clear;
  }
  if (pushing) {
    packet[command.paramMap.pushing.id] = pushing;
  }
  setActionPacket(packet, command, cardDef.action);
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.vibe = function(type) {
  var command = commandMap.vibe;
  var packet = makePacket(command);
  var vibeIndex = vibeTypes.indexOf(type);
  packet[command.paramMap.type.id] = vibeIndex !== -1 ? vibeIndex : 0;
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.accelConfig = function(configDef) {
  var command = commandMap.configAccelData;
  var packet = makePacket(command, configDef);
  SimplyPebble.sendPacket(packet);
};

var accelListeners = [];

SimplyPebble.accelPeek = function(callback) {
  accelListeners.push(callback);
  var command = commandMap.getAccelData;
  var packet = makePacket(command);
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.menu = function(menuDef, clear, pushing) {
  var command = commandMap.setMenu;
  var packetDef = util2.copy(menuDef);
  if (packetDef.sections instanceof Array) {
    packetDef.sections = packetDef.sections.length;
  }
  if (!packetDef.sections) {
    packetDef.sections = 1;
  }
  var packet = makePacket(command, packetDef);
  if (clear) {
    clear = toClearFlags(clear);
    packet[command.paramMap.clear.id] = clear;
  }
  if (pushing) {
    packet[command.paramMap.pushing.id] = pushing;
  }
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.menuSection = function(sectionIndex, sectionDef, clear) {
  var command = commandMap.setMenuSection;
  var packetDef = util2.copy(sectionDef);
  packetDef.section = sectionIndex;
  if (packetDef.items instanceof Array) {
    packetDef.items = packetDef.items.length;
  }
  packetDef.clear = clear;
  var packet = makePacket(command, packetDef);
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.menuItem = function(sectionIndex, itemIndex, itemDef) {
  var command = commandMap.setMenuItem;
  var packetDef = util2.copy(itemDef);
  packetDef.section = sectionIndex;
  packetDef.item = itemIndex;
  var packet = makePacket(command, packetDef);
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.image = function(id, gbitmap) {
  var command = commandMap.image;
  var packetDef = util2.copy(gbitmap);
  packetDef.id = id;
  var packet = makePacket(command, packetDef);
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.stage = function(stageDef, clear, pushing) {
  var command = commandMap.setStage;
  var packet = makePacket(command, stageDef);
  if (clear) {
    clear = toClearFlags(clear);
    packet[command.paramMap.clear.id] = clear;
  }
  if (pushing) {
    packet[command.paramMap.pushing.id] = pushing;
  }
  setActionPacket(packet, command, stageDef.action);
  SimplyPebble.sendPacket(packet);
};

var toFramePacket = function(packetDef) {
  if (packetDef.position) {
    var position = packetDef.position;
    delete packetDef.position;
    packetDef.x = position.x;
    packetDef.y = position.y;
  }
  if (packetDef.size) {
    var size = packetDef.size;
    delete packetDef.size;
    packetDef.width = size.x;
    packetDef.height = size.y;
  }
  return packetDef;
};

SimplyPebble.stageElement = function(elementId, elementType, elementDef, index) {
  var command = commandMap.stageElement;
  var packetDef = util2.copy(elementDef);
  packetDef.id = elementId;
  packetDef.type = elementType;
  packetDef.index = index;
  packetDef = toFramePacket(packetDef);
  var packet = makePacket(command, packetDef);
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.stageRemove = function(elementId) {
  var command = commandMap.stageRemove;
  var packet = makePacket(command);
  packet[command.paramMap.id.id] = elementId;
  SimplyPebble.sendPacket(packet);
};

SimplyPebble.stageAnimate = function(elementId, animateDef, duration, easing) {
  var command = commandMap.stageAnimate;
  var packetDef = util2.copy(animateDef);
  packetDef.id = elementId;
  if (duration) {
    packetDef.duration = duration;
  }
  if (easing) {
    packetDef.easing = easing;
  }
  packetDef = toFramePacket(packetDef);
  var packet = makePacket(command, packetDef);
  SimplyPebble.sendPacket(packet);
};

var readInt = function(packet, width, pos, signed) {
  var value = 0;
  pos = pos || 0;
  for (var i = 0; i < width; ++i) {
    value += (packet[pos + i] & 0xFF) << (i * 8);
  }
  if (signed) {
    var mask = 1 << (width * 8 - 1);
    if (value & mask) {
      value = value - (((mask - 1) << 1) + 1);
    }
  }
  return value;
};

SimplyPebble.onAppMessage = function(e) {

  var payload = e.payload;
  var code = payload[0];
  var command = commands[code];
  
  if (!command) {
    console.log('Received unknown payload: ' + JSON.stringify(payload));
    return;
  }

  switch (command.name) {
    case 'windowHide':
      WindowStack.emitHide(payload[1]);
      break;
    case 'click':
    case 'longClick':
      var button = buttons[payload[1]];
      Window.emitClick(command.name, button);
      break;
    case 'accelTap':
      var axis = accelAxes[payload[1]];
      Accel.emitAccelTap(axis, payload[2]);
      break;
    case 'accelData':
      var transactionId = payload[1];
      var samples = payload[2];
      var data = payload[3];
      var accels = [];
      for (var i = 0; i < samples; i++) {
        var pos = i * 15;
        var accel = {
          x: readInt(data, 2, pos, true),
          y: readInt(data, 2, pos + 2, true),
          z: readInt(data, 2, pos + 4, true),
          vibe: readInt(data, 1, pos + 6) ? true : false,
          time: readInt(data, 8, pos + 7),
        };
        accels[i] = accel;
      }
      if (typeof transactionId === 'undefined') {
        Accel.emitAccelData(accels);
      } else {
        var handlers = accelListeners;
        accelListeners = [];
        for (var j = 0, jj = handlers.length; j < jj; ++j) {
          Accel.emitAccelData(accels, handlers[j]);
        }
      }
      break;
    case 'getMenuSection':
      Menu.emitSection(payload[1]);
      break;
    case 'getMenuItem':
      Menu.emitItem(payload[1], payload[2]);
      break;
    case 'menuSelect':
    case 'menuLongSelect':
      Menu.emitSelect(command.name, payload[1], payload[2]);
      break;
    case 'stageAnimateDone':
        console.log('stageAnimateDone')
      StageElement.emitAnimateDone(payload[1]);
      break;
  }
};

module.exports = SimplyPebble;

},{"../lib/myutil":5,"../lib/util2":7,"./accel":11,"./element":14,"./imageservice":16,"./menu":19,"./resource":22,"./simply":24,"./window":29,"./windowstack":30}],24:[function(require,module,exports){
/**
 * This file provides an easy way to switch the actual implementation used by all the
 * ui objects.
 *
 * simply.impl provides the actual communication layer to the hardware.
 */

var simply = {};

// Override this with the actual implementation you want to use.
simply.impl = undefined;

module.exports = simply;

},{}],25:[function(require,module,exports){
var util2 = require('../lib/util2');
var Emitter = require('../lib/emitter');
var WindowStack = require('./windowstack');
var simply = require('./simply');

var Stage = function(stageDef) {
  this.state = stageDef || {};
  this._items = [];
};

util2.copy(Emitter.prototype, Stage.prototype);

Stage.prototype._show = function() {
  this.each(function(element, index) {
    element._reset();
    this._insert(index, element);
  }.bind(this));
};

Stage.prototype._prop = function() {
  if (this === WindowStack.top()) {
    simply.impl.stage.apply(this, arguments);
  }
};

Stage.prototype.each = function(callback) {
  this._items.forEach(callback);
  return this;
};

Stage.prototype.at = function(index) {
  return this._items[index];
};

Stage.prototype.index = function(element) {
  return this._items.indexOf(element);
};

Stage.prototype._insert = function(index, element) {
  if (this === WindowStack.top()) {
    simply.impl.stageElement(element._id(), element._type(), element.state, index);
  }
};

Stage.prototype._remove = function(element, broadcast) {
  if (broadcast === false) { return; }
  if (this === WindowStack.top()) {
    simply.impl.stageRemove(element._id());
  }
};

Stage.prototype.insert = function(index, element) {
  element.remove(false);
  this._items.splice(index, 0, element);
  element.parent = this;
  this._insert(this.index(element), element);
  return this;
};

Stage.prototype.add = function(element) {
  return this.insert(this._items.length, element);
};

Stage.prototype.remove = function(element, broadcast) {
  var index = this.index(element);
  if (index === -1) { return this; }
  this._remove(element, broadcast);
  this._items.splice(index, 1);
  delete element.parent;
  return this;
};

module.exports = Stage;

},{"../lib/emitter":3,"../lib/util2":7,"./simply":24,"./windowstack":30}],26:[function(require,module,exports){
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

},{"../lib/myutil":5,"../lib/util2":7,"./element":14,"./propable":20}],27:[function(require,module,exports){
var util2 = require('../lib/util2');
var Text = require('./text');

var TimeText = function(elementDef) {
  Text.call(this, elementDef);
  if (this.state.text) {
    this.text(this.state.text);
  }
};

util2.inherit(TimeText, Text);

var formatUnits = {
  a: 'days',
  A: 'days',
  b: 'months',
  B: 'months',
  c: 'seconds',
  d: 'days',
  H: 'hours',
  I: 'hours',
  j: 'days',
  m: 'months',
  M: 'minutes',
  p: 'hours',
  S: 'seconds',
  U: 'days',
  w: 'days',
  W: 'days',
  x: 'days',
  X: 'seconds',
  y: 'years',
  Y: 'years',
};

var getUnitsFromText = function(text) {
  var units = {};
  text.replace(/%(.)/g, function(_, code) {
    var unit = formatUnits[code];
    if (unit) {
      units[unit] = true;
    }
    return _;
  });
  return units;
};

TimeText.prototype.text = function(text) {
  if (arguments.length === 0) {
    return this.state.text;
  }
  this.prop({
    text: text,
    updateTimeUnits: getUnitsFromText(text),
  });
  return this;
};

module.exports = TimeText;

},{"../lib/util2":7,"./text":26}],28:[function(require,module,exports){
var Vibe = module.exports;
var simply = require('./simply');

Vibe.vibrate = function(type) {
  simply.impl.vibe(type);
};


},{"./simply":24}],29:[function(require,module,exports){
var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var Emitter = require('../lib/emitter');
var Accel = require('./accel');
var WindowStack = require('./windowstack');
var Propable = require('./propable');
var Stage = require('./stage');
var simply = require('./simply');

var buttons = [
  'back',
  'up',
  'select',
  'down',
];

/**
 * Enable fullscreen in the Pebble UI.
 * Fullscreen removes the Pebble status bar, giving slightly more vertical display height.
 * @memberOf simply
 * @param {boolean} fullscreen - Whether to enable fullscreen mode.
 */

/**
 * Enable scrolling in the Pebble UI.
 * When scrolling is enabled, up and down button presses are no longer forwarded to JavaScript handlers.
 * Single select, long select, and accel tap events are still available to you however.
 * @memberOf simply
 * @param {boolean} scrollable - Whether to enable a scrollable view.
 */

var configProps = [
  'fullscreen',
  'style',
  'scrollable',
  'backgroundColor',
];

var actionProps = [
  'up',
  'select',
  'back',
  'backgroundColor',
];

var accessorProps = configProps;

var nextId = 1;

var Window = function(windowDef) {
  this.state = windowDef || {};
  this.state.id = nextId++;
  this._buttonInit();
  this._items = [];
  this._dynamic = true;
};

Window._codeName = 'window';

util2.copy(Emitter.prototype, Window.prototype);

util2.copy(Propable.prototype, Window.prototype);

util2.copy(Stage.prototype, Window.prototype);

Propable.makeAccessors(accessorProps, Window.prototype);

Window.prototype._id = function() {
  return this.state.id;
};

Window.prototype._hide = function(broadcast) {
  if (broadcast === false) { return; }
  simply.impl.windowHide(this._id());
};

Window.prototype.hide = function() {
  WindowStack.remove(this, true);
  return this;
};

Window.prototype._show = function(pushing) {
  this._prop(this.state, true, pushing);
  if (this._dynamic) {
    Stage.prototype._show.call(this, pushing);
  }
};

Window.prototype.show = function() {
  WindowStack.push(this);
  return this;
};

Window.prototype._insert = function() {
  if (this._dynamic) {
    Stage.prototype._insert.apply(this, arguments);
  }
};

Window.prototype._remove = function() {
  if (this._dynamic) {
    Stage.prototype._remove.apply(this, arguments);
  }
};

Window.prototype._clearAction = function() {
  actionProps.forEach(myutil.unset.bind(this, this.state.action));
};

Window.prototype._clear = function(flags) {
  flags = myutil.toFlags(flags);
  if (myutil.flag(flags, 'action')) {
    this._clearAction();
  }
};

Window.prototype.prop = function(field, value, clear) {
  if (arguments.length === 0) {
    return util2.copy(this.state);
  }
  if (arguments.length === 1 && typeof field !== 'object') {
    return this.state[field];
  }
  if (typeof field === 'object') {
    clear = value;
  }
  if (clear) {
    this._clear('all');
  }
  var windowDef = myutil.toObject(field, value);
  util2.copy(windowDef, this.state);
  this._prop(windowDef);
  return this;
};

Window.prototype._action = function(visible) {
  if (this === WindowStack.top()) {
    simply.impl.window({ action: typeof visible === 'boolean' ? visible : this.state.action }, 'action');
  }
};

Window.prototype.action = function(field, value, clear) {
  var action = this.state.action;
  if (!action) {
    action = this.state.action = {};
  }
  if (arguments.length === 0) {
    return action;
  }
  if (arguments.length === 1 && typeof field === 'string') {
    return action[field];
  }
  if (typeof field !== 'string') {
    clear = value;
  }
  if (clear) {
    this._clear('action');
  }
  if (typeof field !== 'boolean') {
    util2.copy(myutil.toObject(field, value), this.state.action);
  }
  this._action(field);
  return this;
};

var isBackEvent = function(type, subtype) {
  return ((type === 'click' || type === 'longClick') && subtype === 'back');
};

Window.prototype.onAddHandler = function(type, subtype) {
  if (isBackEvent(type, subtype)) {
    this._buttonAutoConfig();
  }
  if (type === 'accelData') {
    Accel.autoSubscribe();
  }
};

Window.prototype.onRemoveHandler = function(type, subtype) {
  if (!type || isBackEvent(type, subtype)) {
    this._buttonAutoConfig();
  }
  if (!type || type === 'accelData') {
    Accel.autoSubscribe();
  }
};

Window.prototype._buttonInit = function() {
  this.state.button = {
    config: {},
    configMode: 'auto',
  };
  for (var i = 0, ii = buttons.length; i < ii; i++) {
    var button = buttons[i];
    if (button !== 'back') {
      this.state.button.config[buttons[i]] = true;
    }
  }
};

/**
 * The button configuration parameter for {@link simply.buttonConfig}.
 * The button configuration allows you to enable to disable buttons without having to register or unregister handlers if that is your preferred style.
 * You may also enable the back button manually as an alternative to registering a click handler with 'back' as its subtype using {@link simply.on}.
 * @typedef {object} simply.buttonConf
 * @property {boolean} [back] - Whether to enable the back button. Initializes as false. Simply.js can also automatically register this for you based on the amount of click handlers with subtype 'back'.
 * @property {boolean} [up] - Whether to enable the up button. Initializes as true. Note that this is disabled when using {@link simply.scrollable}.
 * @property {boolean} [select] - Whether to enable the select button. Initializes as true.
 * @property {boolean} [down] - Whether to enable the down button. Initializes as true. Note that this is disabled when using {@link simply.scrollable}.
 */

/**
 * Changes the button configuration.
 * See {@link simply.buttonConfig}
 * @memberOf simply
 * @param {simply.buttonConfig} buttonConf - An object defining the button configuration.
 */
Window.prototype.buttonConfig = function(buttonConf, auto) {
  var buttonState = this.state.button;
  if (typeof buttonConf === 'undefined') {
    var config = {};
    for (var i = 0, ii = buttons.length; i < ii; ++i) {
      var name = buttons[i];
      config[name] = buttonConf.config[name];
    }
    return config;
  }
  for (var k in buttonConf) {
    if (buttons.indexOf(k) !== -1) {
      if (k === 'back') {
        buttonState.configMode = buttonConf.back && !auto ? 'manual' : 'auto';
      }
      buttonState.config[k] = buttonConf[k];
    }
  }
  if (simply.impl.buttonConfig) {
    return simply.impl.buttonConfig(buttonState.config);
  }
};

Window.prototype._buttonAutoConfig = function() {
  var buttonState = this.state.button;
  if (!buttonState || buttonState.configMode !== 'auto') {
    return;
  }
  var singleBackCount = this.listenerCount('click', 'back');
  var longBackCount = this.listenerCount('longClick', 'back');
  var useBack = singleBackCount + longBackCount > 0;
  if (useBack !== buttonState.config.back) {
    buttonState.config.back = useBack;
    return this.buttonConfig(buttonState.config, true);
  }
};

Window.prototype._toString = function() {
  return '[' + this.constructor._codeName + ' ' + this._id() + ']';
};

Window.emit = function(type, subtype, e, klass) {
  var wind = e.window = WindowStack.top();
  if (klass) {
    e[klass._codeName] = wind;
  }
  if (wind && wind.emit(type, subtype, e) === false) {
    return false;
  }
};

/**
 * Simply.js button click event. This can either be a single click or long click.
 * Use the event type 'click' or 'longClick' to subscribe to these events.
 * @typedef simply.clickEvent
 * @property {string} button - The button that was pressed: 'back', 'up', 'select', or 'down'. This is also the event subtype.
 */

Window.emitClick = function(type, button) {
  var e = {
    button: button,
  };
  return Window.emit(type, button, e);
};

module.exports = Window;

},{"../lib/emitter":3,"../lib/myutil":5,"../lib/util2":7,"./accel":11,"./propable":20,"./simply":24,"./stage":25,"./windowstack":30}],30:[function(require,module,exports){
var util2 = require('../lib/util2');
var myutil = require('../lib/myutil');
var Emitter = require('../lib/emitter');
var simply = require('./simply');

var WindowStack = function() {
  this.init();
};

util2.copy(Emitter.prototype, WindowStack.prototype);

WindowStack.prototype.init = function() {
  this.off();
  this._items = [];

  this.on('show', function(e) {
    e.window.forEachListener(e.window.onAddHandler);
  });
  this.on('hide', function(e) {
    e.window.forEachListener(e.window.onRemoveHandler);
  });
};

WindowStack.prototype.top = function() {
  return util2.last(this._items);
};

WindowStack.prototype._emitShow = function(item) {
  var e = {
    window: item
  };
  this.emit('show', e);
};

WindowStack.prototype._emitHide = function(item) {
  var e = {
    window: item
  };
  this.emit('hide', e);
};

WindowStack.prototype._show = function(item, pushing) {
  if (!item) { return; }
  this._emitShow(item);
  item._show(pushing);
};

WindowStack.prototype._hide = function(item, broadcast) {
  if (!item) { return; }
  this._emitHide(item);
  item._hide(broadcast);
};

WindowStack.prototype.at = function(index) {
  return this._items[index];
};

WindowStack.prototype.index = function(item) {
  return this._items.indexOf(item);
};

WindowStack.prototype.push = function(item) {
  if (item === this.top()) { return; }
  this.remove(item);
  var prevTop = this.top();
  this._items.push(item);
  this._show(item, true);
  this._hide(prevTop, false);
  console.log('(+) ' + item._toString() + ' : ' + this._toString());
};

WindowStack.prototype.pop = function(broadcast) {
  return this.remove(this.top(), broadcast);
};

WindowStack.prototype.remove = function(item, broadcast) {
  if (typeof item === 'number') {
    item = this.get(item);
  }
  if (!item) { return; }
  var index = this.index(item);
  if (index === -1) { return item; }
  var wasTop = (item === this.top());
  this._items.splice(index, 1);
  if (wasTop) {
    var top = this.top();
    this._show(top);
    this._hide(item, top && top.constructor === item.constructor ? false : broadcast);
  }
  console.log('(-) ' + item._toString() + ' : ' + this._toString());
  return item;
};

WindowStack.prototype.get = function(windowId) {
  var items = this._items;
  for (var i = 0, ii = items.length; i < ii; ++i) {
    var wind = items[i];
    if (wind._id() === windowId) {
      return wind;
    }
  }
};

WindowStack.prototype.emitHide = function(windowId) {
  var wind = this.get(windowId);
  if (wind !== this.top()) { return; }
  this.remove(wind);
};

WindowStack.prototype._toString = function() {
  return this._items.map(function(x){ return x._toString(); }).join(',');
};

module.exports = new WindowStack();

},{"../lib/emitter":3,"../lib/myutil":5,"../lib/util2":7,"./simply":24}]},{},[9])