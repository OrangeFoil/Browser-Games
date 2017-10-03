class Block extends Rectangle {
    constructor(x, y, width, height, color="#FFE792", health=1) {
        super(x, y, width, height, color);
        this.health = health;
    }

    damage(d=1) {
        this.health -= d;
        return this.health;
    }

    draw() {
        super.draw();
        if (this.health > 1) {
            context.strokeStyle = "darkgray";
            context.lineWidth = 1;
            context.strokeRect(this.pos.x+2.5, this.pos.y+2.5, this.width-5, this.height-5);
        }
    }
}
