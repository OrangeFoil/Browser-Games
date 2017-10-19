class Game {
    constructor() {
        this.accumulator = 0; // how many milliseconds have passed since last frame was rendered
        this.inputs = [];
        this.graphics = new PIXI.Graphics();
        this.arenaSize = 31;
        this.loadTextures();

         // textbox
         const textBackground = new PIXI.Graphics();
         textBackground.beginFill(0x202020, 1);
         textBackground.drawRect(496, 0, 616-496, 496);
         app.stage.addChild(textBackground);

         var textStyle = new PIXI.TextStyle({
            align: 'right',
            fontFamily: 'Arial',
            fontSize: 24,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440
        });
        this.text = new PIXI.Text("", textStyle);
        this.text.anchor.x = 1;
        this.text.x = 600;
        this.text.y = 16;
        app.stage.addChild(this.text);
    }

    draw() {
        this.graphics.clear();

        this.arena.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) {
                    // apple
                    this.spriteApple.visible = true;
                    this.spriteMagicApple.visible = false;
                    this.spriteApple.position.set(x*16, y*16);
                } else if (value == 2) {
                    // magic apple
                    this.spriteApple.visible = false;
                    this.spriteMagicApple.visible = true;
                    this.spriteMagicApple.position.set(x*16, y*16);
                } else if (value == 3) {
                    // wall
                    this.graphics.beginFill(0xA0A0A0, 1);
                    this.graphics.drawRect(x*16, y*16, 16, 16);
                }
            });
        });

        app.stage.addChild(this.graphics);

        this.snake.draw();

        // text
        this.text.text = "Time\n" + Math.floor(this.time / 60) + ":" + Math.floor(this.time % 60).toLocaleString("en-GB", {minimumIntegerDigits: 2}) + "\n\n"
                         + "Score\n" + Math.floor(this.score) + "\n\n"
                         + "Speed\n" +this.speed.toLocaleString("en-GB", {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "x\n\n"
                         + "Length\n" + this.snake.trace.length;
    }

    getInterval() {
        return 250 * (1 / (this.speed));
    }

    generateArena() {
        // empty arena
        var arena = new Array(this.arenaSize);
        for (let y = 0; y < this.arenaSize; y++) {
            arena[y] = new Array(this.arenaSize);
            arena[y].fill(0);
        }

        // walls
        for (let i = 0; i < this.arenaSize; i++) {
            if (i == 15) continue;
            arena[0][i] = 3;
            arena[30][i] = 3;
            arena[i][0] = 3;
            arena[i][30] = 3;
        }

        return arena;
    }

    loadTextures() {
        var spritesheet = PIXI.BaseTexture.fromImage("assets/tileset.png");

        var spriteTextureApple = new PIXI.Texture(spritesheet, new PIXI.Rectangle(32, 16, 16, 16));
        var spriteTextureMagicApple = new PIXI.Texture(spritesheet, new PIXI.Rectangle(48, 16, 16, 16));

        this.spriteApple = new PIXI.Sprite(spriteTextureApple);
        this.spriteMagicApple = new PIXI.Sprite(spriteTextureMagicApple);
        
        app.stage.addChild(this.spriteApple);
        app.stage.addChild(this.spriteMagicApple);
    }

    parseInput() {
        // ignore inputs in the same direction
        while (this.inputs[0] == this.snake.heading) {
            this.inputs.shift();
        }

        // ignore inputs into opposite direction
        while (this.inputs[0] == "down" && this.snake.heading == "up") {
            this.inputs.shift();
        }
        while (this.inputs[0] == "up" && this.snake.heading == "down") {
            this.inputs.shift();
        }
        while (this.inputs[0] == "left" && this.snake.heading == "right") {
            this.inputs.shift();
        }
        while (this.inputs[0] == "right" && this.snake.heading == "left") {
            this.inputs.shift();
        }

        // no input
        if (this.inputs.length == 0) {
            return this.snake.heading;
        }

        var input = this.inputs[0];
        this.inputs.shift();
        return input;
    }

    reset() {
        this.arena = this.generateArena();
        this.arena[15][15] = 4;
        this.snake = new Snake();
        this.time = 0;
        this.score = 0;
        this.speed = 1.0;
        this.spawnApple();
    }

    spawnApple() {
        var x, y;
        do {
            x = Math.floor(Math.random() * this.arenaSize);
            y = Math.floor(Math.random() * this.arenaSize);
        } while (this.arena[y][x] != 0);

        if (Math.random() > 0.5) {
            // regular apple
            this.arena[y][x] = 1;
        } else {
            // magic apple
            this.arena[y][x] = 2;

            setTimeout(() => {
                if (this.arena[y][x] == 2) {
                    this.arena[y][x] = 1;
                }
            }, this.getInterval() * 20);
        }
    }

    step() {
        // determine where the head of the snake is
        var head = this.snake.head;

        // determine next position of the snake head
        this.snake.heading = this.parseInput();
        if (this.snake.heading == "") {
            return;
        } else if (this.snake.heading == "up") {
            head.y--;
        } else if (this.snake.heading == "down") {
            head.y++;
        } else if (this.snake.heading == "left") {
            head.x--;
        } else if (this.snake.heading == "right") {
            head.x++;
        }

        // wrap around
        head.x %= this.arenaSize;
        head.y %= this.arenaSize;
        if (head.x < 0) head.x += this.arenaSize;
        if (head.y < 0) head.y += this.arenaSize;

        // collision detection
        if (this.arena[head.y][head.x] >= 3) {
            // wall or self
            this.snake.clear();
            this.reset();
            return;
        }
        if (this.arena[head.y][head.x] == 2) {
            // magic apple
            this.speed += 0.1;
        }
        if (this.arena[head.y][head.x] == 1 || this.arena[head.y][head.x] == 2) {
            // apple or magic apple
            this.snake.length++;
            this.score += this.speed * 10;
            this.arena[head.y][head.x] = 0;
            this.spawnApple();
        }
    
        // add new snake head to array
        this.snake.trace.push(head);
        this.arena[head.y][head.x] = 4;

        // remove snake tail from array
        if (this.snake.trace.length > this.snake.length) {
            const tail = this.snake.trace.shift();
            this.arena[tail.y][tail.x] = 0;
        }
    }

    tick(elapsedTime) {
        this.accumulator += elapsedTime;
        this.time += elapsedTime / 1000;
        
            while (this.accumulator >= this.getInterval()) {
                game.step();
                this.accumulator -= this.getInterval();
            }
        
            game.draw();
            app.renderer.render(app.stage);
    }
}
