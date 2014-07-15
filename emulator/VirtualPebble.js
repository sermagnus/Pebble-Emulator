/**
 * Virtual Pebble
 * 
 * @param {type} pebble
 * @param {type} options
 * @returns {$.fn}
 */
$.fn.virtualPebble = function(pebble, options){

    var _self = this;

    var defaults = {};
    var options = $.extend({}, defaults, options);
    
    this.Pebble = null;
    this.SystemOS = null;
    this.Display = null;
    this.Vibration = null;
    
    this.send = function(data){        
        this.Pebble.send(data);
    };
    
    this.receive = function(data, event){
        var decoded = _self.SystemOS.decode(data);
        console.log("[VirtualPebble.received]", decoded);
        _self.SystemOS.execute(decoded.name, decoded.params);
    };
    
    this.buttonHandler = function(button){
        var btn = $(button),
            btnData = btn.data(),
            btnName = btnData.pebbleButton,
            btnType = btnData.pebbleButtonType,
            currentItem = this.Display.currentWindow();

        if(btn.is('.back') && this.Display.currentWindow().getId()!==1){
            this.backTo();
            return;
        }
        
        if((currentItem instanceof Menu)){
            if(btnName=='up'){
                currentItem.selectUp();
            }else if(btnName=='down'){
                currentItem.selectDown();
            }else if(btnName=='select'){
                var selected = currentItem.getSelected();
                this.SystemOS.execute('menuSelect',[selected.section, selected.item])
            }
            return;
        }
        
        var timeDiff = (new Date).getTime()-btn.data('pressTime');
        
        if(timeDiff>=750){
            btnType = 'longClick';
        }
        
        _self.SystemOS.execute(btnType, [btnName]);
    };
    
    this.backTo = function(){
        
        var lastElement = this.Display.currentWindow();

        if( (lastElement instanceof Window) )
            this.SystemOS.execute('windowHide', [lastElement.getId()]);
        
        else if( (lastElement instanceof Stage) )
            this.SystemOS.execute('stageRemove', [lastElement.getId()]);
        
    };
    
    this.internalClock = function(){
        setInterval(function(){
            _self.trigger('tick.tack');
        },999); // 1s
    };
    
    this.init = function(){
        this.Pebble.addEventListener('sendappmessage', this.receive);
        this.on('mousedown', '[data-pebble-button]', function(){
            $(this).data('pressTime', (new Date).getTime());
        });
        this.on('mouseup', '[data-pebble-button]', function(){
            _self.buttonHandler(this);
        });
        this.internalClock();
        this.resources = ResourceManager;
        
    };
    
    if(this.length>0){
        
        this.Pebble = pebble;
        this.Display = new Display(this);
        this.Vibration = new Vibration(this);
        this.SystemOS = new SystemOS(this);
        
        this.init();
        return this;
    }
    
};

var ResourceManager = new function(){
    
    var appInfo = Pebble.getAppInfo();

    this.getMedia = function(media_id){
        return appInfo.resources['media'][media_id-1];
    };

    this.getIcon = function(media_id){
        return 'resources/'+(this.getMedia(media_id).file);
    };
};


/**
 * Pebble Commands
 * 
 * @param {object} virtual_pebble Instance of VirtualPebble
 * @returns {SystemOS}
 */
function SystemOS(virtual_pebble){
    
    this.Pebble = virtual_pebble.Pebble;
    this.display = virtual_pebble.Display;
    this.vibration = virtual_pebble.Vibration;
    this.commands = window.commands;
    
    this.commandsIdMap = {};
    
    for(var i in this.commands){
        this.commandsIdMap[this.commands[i].name] = this.commands[i].id;
    }
    
}

SystemOS.prototype.commands = null;
SystemOS.prototype.decode = function(command_payload){
        
    var id = command_payload[0],
        command = this.commands[id];

    if(!command) return;
    
    var decodedCommand = {
        name: command.name,
        params: {}
    };

    for(var index in command_payload){
        if(index===0) continue; // skip command id
        
        for(var i=0; i<command.params.length; i++){
            
            var param = command.paramMap[command.params[i].name];
            
            if(!(param.name in decodedCommand.params)){
                decodedCommand.params[param.name] = null;
            }
            
            if(param.id!=index) continue;
            
            decodedCommand.params[param.name] = command_payload[index];            
            break;

        }
    }
    return decodedCommand;
};

