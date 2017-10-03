class AbstractScene {
    constructor(canvas) {
        if (new.target === AbstractScene) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
    }

    processInput() {
        console.warn("Unimplemented function!");
    }
    
    simulate() {
        console.warn("Unimplemented function!");
    }

    render() {
        console.warn("Unimplemented function!");
    }
}