class Player {
    constructor(maze) {
        this.maze = maze;
        this.x = 0;
        this.y = Math.floor(this.maze.height/2);
        this.trace = [];
    }

    get occupiedNode() {
        return this.maze.getNode(this.x, this.y);
    }

    draw() {
        const context = canvas.getContext("2d");

        var x, y;
        const width = Math.floor(this.maze.nodeWidth);
        const height = Math.floor(this.maze.nodeHeight);

        // trace
        context.fillStyle="#434e27";
        for (var i in this.trace) {
            x = Math.floor(this.trace[i].x * width);
            y = Math.floor(this.trace[i].y * height);
            context.fillRect(x, y, width, height);
        }

        // mouse
        context.fillStyle="#2b187e";

        x = Math.floor(this.x * width);
        y = Math.floor(this.y * height);

        context.fillRect(x, y, width, height);
    }

    moveUp() {
        this.trace.push({x: this.x, y: this.y});
        if(!this.occupiedNode.walls.top) {
            this.y--;
        }
    }

    moveDown() {
        if(!this.occupiedNode.walls.bottom) {
            this.trace.push({x: this.x, y: this.y});
            this.y++;
        }
    }

    moveLeft() {
        if(!this.occupiedNode.walls.left) {
            this.trace.push({x: this.x, y: this.y});
            this.x--;
        }
    }

    moveRight() {
        if(!this.occupiedNode.walls.right) {
            this.trace.push({x: this.x, y: this.y});
            this.x++;
        }
    }
}