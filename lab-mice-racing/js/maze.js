class Maze {
    constructor() {
        this.width = 20;
        this.height = 15;
        this.nodes = undefined;
    }
    
    draw(canvas) {
        const context = canvas.getContext("2d");
        this.nodes.forEach((node) => {
            node.draw(context, this.nodeWidth, this.nodeHeight);
        });
        
    }

    generate() {
        // initialise nodes
        this.nodes = [];
        for (let i = 0; i < this.width * this.height; i++) {
            const node = new Node(i % this.width, Math.floor(i / this.width));
            this.nodes.push(node);
        }

        // choose random starting node
        const x = Math.floor(this.width * Math.random());
        const y = Math.floor(this.height * Math.random());
        let current = this.getNode(x, y);
        current.visited = true;

        // depth-first search backtracking algorithm
        let nodeStack = [];
        do {
            const neighbour = this.getUnvisitedNeighbour(current.x, current.y);
            if (neighbour != null) {
                current.removeWallsTo(neighbour);
                nodeStack.push(current);
                current = neighbour;
                current.visited = true;
            } else if (nodeStack.length > 0) {
                current = nodeStack.pop();
            }
        } while (nodeStack.length > 0);
    }

    getNode(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return undefined;
        }

        return this.nodes[x + y * this.width];
    }

    get nodeWidth() {
        return Math.floor(canvas.width / this.width);
    }


    get nodeHeight() {
        return Math.floor(canvas.height / this.height); 
    }

    getUnvisitedNeighbour(x, y) {
        let unvisited = [];
        
        if (y > 0 && !this.getNode(x, y-1).visited) {
            unvisited.push(this.getNode(x, y-1));
        }
        if (y < this.height-1 && !this.getNode(x, y+1).visited) {
            unvisited.push(this.getNode(x, y+1));
        }
        if (x > 0 && !this.getNode(x-1, y).visited) {
            unvisited.push(this.getNode(x-1, y));
        }
        if (x < this.width-1 && !this.getNode(x+1, y).visited) {
            unvisited.push(this.getNode(x+1, y));
        }

        if (unvisited.length == 0) {
            return null;
        }

        const random = Math.floor(unvisited.length * Math.random());
        return unvisited[random];
    }
}