SystemOS.prototype.execute = function(command_name, params){
    var _self = this;
    var commandId = this.commandsIdMap[command_name];
    switch(command_name){
        
        // Window Hide
        case 'windowHide':
            var windowId = params[0] || params.id;
            this.Pebble.send([commandId, windowId]);
            this.display.windowHide(windowId);
        break;
        
        // Set Card
        case 'setCard':
            this.display.setCard(params);   
        break;
        
        
        // Set Menu
        case 'setMenu':
            // first call - menu definition
            if(params.clear===-1 && params.sections>0){
                for(var i=0; i<params.sections; i++){
                    this.execute('getMenuSection', [i]);
                }
                return;
            }
            
            // second call - setup of menu items
            this.display.setMenu(params);
        break;
        
        
        // Get Menu Sections - for current menu
        case 'getMenuSection':
            this.Pebble.send([commandId, params[0]]);
        break;        
        
        // Get Menu Sections - for current menu
        case 'setMenuSection':
            var currentMenu = this.display.currentWindow();
            if(currentMenu instanceof Menu){
                currentMenu.addSection(params);
                for(var i=0; i<Number(params.items); i++){

                    this.execute('getMenuItem',[params.section,i]);
                }
            }
        break;        
        
        // Get Menu Sections - for current menu
        case 'getMenuItem':
            this.Pebble.send([commandId, params[0], params[1]]);
        break;
        
        // Set the Menu Item
        case 'setMenuItem':            
            var currentMenu = this.display.currentWindow();
            if(currentMenu instanceof Menu){
                currentMenu.addItem(params);
            }            
        break;
        
        // Menu Item Select
        case 'menuSelect':            
            this.Pebble.send([commandId, params[0], params[1]]);               
        break;
        
        
        // Set Stage
        case 'setStage':
            this.display.setStage(params);
        break;
        
        // Stage Element
        case 'stageElement':
            this.display.stageElement(params);
        break;
        
        // Stage Animate
        case 'stageAnimate':
            this.display.animate(params, function(window_index){
                _self.execute('stageAnimateDone', [window_index]);
            });
        break;
        
        // Stage Animate Done
        case 'stageAnimateDone':
            this.Pebble.send([commandId, params[0]]);               
        break;
        
        
        // Window Hide
        case 'stageRemove':
            var stageId = params[0];
            this.Pebble.send([commandId, stageId]);
            this.display.windowHide(stageId);
        break;
        
        
        // Button Click
        case 'click':
        case 'longClick':
            
            var btnId = params[0];
            
            switch(btnId.toLowerCase()){
                case 'back':
                    btnId = 0;
                    break;
                case 'up':
                    btnId = 1;
                    break;
                case 'select':
                    btnId = 2;
                    break;
                case 'down':
                    btnId = 3;
                    break;
            }
            
            this.Pebble.send([commandId,btnId]);
            
        break;
        
        case 'vibe':
            console.log(this);
            this.vibration.vibrate(params.type);
            
        break;
        
            
        // Command unknowned or not implemented
        default:
            console.log("Unknowned command: ",command_name,params);
            
    }
    
};

/* Vibration */
function Vibration(virtual_pebble){
    
    var _self = virtual_pebble.jrumble();
    
    this.init = function(){    
        _self.jrumble({
            x: 2,
            y: 2,
            rotation: 1
        });    
    };
    
    this.start = function(){
        _self.trigger('startRumble');
    };
    
    this.stop = function(){
        _self.trigger('stopRumble');
    };
    
    this.init();
}
Vibration.prototype.vibrate = function(type_of_vibration){
    
    var _self = this;
    
    switch(type_of_vibration){
        
        case 0:
        case 'short':
            setTimeout(function(){
                _self.stop();
            },500);
            this.start();
            break;
            
        case 1:
        case 'long':
            setTimeout(function(){
                _self.stop();
            },1000);
            this.start();
            break;
            
        case 2:
        case 'double':
            setTimeout(function(){
                _self.vibrate('short');
            },1000);
            _self.vibrate('short');
            break;
        
    }
    
};


