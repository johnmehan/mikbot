var canvas = document.getElementById("myCanvas").getContext("2d");
canvas.fillStyle = "#000000";
canvas.scale(4, 4);

left = loadImage("images/left.png", 0, 8);
leftPress = loadImage("images/leftPress.png", 0, 8);
up = loadImage("images/up.png", 13, 0);
upPress = loadImage("images/upPress.png", 13, 0);
right = loadImage("images/right.png", 26, 8);
rightPress = loadImage("images/rightPress.png", 26, 8);
down = loadImage("images/down.png", 13, 8);
downPress = loadImage("images/downPress.png", 13, 8);

function loadImage(path, x, y) {
	var img = new Image();
	img.x = x;
	img.y = y;
	img.src = path;
	img.onload = function() {
		canvas.drawImage(this, img.x, img.y);
	}
	return img;
};

window.addEventListener("keydown", function(e) {
	switch(event.keyCode) {
		case 37:
			left = true;
			break;
		case 38:
			up = true;
			break;
		case 39:
			right = true;
			break;
		case 40:
			down = true;
			break;
	}
	console.log(event.keyCode);
})

window.addEventListener("keyup", function(e) {
	switch(event.keyCode) {
		case 37:
			left = false;
			break;
		case 38:
			up = false;
			break;
		case 39:
			right = false;
			break;
		case 40:
			down = false;
			break;
	}
	console.log(event.keyCode);
});

