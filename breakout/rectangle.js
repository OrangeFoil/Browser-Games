/** Generic rectangles */
class Rectangle {
    constructor(x, y, width, height, color="#FFF") {
        this.pos = { x: x, y: y};
        this.width = width;
        this.height = height;
        this.color = color;
    }

    get left() {
        return this.pos.x;
    }

    set left(x) {
        this.pos.x = x;
    }

    get right() {
        return this.pos.x + this.width;
    }

    set right(x) {
        this.pos.x = x - this.width;
    }

    get top() {
        return this.pos.y;
    }
    
    set top(y) {
            this.pos.y = y;
    }

    get bottom() {
        return this.pos.y + this.height;
    }
    
    set bottom(y) {
            this.pos.y = y - this.height;
    }

    collisionDetection(object) {
        if (this.left < object.right &&
            this.right > object.left &&
            this.top < object.bottom &&
            this.bottom > object.top) {
            return true;
        }
        return false;
    }

    // returns whether object was hit from top/bottom or left/right
    collisionSide(object) {
        const intersectionVertical = this.height + object.height - Math.abs(this.top-object.top) - Math.abs(this.bottom-object.bottom);
        const intersectionHorizontal = this.width + object.width - Math.abs(this.left-object.left) - Math.abs(this.right-object.right);

        if (intersectionVertical <= intersectionHorizontal) {
            return "top/bottom";
        } else {
            return "left/right";
        }
        return "";
    }

    draw(canvas) {
        const context = canvas.getContext("2d");

        context.save();

        context.shadowBlur = 10;
        context.shadowColor = "black";
        context.fillStyle = this.color;
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.strokeRect(this.pos.x+0.5, this.pos.y+0.5, this.width-1, this.height-1);

        context.restore();
    }
}