/* Display */
function Display(virtual_pebble){
    
    var _self = this;
    
    this.statusBar = null;
    
    // The system status bar at the top of the display showing the time,
    // although apps can also be made fullscreen, removing the status bar.
    this.setupStatusBar = function(){
        var statusBar = $(document.createElement('div'));
        statusBar.attr('id','StatusBar');
        this.viewport.parent().prepend(statusBar);        
        virtual_pebble.on('tick.tack', this.updateTime);    
        _self.statusBar = statusBar;
    };
    
    this.updateTime = function(){
        var now = new Date();
        _self.statusBar.text( now.strftime('%H:%M') );
    };
    
    this.windowStack = [];
    this.fullscreenMode = false;
    this.viewport = virtual_pebble.find('#Viewport');
    this.setupStatusBar();
    this.updateTime();
}

Display.prototype.setFullscreen = function(flag){
    
    this.fullscreenMode = flag;
    
    if(this.fullscreenMode){
        this.viewport.addClass('fullscreen');
    }else{
        this.viewport.removeClass('fullscreen');        
    }
    
};

Display.prototype.searchElement = function(id, type){
    
    if(type)
        return this.viewport.find('.'+type+'[data-id="'+id+'"]');
    
    return this.viewport.find('[data-id="'+id+'"]');
};

Display.prototype.currentWindow = function(){
    return this.windowStack[this.windowStack.length-1];
};

Display.prototype.show = function(new_element){

    if(new_element instanceof DisplayObject){
        
        this.windowStack = [new_element];
        this.viewport.children().remove();
        
        this.viewport.append(new_element.get());
        this.setFullscreen(new_element.fullscreen);
    }
    
};

Display.prototype.windowHide = function(window_id){
    console.log("[VirtualPebble.windowHide] id:",window_id);
    if(!window_id) return;
    
    var currentWindow = this.currentWindow();
    if((currentWindow instanceof Window) && currentWindow.getId()==window_id){
        for(var i in currentWindow.animations){
            currentWindow.animations[i].stop();
        }
        currentWindow.remove();
    }
    
};

Display.prototype.setCard = function(params){
    
    var card = new Card(params);
    
    this.show(card);
    return card;
    
};

Display.prototype.setMenu = function(params){
    
    var menu = new Menu(params);
    
    this.show(menu);
    return menu;
    
};

// static method
Display.getTextAlign = function(align_code) {
    switch (align_code) {
      case 0 : return 'left';
      case 1 : return 'center';
      case 2 : return 'right';
    }
    return '';
};

Display.prototype.stageElement = function(params){
    
    switch(params.type){
        
        // text element
        case 3: 
            
            var textElement;
            var currentStage = this.currentWindow();
            
            var textElement = currentStage.find(params.id);
            
            if(!(currentStage instanceof Stage)) return;

            if(textElement){
                textElement.update(params);
            }else{
                if(params.updateTimeUnits && params.updateTimeUnits>0)
                    textElement = new TimeText(params);
                else
                    textElement = new TextElement(params);
                
                currentStage.render(textElement);
            }
            
            break;
    }
    
    
};

Display.prototype.animate = function(params, complete_callback){
    
    var currentWindow = this.currentWindow();
    var element =  this.searchElement(params.id);
    var animationTime = params.duration || 400;
    
    var anim = element.animate({
                        top: params.y,
                        left: params.x,
                        width: params.width,
                        height: params.height
                    }, animationTime, function(){
                        var windowIndex = currentWindow.element.index();
                        complete_callback(windowIndex)
                    });
    
    currentWindow.animations.push(anim);
        
};

Display.prototype.setStage = function(params){
    
    var stage = new Stage(params);
    
    this.show(stage);
    return stage;
    
};



// Display Item
function DisplayObject(params){        
    this.element = $(document.createElement('div'));
    this.element.addClass(this.getType())
                .attr('data-id', params.id);
        
    params = params || {};
    for(var k in params) this[k]=params[k];
}
DisplayObject.prototype.element = null;
DisplayObject.prototype.get = function(){
    return this.element;
};
DisplayObject.prototype.remove = function(){
    this.element.remove();
};
DisplayObject.prototype.getId = function(){
    return this.element.data('id');
};
DisplayObject.prototype.fullscreen = false;
DisplayObject.prototype.getType = function() { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};
DisplayObject.factory = function(type, params){
    
    var obj = new DisplayObject(params||{});
    obj.element.attr('class', type);
    return obj;
};


