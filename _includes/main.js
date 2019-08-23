'use strict';

(function() {
    init();
    setModeEventListener();
})();

/* Init */
/* cookie reading */
function init() {
    let list = document.body.classList;
    let nightMode = document.cookie;

    if (nightMode.split('=')[1] === 'true') {
        enableNightMode( list );
    } else {
        disableNightMode( list );
    }
}

/* Night Mode Listener */
function setModeEventListener() {
    let list = document.body.classList;
    document.getElementById('night-mode').addEventListener('change', event => {
        if( event.target.checked ) {
            enableNightMode( list );
        } else {
            disableNightMode( list );
        }
    });
}


function enableNightMode( list ) {
    list.add('night-mode');
    document.cookie = 'night-mode=true';
    document.getElementById('night-mode').checked = true;
}

function disableNightMode( list ) {
    list.remove('night-mode');
    document.cookie = 'night-mode=false' ;
    document.getElementById('night-mode').checked = false;
}
