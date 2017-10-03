class GameScene extends AbstractScene {
    constructor(canvas, dispatcher) {
        super(canvas, dispatcher);
        
        this.sound = {};
        this.initializeSounds();
        
        this.startAttractMode();
    }

    startAttractMode() {
        this.attractMode = true;
        this.score = 0;
        this.multiplier = 1;
        this.lives = 1;
        this.level = Math.floor(Math.random() * 3) + 1;

        this.ball = new Ball();
        this.player = new Player();
        this.blocks = this.generateLevel(this.level);
    }

    startGame() {
        this.attractMode = false;
        this.score = 0;
        this.multiplier = 1;
        this.lives = 3;
        this.level = 1;

        this.ball = new Ball();
        this.player = new Player();
        this.blocks = this.generateLevel(this.level);

        this.startTransition("Get Ready!", 1.5);
    }

    startTransition(message, duration) {
        this.dispatcher.changeScene(new TransitionScene(this.canvas, this.dispatcher, message, duration));
        setTimeout(() => {
            this.dispatcher.changeScene(this);
        }, duration * 1000);
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
            this.lives--;

            if (this.lives == 0) {
                this.startAttractMode();
                this.startTransition("Game Over", 3.5);
            } else if (this.lives == 1) {
                this.startTransition("Last life!", 1.5);
            } else {
                this.startTransition(this.lives + " lives left", 1.5);
            }
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
                this.blocks = this.generateLevel(++this.level);
                this.ball = new Ball();
                this.player = new Player();

                this.startTransition("Level " + this.level, 2);
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
        this.context.fillStyle = "#272822";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw objects
        this.ball.draw(this.canvas);
        this.player.draw(this.canvas);
        this.blocks.forEach((block)=> {
            block.draw(this.canvas);
        });

        // draw text
        if (this.attractMode) {
            this.context.fillStyle = "rgba(0, 0, 0, 0.75)";
            this.context.fillRect(this.canvas.width/2-140, this.canvas.height*3/4-20, 280, 28);
            this.context.fillStyle = "white";
            this.context.font = "20px Georgia";
            this.context.textAlign = "center";
            this.context.fillText("Press <enter> to start playing", this.canvas.width / 2, this.canvas.height * 3/4);
        } else {
            this.context.fillStyle = "rgba(255, 255, 255, 0.75)";
            this.context.font = "20px Georgia";
            this.context.textAlign = "left";
            this.context.fillText("Score: " + this.score, 10, 20);
            this.context.textAlign = "center";
            this.context.fillText("Level: " + this.level, this.canvas.width/2, 20);
            this.context.textAlign = "right";
            this.context.fillText("Lives: " + this.lives, this.canvas.width-10, 20);
            this.context.globalAlpha = 1;
        }
    }

    generateLevel(level) {
        const blocks = [];
        const colors = ["#F92672", "#66D9EF", "#A6E22E", "#FD971F", "#AE81FF", "#FFE792", "#FFE792"];
        if (level == 1) {
            for (let row = 0; row < 7; row++) {
                for (let col = 0; col < 8; col++) {
                    blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
                }
            }
        } else if (level == 2) {
            for (let row = 0; row < 3; row++) {
                for (let col = 1; col < 7; col++) {
                    blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
                }
            }

            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 8; col++) {
                    if (col == 2 || col == 5) continue;
                    blocks.push(new Block(2+col*60, 160+row*20, 58, 16, colors[row]));
                }
            }

            for (let col = 0; col < 8; col++) {
                blocks.push(new Block(2+col*60, 240, 58, 16, "grey", 2));
            }
        } else if (level == 3) {
            blocks.push(new Block(60, 60, 16, 196, "grey", 2));
            blocks.push(new Block(this.canvas.width-76, 60, 16, 196, "grey", 2));

            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 6; col++) {
                    blocks.push(new Block(80+col*54, 60+row*20, 50, 16, colors[row]));
                }
            }
            for (let row = 0; row < 4; row++) {
                blocks.push(new Block(80, 120+row*20, 50, 16, colors[2]));
                blocks.push(new Block(this.canvas.width-130, 120+row*20, 50, 16, colors[2]));
            }

            for (let col = 0; col < 2; col++) {
                blocks.push(new Block(134+col*108, 120, 104, 76, colors[5]));
            }

            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 6; col++) {
                    blocks.push(new Block(80+col*54, 200+row*20, 50, 16, colors[2-row]));
                }
            }

            for (let col = 0; col < 6; col++) {
                blocks.push(new Block(80+col*54, 260, 50, 16, "grey", 2));
            }
        } else {
            // simple random level
            for (let row = 0; row < 7; row++) {
                for (let col = 0; col < 8; col++) {
                    if (Math.random() >= 0.5) continue;
                    blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
                }
            }
        }
        return blocks;
    }
}
