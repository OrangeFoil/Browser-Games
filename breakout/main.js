const canvas = document.getElementById("gamecanvas");

// keyboard events
var keys = [];
document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

// touchscreen events
var touch = "";
document.addEventListener("touchstart", touchStartHandler);
document.addEventListener("touchend", touchEndHandler);
function touchStartHandler(e) {
    if(e.touches) {
        if (e.touches[0].pageX < canvas.offsetLeft + canvas.width/2) {
            touch = "left";
        } else {
            touch = "right";
        }
        e.preventDefault();
    }
}
function touchEndHandler(e) {
    if(e.touches) {
        touch = "";
        e.preventDefault();
    }
}

var game = new GameScene(canvas);