// Window
function Window(params){    
    DisplayObject.call(this, params); // call super constructor    
    this.fullscreen = params.fullscreen || false;
    this.animations = [];
    this.elements = [];
}
Window.prototype = Object.create(DisplayObject.prototype);
Window.prototype.constructor = Window;
Window.prototype.find = function(element_id){
    for(var e in this.elements){
        if(this.elements[e].getId()==element_id)
            return this.elements[e];
    }
    return false;
}

// Card
function Card(params){
    
    Window.call(this, params); // call super constructor
    
    var card = this.element;

    if(params.style){
        card.addClass(param.style);
    }

    if(params.title){
        var row =  $(document.createElement('div')).addClass('row'); // necessario per allineare correttamente il testo e l'icona
        var title = $(document.createElement('div')).addClass('title').text(params.title);
        row.append(title);
        
        if(params.icon){
            try{
                var iconCell = $(document.createElement('div')).addClass('icon');
                var icon = $(new Image());
                icon.addClass('title-icon')
                        .attr('src', ResourceManager.getIcon(params.icon));
                iconCell.append(icon);
                row.prepend(iconCell);
            }catch(e){
                console.log("Error loading icon",e);
            }
        }
        card.append(row);
    }

    if(params.subtitle){
        var subtitle = $(document.createElement('span')).addClass('subtitle').text(params.subtitle);
        card.append(subtitle);
    }

    if(params.body){
        var body = $(document.createElement('span')).addClass('body').text(params.body);
        card.append(body);
    }
    
};
Card.prototype = Object.create(Window.prototype);
Card.prototype.constructor = Card;

// Stage
function Stage(params){
    
    Window.call(this, params); // call super constructor
    
    var stage = this.element;
     
    this.createActionBar(params);
}
Stage.prototype = Object.create(Window.prototype);
Stage.prototype.constructor = Stage;
Stage.prototype.actionBar = false;
Stage.prototype.render = function(element){
    this.elements.push(element);
    this.element.append(element.get());
}
Stage.prototype.createActionBar = function(params){
    
    if(!params.action)
        return;
    
    var actionBar = $(document.createElement('div')).addClass('action-bar');
    var iconUp = $(document.createElement('div')).addClass('action up');
    var iconSelect = $(document.createElement('div')).addClass('action select');
    var iconDown = $(document.createElement('div')).addClass('action down');
    
    actionBar.append(iconUp);
    actionBar.append(iconSelect);
    actionBar.append(iconDown);
    
    // action up
    if(params.actionUp){
        var icon = $(new Image());
        icon.addClass('action-icon')
                .attr('src', ResourceManager.getIcon(params.actionUp));
        iconUp.append(icon);
    }
    
    // action select
    if(params.actionSelect){
        var icon = $(new Image());
        icon.addClass('action-icon')
                .attr('src', ResourceManager.getIcon(params.actionSelect));
        iconSelect.append(icon);
    }
    
    // action down
    if(params.actionDown){
        var icon = $(new Image());
        icon.addClass('action-icon')
                .attr('src', ResourceManager.getIcon(params.actionDown));
        iconDown.append(icon);
    }
    
    
    if(params.actionBackgroundColor=='white'){
        actionBar.addClass('white');
    }
    
    this.element.append(actionBar)
                .addClass('has-action-bar');
            
    this.action = actionBar;
};


