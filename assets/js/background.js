

// ----------------------------------------
// Particle
// ----------------------------------------

function Particle( x, y, radius ) {
    this.init( x, y, radius );
}

Particle.prototype = {

    init: function( x, y, radius ) {

        this.alive = true;

        this.radius = radius || 10;
        this.wander = 0.15;
        this.theta = random( TWO_PI );
        this.drag = 0.92;
        this.color = '#fff';

        this.x = x || 0.0;
        this.y = y || 0.0;

        this.vx = 0.0;
        this.vy = 0.0;
    },

    move: function() {

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= this.drag;
        this.vy *= this.drag;

        this.theta += random( -0.5, 0.5 ) * this.wander;
        this.vx += sin( this.theta ) * 0.1;
        this.vy += cos( this.theta ) * 0.1;

        this.radius *= 0.96;
        this.alive = this.radius > 0.5;
    },

    draw: function( ctx ) {

        ctx.beginPath();
        ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};

// ----------------------------------------
// Example
// ----------------------------------------

let MAX_PARTICLES = 280;
let COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];

let particles = [];
let pool = [];

let canvas = document.createElement("canvas");
let c_width = window.width;
let c_height = 200;
let c_window = 0;

function onWindowResize() {
    browser.windows.getCurrent().then(function (window) {
        c_width = window.width;
        c_window = window.id;
        canvas.width = c_width;
        window.innerWidth = c_width;
        bubbles.width = c_width;
    });
}

onWindowResize();

canvas.width = c_width;
canvas.height = c_height;

window.innerWidth = c_width;
window.innerHeight = c_height;

let bubbles = Sketch.create({
    element: canvas,
    retina: 'auto'
});
bubbles.width = c_width;
bubbles.height = c_height;

bubbles.setup = function() {

    // Set off some initial particles.
    let i, x, y;

    for ( i = 0; i < 20; i++ ) {
        x = ( bubbles.width * 0.5 ) + random( -100, 100 );
        y = ( bubbles.height * 0.5 ) + random( -100, 100 );
        bubbles.spawn( x, y );
    }
};

bubbles.spawn = function(x, y ) {

    let particle, theta, force;

    if ( particles.length >= MAX_PARTICLES )
        pool.push( particles.shift() );

    particle = pool.length ? pool.pop() : new Particle();
    particle.init( x, y, random( 5, 40 ) );

    particle.wander = random( 0.5, 2.0 );
    particle.color = random( COLOURS );
    particle.drag = random( 0.9, 0.99 );

    theta = random( TWO_PI );
    force = random( 2, 8 );

    particle.vx = sin( theta ) * force;
    particle.vy = cos( theta ) * force;

    particles.push( particle );
};

let i_counter = 0;

bubbles.update = function() {

    let i, particle, particle_count;
    particle_count = particles.length;

    for ( i = particle_count - 1; i >= 0; i-- ) {

        particle = particles[i];

        if ( particle.alive ) particle.move();
        else pool.push( particles.splice( i, 1 )[0] );
    }

    if (particle_count && i_counter >= 10) {
        i_counter = 0;
        updateTheme(bubbles.context.canvas);
    }

    i_counter ++;
};

bubbles.draw = function() {
    bubbles.globalCompositeOperation  = 'lighter';
    for ( let i = particles.length - 1; i >= 0; i-- ) {
        particles[i].draw( bubbles );
    }
};


function updateTheme(canvas) {
    console.log('update');
    let dataUrl =  canvas.toDataURL("image/png");

    let theme = {
        images: {
            headerURL: dataUrl,
            "additional_backgrounds": ['/assets/images/bg.png']
        },
        colors: {
            accentcolor: '#000',
            textcolor: '#fff'
        },
		properties: {
			additional_backgrounds_tiling: ['repeat']
		}
    };

    browser.theme.update(c_window, theme);
}


function handleMessage(request, sender, sendResponse) {
    switch (request.event) {
        case 'mouse_move':
            if (request.buttons) {
                spanBubbles.atPosition(request.x, 1);
            }
            break;
        case 'mouse_down':
            switch (request.which) {
                case 1:
                    spanBubbles.atPosition(request.x);
                    break;
                case 2:
                    spanBubbles.moveToSides(request.x);
                    break;
                case 3:
                    spanBubbles.moveFromSides(request.x);
                    break;
            }
            break;
        case 'mouse_up':
            break;
        case 'wheel':
            spanBubbles.sides();
            break;
        case 'key_down':
            switch (request.which) {
                case 13: spanBubbles.burst(2); // Enter
                    break;
                case 9: spanBubbles.move(0, c_width); //Tab
                    break;
                case 8: spanBubbles.move(c_width, 0, 1); //Backspace
                    break;
                case 32: //Space
                    spanBubbles.move(c_width/2, 0);
                    spanBubbles.move(c_width/2, c_width);
                    break;
                case 33: //Page Up
                case 34: //Page Down
                    spanBubbles.sides();
                    break;
                case 37: //Left Arrow
                    spanBubbles.move(c_width/2, 0);
                    break;
                case 39: //Right Arrow
                    spanBubbles.move(c_width/2, c_width);
                    break;
                case 38: //Up Arrow
                case 40: //Down Arrow
                    spanBubbles.atPosition(c_width/2);
                    break;
                default:
                    spanBubbles.atRandom();
            }
            break;
        case 'resize':
            onWindowResize();
            break;

    }
}

