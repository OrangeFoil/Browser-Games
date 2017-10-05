class Keyboard {
    constructor() {
        this.keys = [];

        document.body.addEventListener("keydown", (e) => {
            this.keyup(e.key);
        });
        document.body.addEventListener("keyup", (e) => {
            this.keydown(e.key);
        });
    }
    
    keydown(key) {
        this.keys[key] = false;
    }
    
    keyup(key) {
        this.keys[key] = true;
    }

    isPressed(key) {
        return this.keys[key];
    }    
}

class Touchscreen {
    constructor() {
        this.action = "";

        document.addEventListener("touchstart", (e) => this.touchStartHandler(e));
        document.addEventListener("touchend", (e) => this.touchEndHandler(e));
    }

    touchStartHandler(e) {
        if(e.touches) {
            console.log(touchscreen.action);
            if (e.touches[0].pageX < canvas.offsetLeft + canvas.width/2) {
                this.action = "left";
            } else {
                this.action = "right";
            }
            e.preventDefault();
        }
    }
    
    touchEndHandler(e) {
        if(e.touches) {
            this.action = "";
            e.preventDefault();
        }
    }
}
