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
                }
            });
        });

        app.stage.addChild(this.graphics);

        // clear snake
        app.stage.removeChild(this.containerSnake);
        this.containerSnake = new PIXI.Container();

        const trace = this.player.trace;

        // snake head
        var spriteSnakeHead = new PIXI.Sprite(this.spriteTextureSnakeHead);
        spriteSnakeHead.anchor.set(0.5);
        spriteSnakeHead.position.set(trace[trace.length-1].x*16+8, trace[trace.length-1].y*16+8);
        if (this.player.heading == "right") spriteSnakeHead.rotation = 0.5 * Math.PI;
        if (this.player.heading == "down") spriteSnakeHead.rotation = 1.0 * Math.PI;
        if (this.player.heading == "left") spriteSnakeHead.rotation = 1.5 * Math.PI;
        this.containerSnake.addChild(spriteSnakeHead);

        // snake body
        for (let i = 1; i < trace.length-1; i++) {
            if (trace[i-1].x == trace[i+1].x || trace[i-1].y == trace[i+1].y) {
                var spriteSnakeBodyStraight = new PIXI.Sprite(this.spriteTextureSnakeBodyStraight);
                spriteSnakeBodyStraight.anchor.set(0.5);
                spriteSnakeBodyStraight.position.set(trace[i].x*16+8, trace[i].y*16+8);
                if (trace[i-1].x - trace[i+1].x == -2) spriteSnakeBodyStraight.rotation = 0.5 * Math.PI;
                else if (trace[i-1].y - trace[i+1].y == -2) spriteSnakeBodyStraight.rotation = 1.0 * Math.PI;
                else if (trace[i-1].x - trace[i+1].x == 2) spriteSnakeBodyStraight.rotation = 1.5 * Math.PI;
                this.containerSnake.addChild(spriteSnakeBodyStraight);
            } else {
                if (trace[i-1].y == trace[i].y+1 && trace[i].x-1 == trace[i+1].x) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyLeft);
                } else if (trace[i-1].x == trace[i].x-1 && trace[i].y-1 == trace[i+1].y) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyLeft);
                    spriteSnakeBody.rotation = 0.5 * Math.PI;
                } else if (trace[i-1].y == trace[i].y-1 && trace[i].x+1 == trace[i+1].x) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyLeft);
                    spriteSnakeBody.rotation = 1.0 * Math.PI;
                } else if (trace[i-1].x == trace[i].x+1 && trace[i].y+1 == trace[i+1].y) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyLeft);
                    spriteSnakeBody.rotation = 1.5 * Math.PI;
                } else if (trace[i-1].y == trace[i].y+1 && trace[i].x+1 == trace[i+1].x) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyRight);
                } else if (trace[i-1].x == trace[i].x-1 && trace[i].y+1 == trace[i+1].y) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyRight);
                    spriteSnakeBody.rotation = 0.5 * Math.PI;
                } else if (trace[i-1].y == trace[i].y-1 && trace[i].x-1 == trace[i+1].x) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyRight);
                    spriteSnakeBody.rotation = 1.0 * Math.PI;
                } else if (trace[i-1].x == trace[i].x+1 && trace[i].y-1 == trace[i+1].y) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyRight);
                    spriteSnakeBody.rotation = 1.5 * Math.PI;
                }
                spriteSnakeBody.anchor.set(0.5);
                spriteSnakeBody.position.set(trace[i].x*16+8, trace[i].y*16+8);
                this.containerSnake.addChild(spriteSnakeBody);    
            }

            
        }

        // snake tail
        if (trace.length > 1) {
            var spriteSnakeTail = new PIXI.Sprite(this.spriteTextureSnakeTail);
            spriteSnakeTail.anchor.set(0.5);
            spriteSnakeTail.position.set(trace[0].x*16+8, trace[0].y*16+8);
            if (trace[0].x - trace[1].x == -1) spriteSnakeTail.rotation = 0.5 * Math.PI;
            else if (trace[0].y - trace[1].y == -1) spriteSnakeTail.rotation = 1.0 * Math.PI;
            else if (trace[0].x - trace[1].x == 1) spriteSnakeTail.rotation = 1.5 * Math.PI;
            this.containerSnake.addChild(spriteSnakeTail);
        }
        

        app.stage.addChild(this.containerSnake);
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

        var spriteTextureApple = new PIXI.Texture(spritesheet, new PIXI.Rectangle(32, 16, 16, 16));
        var spriteTextureMagicApple = new PIXI.Texture(spritesheet, new PIXI.Rectangle(48, 16, 16, 16));
        this.spriteTextureSnakeHead = new PIXI.Texture(spritesheet, new PIXI.Rectangle(0, 0, 16, 16));
        this.spriteTextureSnakeBodyStraight = new PIXI.Texture(spritesheet, new PIXI.Rectangle(16, 0, 16, 16));
        this.spriteTextureSnakeBodyLeft = new PIXI.Texture(spritesheet, new PIXI.Rectangle(32, 0, 16, 16));
        this.spriteTextureSnakeBodyRight = new PIXI.Texture(spritesheet, new PIXI.Rectangle(48, 0, 16, 16));
        this.spriteTextureSnakeTail = new PIXI.Texture(spritesheet, new PIXI.Rectangle(0, 16, 16, 16));

        this.spriteApple = new PIXI.Sprite(spriteTextureApple);
        this.spriteMagicApple = new PIXI.Sprite(spriteTextureMagicApple);
        
        this.containerSnake = new PIXI.Container();
        
        app.stage.addChild(this.spriteApple);
        app.stage.addChild(this.spriteMagicApple);
        app.stage.addChild(this.containerSnake);
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
