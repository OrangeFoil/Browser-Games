var app = new PIXI.Application(616, 496, {backgroundColor : 0x000000});
document.body.appendChild(app.view);

var scale = Math.min(window.innerWidth / 496, window.innerHeight / 496);
app.stage.scale.x = scale;
app.stage.scale.y = scale;
app.renderer.resize(616*scale, 496*scale);

var game = new Game();
game.draw(app);

app.ticker.add(function(delta) {
    game.tick(app.ticker.elapsedMS);
});

document.body.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            game.inputs.push("up");
            e.preventDefault();
            break;
        case "ArrowRight":
            game.inputs.push("right");
            e.preventDefault();
            break;
        case "ArrowDown":
            game.inputs.push("down");
            e.preventDefault();
            break;
        case "ArrowLeft":
            game.inputs.push("left");
            e.preventDefault();
            break;
    }
});
