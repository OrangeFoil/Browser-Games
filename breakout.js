window.onload=function() {
	canvas=document.getElementById("gamecanvas");
	context=canvas.getContext("2d");
	document.addEventListener("keydown",keyPush);
	setInterval(game,1000/60);
}

const ball = {
    speed: -5,
    size: 12,
    pos: {x: 640 / 2, y: 480 / 2},
    velocity: {x: 0, y: -5 },
};

const player = {
    pos: { x: 160, y: 480-32},
    width: 120,
    height: 32,
    speed: 20,
    moveLeft: function() { this.pos.x -= this.speed; },
    moveRight: function() { this.pos.x += this.speed; },
};

function Block(x, y, width, height) {
    this.pos = { x: x, y: y};
    this.width = width;
    this.height = height;
}

function level1() {
    const blocks = [];
    for (i = 0; i < 6; i++) {
        for (j = 0; j < 4; j++) {
            blocks.push(new Block(96+i*80, 96+j*24, 64, 16, true));
        }
    }
    return blocks;
}

function game() {
    // update ball position
    if (ball.pos.y-ball.size/2 > canvas.height) {
        // player missed the ball
        ball.pos.x = canvas.width / 2 - ball.size / 2;
        ball.pos.y = canvas.height / 2 - ball.size / 2;
        ball.velocity.x = 0;
        ball.velocity.y = ball.speed;
    } else if (ball.pos.y-ball.size/2 <= 0) {
        // ball touched ceiling
        ball.velocity.y = -ball.velocity.y;
    } else if (ball.pos.x-ball.size/2 <= 0 || ball.pos.x+ball.size/2 >= canvas.width) {
        // ball touched left or right wall
        ball.velocity.x = -ball.velocity.x;
    }
    ball.pos.x += ball.velocity.x;
    ball.pos.y += ball.velocity.y;

    // detect ball collision with player
    if (ball.pos.x+ball.size/2 >= player.pos.x-player.width/2 && ball.pos.x-ball.size/2 <= player.pos.x+player.width/2
    && ball.pos.y-ball.size/2 >= player.pos.y-player.height/2 && ball.pos.y+ball.size/2 <= player.pos.y+player.height) {
        ball.velocity.x = (ball.pos.x - player.pos.x) / 10;
        ball.velocity.y = -ball.velocity.y;
    }

    // detect ball collision with blocks
    blocks.forEach(function(block) {
        if (ball.pos.x-ball.size/2 < block.pos.x+block.width && ball.pos.x+ball.size/2 > block.pos.x
            && ball.pos.y-ball.size/2 < block.pos.y+block.height && ball.pos.y+ball.size/2 > block.pos.y) {
                var i = blocks.indexOf(block);
                blocks.splice(i, 1);
                score++;
                ball.velocity.x = -ball.velocity.x;
                ball.velocity.y = -ball.velocity.y;
        }
    });
    
    // draw background
    context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// draw ball
    context.fillStyle = "white";
    context.fillRect(ball.pos.x-ball.size/2, ball.pos.y-ball.size/2, ball.size, ball.size);

    // draw player
	context.fillStyle = "red";
    context.fillRect(player.pos.x-player.width/2, player.pos.y, player.width, 16);

    // draw blocks
    context.fillStyle = "blue";
    blocks.forEach(function(block) {
        context.fillRect(block.pos.x, block.pos.y, block.width, block.height);
    });

    // draw score
    context.fillStyle = "white";
    context.font = "20px Georgia";
    context.fillText("Score: " + score, 10, 20);

    // AI
    /*if (player.pos.x-ball.pos.x < -20) {
        player.pos.x += 20;
    } else if (player.pos.x-ball.pos.x > 20) {
        player.pos.x -= 20;
    }*/
}
function keyPush(evt) {
	switch(evt.keyCode) {
		case 37:
            player.moveLeft();
			break;
		case 39:
            player.moveRight();
			break;
	}
}


var score = 0;
var blocks = level1();
