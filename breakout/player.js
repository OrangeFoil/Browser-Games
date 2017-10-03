/** The paddle that's controlled by the player */
class Player extends Rectangle {
    constructor() {
        const width = 120;
        const height = 16;
        super(canvas.width / 2 - width/2, canvas.height - 32, width, height, "#F92672");
        this.velocity = 0;
        this.speed = 50;
        this.friction = 0.9;
    }

    moveLeft() {
        this.velocity -= this.speed;
    }

    moveRight() {
        this.velocity += this.speed;
    }

    update(deltaTime) {
        this.pos.x += this.velocity * deltaTime;
        this.velocity *= this.friction;

        if (this.pos.x+this.width/2 < 0) {
            this.pos.x = -this.width/2;
            this.velocity = 0;
        } else if (this.pos.x+this.width/2 > canvas.width) {
            this.pos.x = canvas.width-this.width/2;
            this.velocity = 0;
        }
    }
}
