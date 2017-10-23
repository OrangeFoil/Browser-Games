class Game {
    constructor() {
        this.maze = new Maze();
        this.maze.generate();
        this.mazeCanvasBuffer = document.createElement('canvas');
        this.mazeCanvasBuffer.width = canvas.width;
        this.mazeCanvasBuffer.height = canvas.height;
        this.maze.draw(this.mazeCanvasBuffer);

        this.player = new Player(this.maze);
        keyboard.addMapping("ArrowUp", () => { this.player.moveUp(); });
        keyboard.addMapping("ArrowDown", () => { this.player.moveDown(); });
        keyboard.addMapping("ArrowLeft", () => { this.player.moveLeft(); });
        keyboard.addMapping("ArrowRight", () => { this.player.moveRight(); });
    }

    draw() {
        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);
        this.player.draw();
        context.drawImage(this.mazeCanvasBuffer, 0 , 0);
    }

    start() {
        this.accumulator = 0;
        this.step = 1/60;
        let lastTime = null;
        this.frameCallback = (timestamp) => {
            if (lastTime !== null) {
                this.accumulator += (timestamp - lastTime) / 1000;
                while (this.accumulator >= this.step) {
                    // doing nothing useful here atm
                    this.accumulator -= this.step;
                }
                this.draw();
            }
            lastTime = timestamp;
            requestAnimationFrame(this.frameCallback);
        };
        requestAnimationFrame(this.frameCallback);
    }
}