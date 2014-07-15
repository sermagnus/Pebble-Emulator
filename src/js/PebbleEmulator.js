function PebbleEmulator(settings){
    
    var options = settings || {};

    this.responseTime = 50;
    this.eventHandlers = [];

    this.gateway = null;
    this.showLogs = options.showLogs || false;
    
    
    this.guid = function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
        }
        
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };
    
}

// Pebble function (emulator)
PebbleEmulator.prototype.addEventListener = function(event, callback){
	
    switch(event){
	
        // Pebble is ready
        case 'ready':
        break;

        // Receiving messages from Pebble
        // Your JavaScript code can process messages coming from Pebble through the appmessage event. The callback to this event takes one parameter: a JavaScript object with a key payload representing the message received.
        case 'appmessage':
        break;

        // Echo of messages to Pebble
        case 'sendappmessage':
        break;

        // Start the Web UI of application setting
        case 'showConfiguration':
        break;

        // Exit from Web UI of application setting
        case 'webviewclosed ':
        break;

    }
    
    this.pushEvent(event, callback);

};

// Pebble function (emulator) - Send data to pebble
PebbleEmulator.prototype.sendAppMessage = function(data, ackHandler, nackHandler){
    
    this.log("[sendAppMessage]", data, ackHandler, nackHandler);
    
    var _self = this;
    
    var transactionId = this.guid();

    var event = {
        transactionId: transactionId,
        date: new Date()
    };

    setTimeout(function(){
        ackHandler.call(Pebble, event);
        _self.triggerEvent('sendappmessage', data, event);
    }, this.responseTime);
    
    // The error handler
    function errorHandler(error_reason){
        event.message = error_reason;
        nackHandler.call(Pebble, event);
    }

    return transactionId;
};

PebbleEmulator.prototype.openURL = function(url){
    
    var webui = $(document.createElement('iframe'));
    
    webui.addClass('web-ui');
    webui.attr('id', 'AppConfiguration');
    webui.load(function(){
        var frameWindow = this.contentWindow || this.contentDocument.parentWindow;
        var currentUri = frameWindow.location.toString();
        frameWindow.devEnvroiment = true;
        if(currentUri.indexOf('?close')>-1){
            var e = {response:''};
            var urlPart = currentUri.substring(currentUri.indexOf('?close')+7);
            if(urlPart && urlPart.length>0){
                e.response = urlPart;
                Pebble.triggerEvent('webviewclosed', e);
            }else{
                e.response = 'CANCELLED';
            }
            Pebble.triggerEvent('webviewclosed', e);
            $('body').removeClass('show-configuration');
            webui.remove();
        }
    }).attr('src', url);
    
    $('body').addClass('show-configuration')
             .append(webui);
}

// Pebble function (emulator) - Send a simple notification
PebbleEmulator.prototype.showSimpleNotificationOnPebble = function(title, text){
    this.log("[showSimpleNotificationOnPebble]", title, text);
};

PebbleEmulator.prototype.pushEvent = function(event, callback){
    this.eventHandlers.push({type: event, handler: callback});
};

PebbleEmulator.prototype.send = function(data){
    var e = {payload: data};
    this.triggerEvent('appmessage', e);
};

PebbleEmulator.prototype.triggerEvent = function(type, data){

    for(var h in this.eventHandlers){

        if(this.eventHandlers[h] && this.eventHandlers[h].type===type){
            var args = Array.prototype.slice.call(arguments, 1);
            this.log("[Event trigged]", type,args);
            this.eventHandlers[h].handler.apply(this, args);
            break;
        }
    }
};

PebbleEmulator.prototype.log = function(){
    
    arguments[0] = 'PebbleEmulator '+arguments[0];
    
    if(this.showLogs)
        console.log.apply(console, arguments);
    
};

PebbleEmulator.prototype.getAppInfo = function(){
    var settings = null;
    $.ajax({
        url: './appinfo.json',
        async: false,
        cache: false,
        method: 'get'
    }).success(function(response){
        settings=response;
    });
    return settings;
};

PebbleEmulator.prototype.getAccountToken = function(){
	return '00000000000000000000000000000000';
};


// INIT
var Pebble = new PebbleEmulator({showLogs:false});

window.onload = function(){
    Pebble.triggerEvent('ready');
};