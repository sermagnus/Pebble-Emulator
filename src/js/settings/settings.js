var util2 = require('../lib/util2');
var ajax = require('../lib/ajax');
var myutil = require('../lib/myutil');
var appinfo = {};//require('appinfo');

var Settings = module.exports;

var state;

Settings.settingsUrl = 'http://meiguro.com/simplyjs/settings.html';

Settings.init = function() {
  Settings.reset();

  Settings.loadOptions();
  Settings.loadData();

  // Register listeners for the Settings
  Pebble.addEventListener('showConfiguration', Settings.onOpenConfig);
  Pebble.addEventListener('webviewclosed', Settings.onCloseConfig);
};

Settings.reset = function() {
  state = Settings.state = {
    options: {},
    data: {},
    listeners: [],
  };
};

Settings.mainScriptUrl = function(scriptUrl) {
  if (typeof scriptUrl === 'string' && scriptUrl.length && !scriptUrl.match(/^(\w+:)?\/\//)) {
    scriptUrl = 'http://' + scriptUrl;
  }
  if (scriptUrl) {
    localStorage.setItem('mainJsUrl', scriptUrl);
  } else {
    scriptUrl = localStorage.getItem('mainJsUrl');
  }
  return scriptUrl;
};

Settings.getBaseOptions = function() {
  return {
    scriptUrl: Settings.mainScriptUrl(),
  };
};

var getDataKey = function(path, field) {
  path = path || appinfo.uuid;
  return field + ':' + path;
};

Settings.saveData = function(path, field) {
  field = field || 'data';
  var data = data || state[field];
  localStorage.setItem(getDataKey(path, field), JSON.stringify(data));
};

Settings.loadData = function(path, field) {
  field = field || 'data';
  state[field] = {};
  var data = localStorage.getItem(getDataKey(path, field));
  try {
    data = JSON.parse(data);
  } catch (e) {}
  if (typeof data === 'object' && data !== null) {
    state[field] = data;
  }
};

Settings.saveOptions = function(path) {
  Settings.saveData(path, 'options');
};

Settings.loadOptions = function(path) {
  Settings.loadData(path, 'options');
};

var makeDataAccessor = function(type, path) {
  return function(field, value) {
    var data = state[type];
    if (arguments.length === 0) {
      return data;
    }
    if (arguments.length === 1 && typeof field !== 'object') {
      return data[field];
    }
    if (typeof field !== 'object' && typeof value === 'undefined' || value === null) {
      delete data[field];
      return;
    }
    var def = myutil.toObject(field, value);
    util2.copy(def, data);
    Settings.saveData(path, type);
    return value;
  };
};

Settings.option = makeDataAccessor('options');

Settings.data = makeDataAccessor('data');

Settings.config = function(opt, open, close) {
  if (typeof opt === 'string') {
    opt = { url: opt };
  }
  if (typeof close === 'undefined') {
    close = open;
    open = util2.noop;
  }
  var listener = {
    params: opt,
    open: open,
    close: close,
  };
  state.listeners.push(listener);
};

Settings.onOpenConfig = function(e) {
  var options;
  var url;
  var listener = util2.last(state.listeners);
  if (listener) {
    e = {
      originalEvent: e,
      options: state.options,
      url: listener.params.url,
    };
    if (listener.open(e) === false) {
      return;
    }
    url = listener.params.url;
    options = state.options;
  } else {
    url = Settings.settingsUrl;
    options = Settings.getBaseOptions();
    return;
  }
  var hash = encodeURIComponent(JSON.stringify(options));
  Pebble.openURL(url + '#' + hash);
};

Settings.onCloseConfig = function(e) {
  var listener = util2.last(state.listeners);
  var options = {};
  var format;
  if (e.response && e.response !== 'CANCELLED') {
    try {
      options = JSON.parse(decodeURIComponent(e.response));
      format = 'json';
    } catch (err) {}
    if (!format && e.response.match(/(&|=)/)) {
      options = ajax.deformify(e.response);
      if (util2.count(options) > 0) {
        format = 'form';
      }
    }
  }
  if (listener) {
    e = {
      originalEvent: e,
      response: e.response,
      originalOptions: state.options,
      options: options,
      url: listener.params.url,
      failed: !format,
      format: format,
    };
    if (format && listener.params.autoSave !== false) {
      e.originalOptions = util2.copy(state.options);
      util2.copy(options, state.options);
      Settings.saveOptions();
    }
    return listener.close(e);
  }
};

window.Settings = Settings;