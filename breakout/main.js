const canvas = document.getElementById("gamecanvas");
const context = canvas.getContext("2d");

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

function generateLevel(level) {
    const blocks = [];
    const colors = ["#F92672", "#66D9EF", "#A6E22E", "#FD971F", "#AE81FF", "#FFE792", "#FFE792"];
    if (level == 1) {
        for (row = 0; row < 7; row++) {
            for (col = 0; col < 8; col++) {
                blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
            }
        }
    } else if (level == 2) {
        for (row = 0; row < 3; row++) {
            for (col = 1; col < 7; col++) {
                blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
            }
        }

        for (row = 0; row < 4; row++) {
            for (col = 0; col < 8; col++) {
                if (col == 2 || col == 5) continue;
                blocks.push(new Block(2+col*60, 160+row*20, 58, 16, colors[row]));
            }
        }

        for (col = 0; col < 8; col++) {
            blocks.push(new Block(2+col*60, 160+row*20, 58, 16, "grey", 2));
        }
    } else if (level == 3) {
        blocks.push(new Block(60, 60, 16, 196, "grey", 2));
        blocks.push(new Block(canvas.width-76, 60, 16, 196, "grey", 2));

        for (row = 0; row < 3; row++) {
            for (col = 0; col < 6; col++) {
                blocks.push(new Block(80+col*54, 60+row*20, 50, 16, colors[row]));
            }
        }
        for (row = 0; row < 4; row++) {
            blocks.push(new Block(80, 120+row*20, 50, 16, colors[2]));
            blocks.push(new Block(canvas.width-130, 120+row*20, 50, 16, colors[2]));
        }

        for (col = 0; col < 2; col++) {
            blocks.push(new Block(134+col*108, 120, 104, 76, colors[5]));
        }

        for (row = 0; row < 3; row++) {
            for (col = 0; col < 6; col++) {
                blocks.push(new Block(80+col*54, 200+row*20, 50, 16, colors[2-row]));
            }
        }

        for (col = 0; col < 6; col++) {
            blocks.push(new Block(80+col*54, 200+row*20, 50, 16, "grey", 2));
        }
    } else {
        // simple random level
        for (row = 0; row < 7; row++) {
            for (col = 0; col < 8; col++) {
                if (Math.random() >= 0.5) continue;
                blocks.push(new Block(2+col*60, 60+row*20, 58, 16, colors[row]));
            }
        }
    }
    return blocks;
}

var game = new Game(canvas);
