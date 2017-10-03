class Game {
    constructor(canvas) {
        this.canvas = canvas;

        this.sound = {};
        this.initializeSounds();
        
        this.startAttractMode();

        this.accumulator = 0;
        this.step = 1/360;
        let lastTime = null;
        this._frameCallback = (timestamp) => {
            if (lastTime !== null) {
                this.accumulator += (timestamp - lastTime) / 1000;
                while (this.accumulator >= this.step) {
                    this.processInput();
                    this.simulate(this.step);
                    this.accumulator -= this.step;
                }
                this.render();
            }
            lastTime = timestamp;
            requestAnimationFrame(this._frameCallback);
        };
        requestAnimationFrame(this._frameCallback);
    }

    startAttractMode() {
        this.attractMode = true;
        this.score = 0;
        this.multiplier = 1;
        this.lives = 1;
        this.level = Math.floor(Math.random() * 3) + 1;

        this.ball = new Ball();
        this.player = new Player();
        this.blocks = generateLevel(this.level);
    }

    startGame() {
        this.attractMode = false;
        this.score = 0;
        this.multiplier = 1;
        this.lives = 3;
        this.level = 1;

        this.ball = new Ball();
        this.player = new Player();
        this.blocks = generateLevel(this.level);
    }

    initializeSounds() {
        this.sound["PlayerHit"] = new sound("sounds/playerhit.wav");
        this.sound["BlockHit"] = new sound("sounds/blockhit.mp3");
        this.sound["WallHit"] = new sound("sounds/wallhit.wav");
        this.sound["LifeLost"] = new sound("sounds/lifelost.mp3");
    }

    processInput() {
        if ((keys[37] || touch == "left") && !this.attractMode) {
            this.player.moveLeft();
        }
        if ((keys[39] || touch == "right") && !this.attractMode) {
            this.player.moveRight();
        }
        if ((keys[13] || touch != "") && this.attractMode) {
            this.startGame();
            this.ball = new Ball();
            this.player = new Player();
        }
        if (keys[27] && !this.attractMode) {
            this.startAttractMode();
        }
    }
    
    simulate(deltaTime) {
        this.player.update(deltaTime);

        if (this.ball.pos.y-this.ball.height/2 > this.canvas.height) {
            // player missed the ball
            this.sound["LifeLost"].play();
            this.ball = new Ball();
            this.player = new Player();
            this.multiplier = 1;
            if (--this.lives == 0) this.startAttractMode(); // fix me
        } else if (this.ball.pos.y-this.ball.height/2 <= 0) {
            // ball touched ceiling
            this.sound["WallHit"].play();
            this.ball.velocity.y = -this.ball.velocity.y;
        } else if (this.ball.pos.x-this.ball.width/2 <= 0 || this.ball.pos.x+this.ball.width/2 >= this.canvas.width) {
            // ball touched left or right wall
            this.sound["WallHit"].play();
            this.ball.velocity.x = -this.ball.velocity.x;
        }
        this.ball.pos.x += this.ball.velocity.x * deltaTime;
        this.ball.pos.y += this.ball.velocity.y * deltaTime;

        // detect ball collision with player
        if (this.ball.collisionDetection(this.player)) {
            this.sound["PlayerHit"].play();
            if (this.ball.collisionSide(this.player) == "top/bottom") {
                this.ball.velocity.x = ((this.ball.pos.x+this.ball.width/2) - (this.player.pos.x+this.player.width/2)) * 6;
                this.ball.velocity.y = -this.ball.velocity.y;
            } else {
                this.ball.velocity.x *= -1; 
            }
            this.multiplier = 1;
        }

        // detect ball collision with blocks
        this.blocks.forEach((block)=> {
            if (this.ball.collisionDetection(block)) {
                this.sound["BlockHit"].play();
                this.score += this.multiplier++;
                
                var health = block.damage();
                if (health <= 0) {
                    var i = this.blocks.indexOf(block);
                    this.blocks.splice(i, 1);
                }

                var side = this.ball.collisionSide(block);
                if (side == "top/bottom") {
                    this.ball.velocity.y = -this.ball.velocity.y;
                } else {
                    this.ball.velocity.x = -this.ball.velocity.x;
                }
            }
        });

        // check if level cleared
        if (this.blocks.length == 0) {
            if (this.attractMode) {
                // restart attract mode
                this.startAttractMode();
            } else {
                // move to next level
                this.blocks = generateLevel(++this.level);
                this.ball = new Ball();
                this.player = new Player();
            }
        }

        // AI
        if (this.attractMode) {
            if (this.ball.pos.y > this.canvas.height*0.3 && this.ball.pos.y < this.canvas.height*0.9) {
                if ((this.player.pos.x + this.player.width/2) - (this.ball.pos.x + this.ball.width/2) < 50) {
                    this.player.moveRight();
                } else if ((this.player.pos.x + this.player.width/2) - (this.ball.pos.x + this.ball.width/2) > -50) {
                    this.player.moveLeft();
                }
            }
        }
    }

    render() {
        // draw background
        context.fillStyle = "#272822";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // draw objects
        this.ball.draw();
        this.player.draw();
        this.blocks.forEach(function(block) {
            block.draw();
        });

        // draw text
        if (this.attractMode) {
            context.fillStyle = "rgba(0, 0, 0, 0.75)";
            context.fillRect(canvas.width/2-140, canvas.height*3/4-20, 280, 28);
            context.fillStyle = "white";
            context.font = "20px Georgia";
            context.textAlign = "center";
            context.fillText("Press <enter> to start playing", canvas.width / 2, canvas.height * 3/4);
        } else {
            context.fillStyle = "rgba(255, 255, 255, 0.75)";
            context.font = "20px Georgia";
            context.textAlign = "left";
            context.fillText("Score: " + this.score, 10, 20);
            context.textAlign = "center";
            context.fillText("Level: " + this.level, canvas.width/2, 20);
            context.textAlign = "right";
            context.fillText("Lives: " + this.lives, canvas.width-10, 20);
            context.globalAlpha = 1;
        }
    }
}