//Menu
function Menu(params){
    
    Window.call(this, params); // call super constructor
    
    var menu = this.element;
    
    this.items = [];
    this.sections = [];
    this.selected = -1;
}
Menu.prototype = Object.create(Window.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.selectUp = function(){
    this.select(-1);
};

Menu.prototype.selectDown = function(){
    this.select(+1);
};

Menu.prototype.select = function(index){
    
    if(this.selected+index>=0 && this.selected+index<this.items.length){
        this.selected+=index;
        var items = this.element.find('.MenuItem');
        var previousActive = items.filter('.active');
        var currentActive = items.filter(':eq('+this.selected+')');
        previousActive.removeClass('active')
                        .find('img').each(function(){
                            CanvasService.invertColor(this);
                        });;
        currentActive.addClass('active')
                        .find('img').each(function(){
                            CanvasService.invertColor(this);
                        });
        
        var viewport = this.element.parents('#Viewport');
        
        var boundTop = currentActive.position().top;
        var viewportHeight = viewport.height();
        
        if(boundTop>(viewportHeight/2)){
            var maxTop = -(this.element.outerHeight(true) - viewportHeight);
            var newTop = ((viewportHeight-currentActive.height())/2) - boundTop;
            
            if(newTop < maxTop) newTop = maxTop;
            this.element.stop().animate({top: newTop},300);
        }else{
            this.element.stop().animate({top: 0},300);
        }
                        
        return;
    }
    
};

Menu.prototype.getSelected = function(){
    return this.items[this.selected];
};

Menu.prototype.addSection = function(params){
    
    var menuSection = DisplayObject.factory('Section', params);
    var section = menuSection.get();
    
    section.attr('data-section', params.section);
    
    if(params.title){
        var title = $(document.createElement('div'));
        title.text(params.title)
             .addClass('title');
        section.append(title);
    }
    
    this.element.append(section);
    this.sections.push(menuSection);
};

Menu.prototype.addItem = function(params){
    
    var menuItem = DisplayObject.factory('MenuItem', params);
    var item = menuItem.get();
    item.attr('data-item', params.item);
    
    var text = $(document.createElement('div')).addClass('text');
    
    if(params.title){
        var title = $(document.createElement('span')).addClass('title').text(params.title);
        text.append(title);
    }

    if(params.subtitle){
        var subtitle = $(document.createElement('span')).addClass('subtitle').text(params.subtitle);
        text.append(subtitle);
    }
    
    item.append(text);
        
    if(params.icon){
        try{
            var iconCell = $(document.createElement('div')).addClass('icon');
            var icon = $(new Image());
            icon.addClass('title-icon')
                    .attr('src', ResourceManager.getIcon(params.icon));
            iconCell.append(icon);
            item.prepend(iconCell);
            text.addClass('icon-text');
        }catch(e){
            console.log("Error loading icon",e);
        }
    }
    
    // select the first option
    if(this.selected===-1){
        this.select(1);
    }
    
    this.element.find('[data-section="'+params.section+'"]').append(item);
    this.items.push(menuItem);
    
};



// Element
function Element(params){
    DisplayObject.call(this, params);
}
Element.prototype = Object.create(DisplayObject.prototype);
Element.prototype.constructor = DisplayObject;
Element.prototype.update = function(params){}


// TextElement
function TextElement(params){
    
    Element.call(this, params); // call super constructor
    
    this.element.css('position','absolute');
    this.update(params);
}
TextElement.prototype = Object.create(Element.prototype);
TextElement.prototype.constructor = Element;
Element.prototype.update = function(params){
    
    var textElement = this.element;
    
    if(params.x) textElement.css('left', params.x);
    if(params.y) textElement.css('top', params.y);
    if(params.width) textElement.css('width', params.width);
    if(params.height) textElement.css('height', params.height);
    if(params.textAlign) textElement.css('textAlign', Display.getTextAlign(params.textAlign));
    if(params.textOverflow) textElement.css('textOverflow', (params.textOverflow ? 'ellipsis' : ''));
    
    if(params.backgroundColor)
         textElement.addClass('black')
    else if(params.backgroundColor==1)
         textElement.addClass('white')
    else
        textElement.removeClass('black').removeClass('white')
    
    if(params.text)
        textElement.text( params.text )

    if(params.font){
        textElement.addClass(params.font || this.font);
    }
    
}


// TimeText
function TimeText(params){
    
    TextElement.call(this, params); // call super constructor
    
    var textElement = this.element,
        updateInterval = 1000 //specifiche non chiare, come specifico l'updateTimeUnit?;
    
    function updateText(){
        var now = new Date();
        textElement.text( now.strftime(params.text) );
    };
    
    setInterval(updateText, updateInterval);
    updateText();    
    
}

TimeText.prototype = Object.create(TextElement.prototype);
TimeText.prototype.constructor = TimeText;



// CanvasService - Util
var CanvasService = new function(image){
    
    this.invertColor = function(img) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext("2d");
           
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img,0,0);
            var imageData = context.getImageData(0, 0, img.width, img.height);
            var data = imageData.data;
            for(var i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];  // red
                data[i + 1] = 255 - data[i + 1];   // green
                data[i + 2] = 255 - data[i + 2];  // blue
            }
        context.putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL();
    };
    
};