var canvas = document.getElementsByTagName('canvas')[0];
var ctx = null;
var body = document.getElementsByTagName('body')[0];
var keysDown = new Array();
var SCREENWIDTH  = 640;
var SCREENHEIGHT = 480;
var MODE_TITLE = 0;
var MODE_PLAY  = 1;
var MODE_WIN   = 2;

var animating = 0;
var dx = 0;
var dy = 0;
var movespeed = 4;

var map = [ [ 1, 1, 1, 1 ],
	    [ 1, 0, 0, 1 ],
	    [ 1, 1, 0, 1 ],
	    [ 1, 1, 1, 1 ] ];

function getImage(name)
{
    image = new Image();
    image.src = 'graphics/'+name+'.png';
    return image;
}

function drawChar(context, c, x, y)
{
    c = c.charCodeAt(0);
    if(c > 0) {
        context.drawImage(bitfont, c*6, 0, 6,8, x, y, 12, 16);
    }
}

function drawString(context, string, x, y) {
    string = string.toUpperCase();
    for(i = 0; i < string.length; i++) {
	drawChar(context, string[i], x, y);
	x += 12;
    }
}

function paintTitleBitmaps()
{
    drawString(titlectx, 'This is a demo of the JavaScript/HTML5 game loop',32,32);
    drawString(winctx, 'Your game should always have an ending',32,32);
}

function makeTitleBitmaps()
{
    titleBitmap = document.createElement('canvas');
    titleBitmap.width = SCREENWIDTH;
    titleBitmap.height = SCREENHEIGHT;
    titlectx = titleBitmap.getContext('2d');
    winBitmap = document.createElement('canvas');
    winBitmap.width = SCREENWIDTH;
    winBitmap.height = SCREENHEIGHT;
    winctx = winBitmap.getContext('2d');
    bitfont = new Image();
    bitfont.src = "graphics/bitfont.png";
    bitfont.onload = paintTitleBitmaps;
}

function resetGame()
{
    x = 32;
    y = 32;
}

function init()
{
    mode = MODE_TITLE;
    playerImage = getImage("player");
    springSound = new Audio("audio/boing.wav");
    makeTitleBitmaps();
    return true;
}

function draw() {
    ctx.fillStyle = "#0000ff";
    ctx.fillRect(0, 0, SCREENWIDTH, SCREENHEIGHT);

    if(mode == MODE_TITLE) {
	ctx.drawImage(titleBitmap, 0, 0);
	return;
    }

    ctx.fillStyle = "#000000";
    for(var my=0;my<map.length;my++) {
	for(var mx=0;mx<map[my].length;mx++) {
	    if(map[my][mx] > 0) {
		ctx.fillRect(mx*32,my*32,32,32);
	    }
	}
    }

    ctx.drawImage(playerImage, x, y);

    if(mode == MODE_WIN) {
	ctx.drawImage(winBitmap, 0, 0);
    }
}

function processKeys() {
    if (animating<=0) {
	dx = 0;
	dy = 0;
	if(keysDown[40] || keysDown[83]) dy = 1;
	else if(keysDown[38] || keysDown[87]) dy = -1;
	else if(keysDown[37] || keysDown[65]) dx = -1;
	else if(keysDown[39] || keysDown[68]) dx = 1;
	if (dx != 0 || dy != 0) {
	    var tx = y>>5 + dy;
	    var ty = x>>5 + dx;
	    console.log("Inspect "+tx+","+ty);
	    if(map[(y >> 5) + dy][(x >> 5) + dx]==0) {
		animating = 32;
	    }
	}
    } else {
	x += dx*movespeed;
	y += dy*movespeed;
	animating -= movespeed;
    }
}

function drawRepeat() {
    if(mode != MODE_TITLE) {
	processKeys();
    }
    draw();
    if(!stopRunloop) setTimeout('drawRepeat()',20);
}

if (canvas.getContext('2d')) {
    stopRunloop = false;
    ctx = canvas.getContext('2d');
    body.onkeydown = function (event) {
	var c = event.keyCode;
	console.log("Keydown: "+c);
        keysDown[c] = 1;
	if(c == 81) {
	    stopRunloop=true;
	}
	if(c == 32) {
	    if(mode == MODE_TITLE) {
		resetGame();
		mode = MODE_PLAY;
	    }
	}
	if(c == 82) {
	    if(mode == MODE_WIN) {
		mode = MODE_TITLE;
	    }
	}
    };

    body.onkeyup = function (event) {
	var c = event.keyCode;
        keysDown[c] = 0;
    };

    if(init()) {
      drawRepeat();
    }
}
