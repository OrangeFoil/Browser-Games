/** Game logic */
class GameScene extends AbstractScene {
    constructor(canvas, dispatcher) {
        super(canvas, dispatcher);
        
        this.sound = {};
        this.initializeSounds();

        this.blocksCanvasBuffer = document.createElement('canvas');
        this.blocksCanvasBuffer.width = this.canvas.width;
        this.blocksCanvasBuffer.height = this.canvas.height;
        
        this.startAttractMode();
    }

    startAttractMode() {
        this.attractMode = true;
        this.score = 0;
        this.multiplier = 1;
        this.lives = 1;
        this.level = Math.floor(Math.random() * LevelGenerator.numLevels()) + 1;

        this.ball = new Ball();
        this.player = new Player();
        this.blocks = LevelGenerator.getLevel(this.level);
        this.redrawBlocksCanvasBuffer();
    }

    startGame() {
        this.attractMode = false;
        this.score = 0;
        this.multiplier = 1;
        this.lives = 3;
        this.level = 1;

        this.ball = new Ball();
        this.player = new Player();
        this.blocks = LevelGenerator.getLevel(this.level);
        this.redrawBlocksCanvasBuffer();

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
        if ((keyboard.isPressed("ArrowLeft") || touchscreen.action == "left") && !this.attractMode) {
            this.player.moveLeft();
        }
        if ((keyboard.isPressed("ArrowRight") || touchscreen.action == "right") && !this.attractMode) {
            this.player.moveRight();
        }
        if ((keyboard.isPressed("Enter") || touchscreen.action != "") && this.attractMode) {
            this.startGame();
            this.ball = new Ball();
            this.player = new Player();
        }
        if (keyboard.isPressed("Escape") && !this.attractMode) {
            this.startAttractMode();
        }
    }
    
    simulate(deltaTime) {
        this.player.update(deltaTime);

        if (this.ball.top > this.canvas.height) {
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
        } else if (this.ball.top <= 0) {
            // ball touched ceiling
            this.sound["WallHit"].play();
            this.ball.velocity.y = -this.ball.velocity.y;
        } else if (this.ball.left <= 0 || this.ball.right >= this.canvas.width) {
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
                this.ball.velocity.x = ((this.ball.right) - (this.player.pos.x+this.player.width/2)) * 6;
                this.ball.velocity.y = -this.ball.velocity.y;
            } else {
                this.ball.velocity.x *= -1; 
            }
            this.ball.unclipY(this.player);
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
                this.redrawBlocksCanvasBuffer();

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
                this.blocks = LevelGenerator.getLevel(++this.level);
                this.redrawBlocksCanvasBuffer();
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

    redrawBlocksCanvasBuffer() {
        // clear buffer
        const blockContext = this.blocksCanvasBuffer.getContext("2d");
        blockContext.clearRect(0, 0, this.blocksCanvasBuffer.width, this.blocksCanvasBuffer.height);

        // redraw blocks to buffer
        this.blocks.forEach((block)=> {
            block.draw(this.blocksCanvasBuffer);
        });
    }

    render() {
        // draw background
        this.context.fillStyle = "#272822";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw ball and player
        this.ball.draw(this.canvas);
        this.player.draw(this.canvas);

        // draw blocks buffer
        this.context.drawImage(this.blocksCanvasBuffer, 0 , 0);
        

        // draw text
        if (this.attractMode) {
            this.context.font = "20px Georgia";
            this.context.textAlign = "center";
            var text = "Press <enter> to start playing";
            var textsize = this.context.measureText(text);

            this.context.fillStyle = "rgba(0, 0, 0, 0.75)";
            this.context.fillRect(
                this.canvas.width/2 - textsize.width/2 - 10,
                this.canvas.height*3/4 - 20,
                textsize.width + 20,
                30
            );
            
            this.context.fillStyle = "white";
            this.context.fillText(text, this.canvas.width / 2, this.canvas.height * 3/4);
            //this.context.strokeText(text, this.canvas.width / 2, this.canvas.height * 3/4);
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
}
