class Game {
    constructor() {
        this.accumulator = 0; // how many milliseconds have passed since last frame was rendered
        this.inputs = [];
        this.graphics = new PIXI.Graphics();
        this.arenaSize = 31;
        this.reset();
        this.loadTextures();
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
                } else if (value == 4) {
                    // player
                    this.graphics.beginFill(0xFFFFFF, 1);
                    this.graphics.drawRect(x*16, y*16, 16, 16);
                }
            });
        });

        app.stage.addChild(this.graphics);
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

    increaseSpeed() {
        this.interval *= 0.9;
    }

    loadTextures() {
        var spritesheet = PIXI.BaseTexture.fromImage("assets/tileset.png");

        var spriteTextureApple = new PIXI.Texture(spritesheet, new PIXI.Rectangle(32, 48, 16, 16));
        var spriteTextureMagicApple = new PIXI.Texture(spritesheet, new PIXI.Rectangle(48, 48, 16, 16));

        this.spriteApple = new PIXI.Sprite(spriteTextureApple);
        this.spriteMagicApple = new PIXI.Sprite(spriteTextureMagicApple);
        
        app.stage.addChild(this.spriteApple);
        app.stage.addChild(this.spriteMagicApple);
    }

    parseInput() {
        // ignore inputs in the same direction
        while (this.inputs[0] == this.player.heading) {
            this.inputs.shift();
        }

        // ignore inputs into opposite direction
        while (this.inputs[0] == "down" && this.player.heading == "up") {
            this.inputs.shift();
        }
        while (this.inputs[0] == "up" && this.player.heading == "down") {
            this.inputs.shift();
        }
        while (this.inputs[0] == "left" && this.player.heading == "right") {
            this.inputs.shift();
        }
        while (this.inputs[0] == "right" && this.player.heading == "left") {
            this.inputs.shift();
        }

        // no input
        if (this.inputs.length == 0) {
            return this.player.heading;
        }

        var input = this.inputs[0];
        this.inputs.shift();
        return input;
    }

    reset() {
        this.interval = 250; // interval at which the snake moves
        this.arena = this.generateArena();
        this.arena[15][15] = 4;
        this.player = {
            length: 5,
            trace: [{x: 15, y: 15}],
            heading: "",
        }
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
            }, this.interval * 20);
        }
    }

    step() {
        // determine where the head of the snake is
            var head = {
            x: this.player.trace[this.player.trace.length - 1].x,
            y: this.player.trace[this.player.trace.length - 1].y,
        };

        // determine next position of the snake head
        this.player.heading = this.parseInput();
        if (this.player.heading == "") {
            return;
        } else if (this.player.heading == "up") {
            head.y--;
        } else if (this.player.heading == "down") {
            head.y++;
        } else if (this.player.heading == "left") {
            head.x--;
        } else if (this.player.heading == "right") {
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
            this.reset();
            return;
        }
        if (this.arena[head.y][head.x] == 2) {
            // magic apple
            this.increaseSpeed();
        }
        if (this.arena[head.y][head.x] == 1 || this.arena[head.y][head.x] == 2) {
            // apple or magic apple
            this.player.length++;
            this.arena[head.y][head.x] = 0;
            this.spawnApple();
        }
    
        // add new snake head to array
        this.player.trace.push(head);
        this.arena[head.y][head.x] = 4;

        // remove snake tail from array
        if (this.player.trace.length > this.player.length) {
            const tail = this.player.trace.shift();
            this.arena[tail.y][tail.x] = 0;
        }
        
    }

    tick(elapsedTime) {
        this.accumulator += elapsedTime;
        
            while (this.accumulator >= this.interval) {
                game.step();
                this.accumulator -= this.interval;
            }
        
            game.draw();
            app.renderer.render(app.stage);
    }
}
