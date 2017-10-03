class Ball extends Rectangle {
    constructor() {
        const size = 12;
        super(canvas.width/2, canvas.height-64, size, size, "#F8F8F2");
        this.speed = -300;
        this.velocity = {x: (Math.random() + 0.5) * Math.pow(-1, Math.floor(Math.random() * 2)) * 60,
                         y: this.speed};
    }
}
