window.onload=function() {
	canvas=document.getElementById("gamecanvas");
	context=canvas.getContext("2d");
	document.addEventListener("keydown",keyPush);
	setInterval(game,1000/60);
}

ballSpeed = -5;
ballSize = 12;
ballPosX = 640 / 2;
ballPosY = 480 / 2;
ballVelocityX = 0;
ballVelocityY = ballSpeed;

playerPosX = 160;
playerPosY = 480-32;
playerWidth = 120;
playerHeight = 32;

blocks = [];
for (i = 0; i < 6; i++) {
    for (j = 0; j < 4; j++) {
        blocks.push([96+i*80, 96+j*24, 64, 16, true]);
    }
}

score = 0;

function game() {
    // update ball position
    if (ballPosY-ballSize/2 > canvas.height) {
        // player missed the ball
        ballPosX = canvas.width / 2 - ballSize / 2;
        ballPosY = canvas.height / 2 - ballSize / 2;
        ballVelocityX = 0;
        ballVelocityY = ballSpeed;
    } else if (ballPosY-ballSize/2 <= 0) {
        // ball touched ceiling
        ballVelocityY = -ballVelocityY;
    } else if (ballPosX-ballSize/2 <= 0 || ballPosX+ballSize/2 >= canvas.width) {
        // ball touched left or right wall
        ballVelocityX = -ballVelocityX;
    }
    ballPosX += ballVelocityX;
    ballPosY += ballVelocityY;

    // detect ball collision with player
    if (ballPosX+ballSize/2 >= playerPosX-playerWidth/2 && ballPosX-ballSize/2 <= playerPosX+playerWidth/2
    && ballPosY-ballSize/2 >= playerPosY-playerHeight/2 && ballPosY+ballSize/2 <= playerPosY+playerHeight) {
        ballVelocityX = (ballPosX - playerPosX) / 10;
        ballVelocityY = -ballVelocityY;
    }

    // detect ball collision with blocks
    for (i = 0; i < blocks.length; i++) {
        if (blocks[i][4]
        && ballPosX-ballSize/2 < blocks[i][0]+blocks[i][2] && ballPosX+ballSize/2 > blocks[i][0]
        && ballPosY-ballSize/2 < blocks[i][1]+blocks[i][3] && ballPosY+ballSize/2 > blocks[i][1]) {
            blocks[i][4] = false;
            score++;
            ballVelocityX = -ballVelocityX;
            ballVelocityY = -ballVelocityY;
        }
    }
    
    // draw background
    context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// draw ball
    context.fillStyle = "white";
    context.fillRect(ballPosX-ballSize/2, ballPosY-ballSize/2, ballSize, ballSize);

    // draw player
	context.fillStyle = "red";
    context.fillRect(playerPosX-playerWidth/2, playerPosY, playerWidth, 16);

    // draw blocks
    context.fillStyle = "blue";
    for (i = 0; i < blocks.length; i++) {
        if (!blocks[i][4]) continue;
        context.fillRect(blocks[i][0], blocks[i][1], blocks[i][2], blocks[i][3]);
    }

    // draw score
    context.fillStyle = "white";
    context.font = "20px Georgia";
    context.fillText("Score: " + score, 10, 20);

    // AI
    /*if (playerPosX-ballPosX < -20) {
        playerPosX += 20;
    } else if (playerPosX-ballPosX > 20) {
        playerPosX -= 20;
    }*/
}
function keyPush(evt) {
	switch(evt.keyCode) {
		case 37:
            playerPosX -= 20;
			break;
		case 39:
            playerPosX += 20;
			break;
	}
}
