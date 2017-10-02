const canvas = document.getElementById("gamecanvas");
const context = canvas.getContext("2d");

var keys = [];
document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

lastTime = (new Date()).getTime();
currentTime = 0;
deltaTime = 0;

const game = {
    demoMode: null,
    score: null,
    multiplier: null,
    lives: null,
    level: null,
    blocks: null,
    reset: function() {
        this.demoMode = true;
        this.score = 0;
        this.multiplier = 1;
        this.lives = 3;
        this.level = 1;
        this.blocks = generateLevel(this.level);
    },
}

const ball = {
    pos: {x: null, y: null},
    velocity: {x: null, y: null },
    width: null,
    height: null,
    speed: null,
    draw: function() {
        context.fillStyle = "#F8F8F2";
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    },
    reset: function() {
        this.pos.x = canvas.width / 2;
        this.pos.y = canvas.height - 64;
        this.speed = -300;
        this.velocity.x = (Math.random() + 0.5) * Math.pow(-1, Math.floor(Math.random() * 2)) * 60;
        if (game.demoMode) this.velocity.x += 2;
        this.velocity.y = this.speed;
        this.width = this.height = 12;
    },
};

const player = {
    pos: { x: null, y: null},
    velocity: null,
    width: null,
    height: null,
    speed: null,
    friction: null,
    draw: function() {
        context.fillStyle = "#F92672";
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    },
    moveLeft: function() {
        this.velocity -= this.speed;
    },
    moveRight: function() {
        this.velocity += this.speed;
    },
    updatePosition: function() {
        this.pos.x += this.velocity;
        this.velocity *= this.friction;

        if (this.pos.x+this.width/2 < 0) {
            this.pos.x = -this.width/2;
            this.velocity = 0;
        } else if (this.pos.x+this.width/2 > canvas.width) {
            this.pos.x = canvas.width-this.width/2;
            this.velocity = 0;
        }
    },
    reset: function() {
        this.width = 120;
        this.height = 16;
        this.pos.x = canvas.width / 2 - this.width / 2;
        this.pos.y = canvas.height - 32;
        this.velocity = 0;
        this.speed = 2;
        this.friction = 0.9;
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

function collisionDetection(a, b) {
    if (a.pos.x < b.pos.x + b.width &&
        a.pos.x + a.width > b.pos.x &&
        a.pos.y < b.pos.y + b.height &&
        a.height + a.pos.y > b.pos.y) {
        return true;
    }
    return false;
}

// returns side on which the ball made contact
function collisionSide(ball, object) {
    // top/bottom or left/right
    if (ball.pos.x+ball.width >= object.pos.x && ball.pos.x <= object.pos.x+object.width) {
        console.log("top/bottom");
        return "top/bottom";
    } else if (ball.pos.y >= object.pos.y-object.height && object.pos.y+object.height <= object.pos.y) {
        console.log("left/right");
        return "left/right";
    }
    return "";
}

function generateLevel(level) {
    const blocks = [];
    const colors = ["#F92672", "#66D9EF", "#A6E22E", "#FD971F", "#AE81FF", "#FFE792", "#FFE792"];
    if (level == 1) {
        for (row = 0; row < 7; row++) {
            for (col = 0; col < 8; col++) {
                blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
            }
        }
    } else if (level == 2) {
        for (row = 0; row < 3; row++) {
            for (col = 1; col < 7; col++) {
                blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
            }
        }
        for (row = 0; row < 4; row++) {
            for (col = 0; col < 8; col++) {
                if (row < 3 && (col == 2 || col == 5)) continue;
                blocks.push(new Block(2+col*60, 160+row*20, 58, 16, colors[row]));
            }
        }
    } else {
        // simple random level
        for (row = 0; row < 7; row++) {
            for (col = 0; col < 8; col++) {
                if (Math.random() >= 0.5) continue;
                blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
            }
        }
    }
    return blocks;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function loop() {
    if (keys[37] && !game.demoMode) player.moveLeft();
    else if (keys[39] && !game.demoMode) player.moveRight();
    if (keys[13] && game.demoMode) {
        game.reset();
        game.demoMode = false;
        ball.reset();
        player.reset();
    }

    currentTime = (new Date()).getTime();
    deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    player.updatePosition();

    if (ball.pos.y-ball.height/2 > canvas.height) {
        // player missed the ball
        soundLifeLost.play();
        ball.reset();
        player.reset();
        game.multiplier = 1;
        if (--game.lives == 0) game.reset();
    } else if (ball.pos.y-ball.height/2 <= 0) {
        // ball touched ceiling
        soundWallHit.play();
        ball.velocity.y = -ball.velocity.y;
    } else if (ball.pos.x-ball.width/2 <= 0 || ball.pos.x+ball.width/2 >= canvas.width) {
        // ball touched left or right wall
        soundWallHit.play();
        ball.velocity.x = -ball.velocity.x;
    }
    ball.pos.x += ball.velocity.x * deltaTime;
    ball.pos.y += ball.velocity.y * deltaTime;

    // detect ball collision with player
    if (collisionDetection(ball, player)) {
        soundPlayerHit.play();
        ball.velocity.x = ((ball.pos.x+ball.width/2) - (player.pos.x+player.width/2)) * 6;
        ball.velocity.y = -ball.velocity.y;
        game.multiplier = 1;
    }

    // detect ball collision with blocks
    game.blocks.forEach(function(block) {
        if (collisionDetection(ball, block)) {
            soundBlockHit.play();
            var i = game.blocks.indexOf(block);
            game.blocks.splice(i, 1);
            game.score += game.multiplier++;

            var side = collisionSide(ball, block);
            if (side == "top/bottom") {
                ball.velocity.y = -ball.velocity.y;
            } else {
                ball.velocity.x = -ball.velocity.x;
            }
        }
    });

    // check if level cleared
    if (game.blocks.length == 0) {
        game.blocks = generateLevel(++game.level);
        ball.reset();
        player.reset();
    }
    
    // draw background
    context.fillStyle = "#272822";
	context.fillRect(0, 0, canvas.width, canvas.height);

    // draw objects
    ball.draw();
    player.draw();
    game.blocks.forEach(function(block) {
        block.draw();
    });

    // draw text
    context.fillStyle = "rgba(255, 255, 255, 0.75)";
    context.font = "20px Georgia";
    context.textAlign = "left";
    context.fillText("Score: " + game.score, 10, 20);
    context.textAlign = "center";
    context.fillText("Level: " + game.level, canvas.width/2, 20);
    context.textAlign = "right";
    context.fillText("Lives: " + game.lives, canvas.width-10, 20);
    context.globalAlpha = 1;

    if (game.demoMode) {
        // AI
        if (ball.pos.y > canvas.height*0.3 && ball.pos.y < canvas.height*0.9) {
            if ((player.pos.x + player.width/2) - (ball.pos.x + ball.width/2) < 50) {
                player.moveRight();
            } else if ((player.pos.x + player.width/2) - (ball.pos.x + ball.width/2) > -50) {
                player.moveLeft();
            }
        }     

        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText("Press <enter> to start playing", canvas.width / 2, canvas.height / 2);
    }
    window.requestAnimationFrame(loop);
}

game.reset();
ball.reset();
player.reset();
soundPlayerHit = new sound("sounds/playerhit.wav");
soundBlockHit = new sound("sounds/blockhit.mp3");
soundWallHit = new sound("sounds/wallhit.wav");
soundLifeLost = new sound("sounds/lifelost.mp3");
loop();