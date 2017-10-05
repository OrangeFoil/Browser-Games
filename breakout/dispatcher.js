/** Handles timing and scene switching */
class Dispatcher {
    constructor(scene) {
        this.scene = scene;
    }

    changeScene(scene) {
        this.scene = scene;
    }

    start() {
        this.accumulator = 0;
        this.step = 1/360;
        let lastTime = null;
        this._frameCallback = (timestamp) => {
            if (lastTime !== null) {
                this.accumulator += (timestamp - lastTime) / 1000;
                while (this.accumulator >= this.step) {
                    this.scene.processInput();
                    this.scene.simulate(this.step);
                    this.accumulator -= this.step;
                }
                this.scene.render();
            }
            lastTime = timestamp;
            requestAnimationFrame(this._frameCallback);
        };
        requestAnimationFrame(this._frameCallback);
    }
}
