var app = new PIXI.Application(496, 496, {backgroundColor : 0x000000});
document.body.appendChild(app.view);

var scale = Math.min(window.innerWidth / 496, window.innerHeight / 496);
app.stage.scale.x = scale;
app.stage.scale.y = scale;
app.renderer.resize(496*scale, 496*scale);

var game = new Game();
game.draw(app);

app.ticker.add(function(delta) {
    game.tick(app.ticker.elapsedMS);
});

document.body.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            game.inputs.push("up");
            break;
        case "ArrowRight":
            game.inputs.push("right");
            break;
        case "ArrowDown":
            game.inputs.push("down");
            break;
        case "ArrowLeft":
            game.inputs.push("left");
            break;
    }
    e.preventDefault();
});
