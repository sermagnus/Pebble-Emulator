/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('./ui');
var Vector2 = require('./lib/vector2');
var Settings = require('./settings');
var Vibe = require('./ui/vibe');

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
                Vibe.vibration('long');
                break;
                
            case 2: // double
                Vibe.vibration('double');
                break;
        }
    });
    vibemenu.show();

}