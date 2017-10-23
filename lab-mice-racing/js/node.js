class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = {
            top: true,
            bottom: true,
            left: true,
            right: true,
        };
        this.visited = false;
    }

    draw(context, nodeWidth, nodeHeight) {
        context.strokeStyle = '#a4a4a4';
        context.fillStyle="#434e27";
        context.beginPath();

        if (!this.visited) {
            context.fillRect(this.x * nodeWidth, this.y * nodeHeight, nodeWidth, nodeHeight);
        }

        if (this.walls.top) {
            context.moveTo(this.x * nodeWidth, this.y * nodeHeight);
            context.lineTo((this.x + 1) * nodeWidth, this.y * nodeHeight);
        }

        if (this.walls.bottom) {
            context.moveTo(this.x * nodeWidth, (this.y+1) * nodeHeight);
            context.lineTo((this.x + 1) * nodeWidth, (this.y+1) * nodeHeight);
        }

        if (this.walls.left) {
            context.moveTo(this.x * nodeWidth, this.y * nodeHeight);
            context.lineTo(this.x * nodeWidth, (this.y+1) * nodeHeight);
        }

        if (this.walls.right) {
            context.moveTo((this.x+1) * nodeWidth, this.y * nodeHeight);
            context.lineTo((this.x+1) * nodeWidth, (this.y+1) * nodeHeight);
        }

        context.stroke();
    }

    removeWallsTo(neighbour) {
        // not a neighbour
        if (Math.abs(this.x - neighbour.x) + Math.abs(this.y - neighbour.y) != 1) {
            return;
        }

        // neighbour is above
        if (this.y - neighbour.y == 1) {
            this.walls.top = false;
            neighbour.walls.bottom = false;
            return;
        }
        
        // neighbour is below
        if(this.y - neighbour.y == -1) {
            this.walls.bottom = false;
            neighbour.walls.top = false;
            return;
        }

        // neighbour is left
        if (this.x - neighbour.x == 1) {
            this.walls.left = false;
            neighbour.walls.right = false;
            return;
        }

        // neighbour is right
        if (this.x - neighbour.x == -1) {
            this.walls.right = false;
            neighbour.walls.left = false;
            return;
        }
    }
}