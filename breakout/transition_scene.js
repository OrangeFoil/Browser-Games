class TransitionScene extends AbstractScene {
    constructor(canvas, message, duration) {
        super(canvas);
        
        this.message = message;
        this.duration = duration;
        this.timeElapsed = 0;

        this.pos = { x: 0, y: this.canvas.height / 2 };
    }

    processInput() {
        return;
    }

    simulate(deltaTime) {
        this.timeElapsed += deltaTime;

        if (this.timeElapsed < 0.25) {
            // slide in
            this.pos.x += (this.canvas.width/2) / 0.25 * deltaTime;
        } else if (this.duration - this.timeElapsed < 0.25) {
            // slide out
            this.pos.x += ((this.canvas.width/2) / 0.25 * deltaTime);
        }
    }
    
    render() {
        // draw background
        this.context.fillStyle = "#272822";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw message
        this.context.fillStyle = "white";
        this.context.font = "20px Georgia";
        this.context.textAlign = "center";
        this.context.fillText(this.message, this.pos.x, this.pos.y);
    }
}
