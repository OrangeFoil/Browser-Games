class Snake {
    constructor() {
        this.length = 5,
        this.trace = [{x: 15, y: 15}];
        this.heading = "";
        this.loadTextures();
    }

    get head() {
        return {
            x: this.trace[this.trace.length - 1].x,
            y: this.trace[this.trace.length - 1].y,
        };
    }

    clear() {
        app.stage.removeChild(this.containerSnake);
    }

    draw() {
        // clear snake
        this.clear();
        this.containerSnake = new PIXI.Container();

        const trace = this.trace;

        // snake head
        var spriteSnakeHead = new PIXI.Sprite(this.spriteTextureSnakeHead);
        spriteSnakeHead.anchor.set(0.5);
        spriteSnakeHead.position.set(trace[trace.length-1].x*16+8, trace[trace.length-1].y*16+8);
        if (this.heading == "right") spriteSnakeHead.rotation = 0.5 * Math.PI;
        if (this.heading == "down") spriteSnakeHead.rotation = 1.0 * Math.PI;
        if (this.heading == "left") spriteSnakeHead.rotation = 1.5 * Math.PI;
        this.containerSnake.addChild(spriteSnakeHead);

        // snake body
        for (let i = 1; i < trace.length-1; i++) {
            if (trace[i-1].x == trace[i+1].x || trace[i-1].y == trace[i+1].y) {
                var spriteSnakeBodyStraight = new PIXI.Sprite(this.spriteTextureSnakeBodyStraight);
                spriteSnakeBodyStraight.anchor.set(0.5);
                spriteSnakeBodyStraight.position.set(trace[i].x*16+8, trace[i].y*16+8);
                if (trace[i-1].x - trace[i+1].x == -2) spriteSnakeBodyStraight.rotation = 0.5 * Math.PI;
                else if (trace[i-1].y - trace[i+1].y == -2) spriteSnakeBodyStraight.rotation = 1.0 * Math.PI;
                else if (trace[i-1].x - trace[i+1].x == 2) spriteSnakeBodyStraight.rotation = 1.5 * Math.PI;
                this.containerSnake.addChild(spriteSnakeBodyStraight);
            } else {
                if (trace[i-1].y == trace[i].y+1 && trace[i].x-1 == trace[i+1].x) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyLeft);
                } else if (trace[i-1].x == trace[i].x-1 && trace[i].y-1 == trace[i+1].y) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyLeft);
                    spriteSnakeBody.rotation = 0.5 * Math.PI;
                } else if (trace[i-1].y == trace[i].y-1 && trace[i].x+1 == trace[i+1].x) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyLeft);
                    spriteSnakeBody.rotation = 1.0 * Math.PI;
                } else if (trace[i-1].x == trace[i].x+1 && trace[i].y+1 == trace[i+1].y) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyLeft);
                    spriteSnakeBody.rotation = 1.5 * Math.PI;
                } else if (trace[i-1].y == trace[i].y+1 && trace[i].x+1 == trace[i+1].x) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyRight);
                } else if (trace[i-1].x == trace[i].x-1 && trace[i].y+1 == trace[i+1].y) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyRight);
                    spriteSnakeBody.rotation = 0.5 * Math.PI;
                } else if (trace[i-1].y == trace[i].y-1 && trace[i].x-1 == trace[i+1].x) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyRight);
                    spriteSnakeBody.rotation = 1.0 * Math.PI;
                } else if (trace[i-1].x == trace[i].x+1 && trace[i].y-1 == trace[i+1].y) {
                    var spriteSnakeBody = new PIXI.Sprite(this.spriteTextureSnakeBodyRight);
                    spriteSnakeBody.rotation = 1.5 * Math.PI;
                }
                spriteSnakeBody.anchor.set(0.5);
                spriteSnakeBody.position.set(trace[i].x*16+8, trace[i].y*16+8);
                this.containerSnake.addChild(spriteSnakeBody);    
            }

            
        }

        // snake tail
        if (trace.length > 1) {
            var spriteSnakeTail = new PIXI.Sprite(this.spriteTextureSnakeTail);
            spriteSnakeTail.anchor.set(0.5);
            spriteSnakeTail.position.set(trace[0].x*16+8, trace[0].y*16+8);
            if (trace[0].x - trace[1].x == -1) spriteSnakeTail.rotation = 0.5 * Math.PI;
            else if (trace[0].y - trace[1].y == -1) spriteSnakeTail.rotation = 1.0 * Math.PI;
            else if (trace[0].x - trace[1].x == 1) spriteSnakeTail.rotation = 1.5 * Math.PI;
            this.containerSnake.addChild(spriteSnakeTail);
        }
        
        app.stage.addChild(this.containerSnake);
    }

    loadTextures() {
        var spritesheet = PIXI.BaseTexture.fromImage("assets/tileset.png");

        this.spriteTextureSnakeHead = new PIXI.Texture(spritesheet, new PIXI.Rectangle(0, 0, 16, 16));
        this.spriteTextureSnakeBodyStraight = new PIXI.Texture(spritesheet, new PIXI.Rectangle(16, 0, 16, 16));
        this.spriteTextureSnakeBodyLeft = new PIXI.Texture(spritesheet, new PIXI.Rectangle(32, 0, 16, 16));
        this.spriteTextureSnakeBodyRight = new PIXI.Texture(spritesheet, new PIXI.Rectangle(48, 0, 16, 16));
        this.spriteTextureSnakeTail = new PIXI.Texture(spritesheet, new PIXI.Rectangle(0, 16, 16, 16));

        this.containerSnake = new PIXI.Container();       
        app.stage.addChild(this.containerSnake);
    }

}