function onFocusChange(id) {
    c_window = id;
    onWindowResize();
}

function handleTabEvents(event) {
    /*switch (event) {
        case 'activated':
            break;
    }*/
    // spanBubbles.burst(2);
    spanBubbles.atRandom(40);
}

let spanBubbles = {
    sides: function (max = 5) {
        for (let j = 0; j < max; j++ ) {
            bubbles.spawn( 50, 50 );
            bubbles.spawn( c_width - 50, 50 );
        }
    },
    atPosition: function (x, max = 20) {
        for (let j = 0; j < max; j++ ) {
            bubbles.spawn( x, 50 );
        }
    },
    atRandom: function (max = 10) {
        for (let j = 0; j < max; j++ ) {
            bubbles.spawn( random(0, c_width), 50 );
        }
    },
    moveToSides: function (x) {
        spanBubbles.move(x, 50);
        spanBubbles.move(x, c_width - 50)
    },
    moveFromSides: function (x) {
        spanBubbles.move(50, x);
        spanBubbles.move(c_width - 50, x)
    },
    burst: function (max = 10) {
        for ( let j = 0; j < max; j++ ) {
            for ( let k = 0; k <= c_width; k+=25) {
                bubbles.spawn( k, 50 );
            }
        }
    },

    move: function (from, to, max = 5, distance = 50, interval = 20) {
        if (from > to && distance > 0) {
            distance = -distance;
        }
        spanBubbles._move(from, to, max, distance, interval);
    },
    _move: function (from, to, max = 10, distance = 50, interval = 20) {
        setTimeout(function () {
            for (let j = 0; j < max; j++ ) {
                bubbles.spawn( from, 50 );
            }

            if (distance < 0 && from < to) return;
            if (distance > 0 && from > to) return;

            spanBubbles._move(from + distance, to, max, distance, interval);
        }, interval);
    }
};

browser.runtime.onMessage.addListener(handleMessage);
browser.windows.onFocusChanged.addListener(onFocusChange);

browser.tabs.onActivated.addListener(handleTabEvents);
browser.tabs.onAttached.addListener(handleTabEvents);
browser.tabs.onCreated.addListener(handleTabEvents);
browser.tabs.onDetached.addListener(handleTabEvents);
browser.tabs.onHighlighted.addListener(handleTabEvents);
browser.tabs.onMoved.addListener(handleTabEvents);
browser.tabs.onRemoved.addListener(handleTabEvents);
browser.tabs.onReplaced.addListener(handleTabEvents);
browser.tabs.onUpdated.addListener(handleTabEvents);
browser.tabs.onZoomChange.addListener(handleTabEvents);



let events = {
    mouse_down: {
        1: {
            action: 'at_position',
            count: 20,
            span: ['mouse_position']
        },
        2: {
            action: 'move',
            count: 5,
            span: [
                {from: 'mouse_position', to: 'left'},
                {from: 'mouse_position', to: 'right'}
            ]
        },
        3: {
            action: 'move',
            count: 5,
            span: [
                {from: 'left', to: 'mouse_position'},
                {from: 'right', to: 'mouse_position'}
            ]
        }
    },
    key_down: {
        13: {
            action: 'burst',
            count: 2
        },
        9: {
            action: 'move',
            count: 5,
            span: [{from: 'left', to: 'right'}]
        },
        8: {
            action: 'move',
            count: 1,
            span: [{from: 'right', to: 'left'}]
        },
        32: {
            action: 'move',
            count: 5,
            span: [
                {from: 'center', to: 'left'},
                {from: 'center', to: 'right'}
            ]
        },
        33: {
            action: 'at_position',
            count: 5,
            span: ['left', 'right']
        },
        34: {
            action: 'at_position',
            count: 5,
            span: ['left', 'right']
        },
        37: {
            action: 'move',
            count: 5,
            span: [{from: 'center', to: 'left'}]
        },
        38: {
            action: 'at_position',
            count: 20,
            span: ['center']
        },
        39: {
            action: 'move',
            count: 5,
            span: [{from: 'center', to: 'right'}]
        },
        40: {
            action: 'at_position',
            count: 20,
            span: ['center']
        },
        'default': {
            action: 'random',
            count: 20
        }
    },
    wheel: {
        action: 'at_position',
        count: 5,
        span: ['left', 'right']
    },
    drag: {
        action: 'at_position',
        count: 1,
        span: ['mouse_position']
    },
    tab: {

    }
};