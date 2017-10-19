class Apple {
    constructor() {
        do {
            this.x = Math.floor(Math.random() * game.arenaSize);
            this.y = Math.floor(Math.random() * game.arenaSize);
        } while (game.arena[this.y][this.x] != 0);

        if (Math.random() > 0.5) {
            // regular apple
            this.magic = false;
            game.arena[this.y][this.x] = 1;
        } else {
            // magic apple
            this.magic = true;
            game.arena[this.y][this.x] = 2;

            setTimeout(() => {
                if (game.arena[this.y][this.x] == 2) {
                    game.arena[this.y][this.x] = 1;
                    this.magic = false;
                }
            }, game.getInterval() * 20);
        }

        this.loadTextures();
    }

    draw() {
        if (this.magic) {
            // magic apple
            this.spriteApple.visible = false;
            this.spriteMagicApple.visible = true;
            this.spriteMagicApple.position.set(this.x*16, this.y*16);
        } else  {
            // apple
            this.spriteApple.visible = true;
            this.spriteMagicApple.visible = false;
            this.spriteApple.position.set(this.x*16, this.y*16);
        }
    }

    kill() {
        game.arena[this.y][this.x] = 0;

        app.stage.removeChild(this.spriteApple);
        app.stage.removeChild(this.spriteMagicApple);
    }

    loadTextures() {
        var spritesheet = PIXI.BaseTexture.fromImage("assets/tileset.png");

        var spriteTextureApple = new PIXI.Texture(spritesheet, new PIXI.Rectangle(32, 16, 16, 16));
        var spriteTextureMagicApple = new PIXI.Texture(spritesheet, new PIXI.Rectangle(48, 16, 16, 16));

        this.spriteApple = new PIXI.Sprite(spriteTextureApple);
        this.spriteMagicApple = new PIXI.Sprite(spriteTextureMagicApple);
        
        app.stage.addChild(this.spriteApple);
        app.stage.addChild(this.spriteMagicApple);
    }
}
