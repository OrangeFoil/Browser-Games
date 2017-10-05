const canvas = document.getElementById("gamecanvas");

var keyboard = new Keyboard();
var touchscreen = new Touchscreen();

const dispatcher = new Dispatcher();
var gameScene = new GameScene(canvas, dispatcher);
dispatcher.changeScene(gameScene);
dispatcher.start();
