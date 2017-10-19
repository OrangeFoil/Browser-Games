class Game {
    constructor() {
        this.accumulator = 0; // how many milliseconds have passed since last frame was rendered
        this.inputs = [];
        this.graphics = new PIXI.Graphics();
        this.arenaSize = 31;

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
                if (value == 3) {
                    // wall
                    this.graphics.beginFill(0xA0A0A0, 1);
                    this.graphics.drawRect(x*16, y*16, 16, 16);
                }
            });
        });

        app.stage.addChild(this.graphics);

        this.apple.draw();
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
        this.apple = new Apple();
        this.snake = new Snake();
        this.time = 0;
        this.score = 0;
        this.speed = 1.0;
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
            this.apple.kill();
            this.reset();
            return;
        }
        if (this.apple.x == head.x && this.apple.y == head.y) {
            if (this.apple.magic) {
                this.speed += 0.1;
            }

            this.snake.length++;
            this.score += this.speed * 10;
            this.apple.kill();
            this.apple = new Apple();
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
