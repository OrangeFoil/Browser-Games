const canvas = document.getElementById("gamecanvas");
const context = canvas.getContext("2d");
document.addEventListener("keydown", keyPush);
setInterval(loop,1000/60);

const game = {
    demoMode: null,
    score: null,
    lives: null,
    level: null,
    blocks: null,
    reset: function() {
        this.demoMode = true;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.blocks = level1();
    },
}

const ball = {
    pos: {x: null, y: null},
    velocity: {x: null, y: null },
    size: null,
    speed: null,
    draw: function() {
        context.fillStyle = "#F8F8F2";
        context.fillRect(this.pos.x-this.size/2, this.pos.y-this.size/2, this.size, this.size);
    },
    reset: function() {
        this.pos.x = canvas.width / 2;
        this.pos.y = canvas.height - 64;
        this.speed = -5;
        this.velocity.x = (Math.random() + 0.5) * Math.pow(-1, Math.floor(Math.random() * 2));
        if (game.demoMode) this.velocity.x += 2;
        this.velocity.y = this.speed;
        this.size = 12;
    },
};

const player = {
    pos: { x: null, y: null},
    width: null,
    height: null,
    speed: null,
    draw: function() {
        context.fillStyle = "#F92672";
        context.fillRect(this.pos.x-this.width/2, this.pos.y, this.width, 16);
    },
    moveLeft: function() { if (this.pos.x >= 0) this.pos.x -= this.speed; },
    moveRight: function() { if (this.pos.x <= canvas.width) this.pos.x += this.speed; },
    reset: function() {
        this.pos.x = canvas.width / 2;
        this.pos.y = canvas.height - 32;
        this.width = 120;
        this.height = 32;
        this.speed = 20;
    },
};

function Block(x, y, width, height, color="#FFE792") {
    this.pos = { x: x, y: y};
    this.width = width;
    this.height = height;
    this.color = color;
    this.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    };
}

function level1() {
    const blocks = [];
    const colors = ["#F92672", "#66D9EF", "#A6E22E", "#FD971F", "#AE81FF", "#FFE792", "#FFE792"];
    for (row = 0; row < 7; row++) {
        for (col = 0; col < 8; col++) {
            blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
        }
    }
    return blocks;
}

function loop() {
    // update ball position
    if (ball.pos.y-ball.size/2 > canvas.height) {
        // player missed the ball
        ball.reset();
        player.reset();
        if (--game.lives == 0) game.reset();
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
    game.blocks.forEach(function(block) {
        if (ball.pos.x-ball.size/2 < block.pos.x+block.width && ball.pos.x+ball.size/2 > block.pos.x
            && ball.pos.y-ball.size/2 < block.pos.y+block.height && ball.pos.y+ball.size/2 > block.pos.y) {
                var i = game.blocks.indexOf(block);
                game.blocks.splice(i, 1);
                game.score++;
                ball.velocity.x = -ball.velocity.x;
                ball.velocity.y = -ball.velocity.y;
        }
    });
    
    // draw background
    context.fillStyle = "#272822";
	context.fillRect(0, 0, canvas.width, canvas.height);

    // draw objects
    ball.draw();
    player.draw();
    game.blocks.forEach(function(block) {
        block.draw();
    });

    // draw score and lives
    context.fillStyle = "white";
    context.font = "20px Georgia";
    context.textAlign = "left";
    context.fillText("Score: " + game.score, 10, 20);
    context.textAlign = "right";
    context.fillText("Lives: " + game.lives, canvas.width-10, 20);

    if (game.demoMode) {
        // AI
        if (player.pos.x-ball.pos.x < -20) {
            player.moveRight();
        } else if (player.pos.x-ball.pos.x > 20) {
            player.moveLeft();
        }

        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText("Press <enter> to start playing", canvas.width / 2, canvas.height / 2);
    }
    
}
function keyPush(evt) {
	switch(evt.keyCode) {
		case 37:
            if (!game.demoMode) player.moveLeft();
			break;
		case 39:
            if (!game.demoMode) player.moveRight();
            break;
        case 13:
            game.reset();
            game.demoMode = false;
            ball.reset();
            player.reset();
            break;
	}
}

game.reset();
ball.reset();
player.reset();
