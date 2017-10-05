var game = new Phaser.Game(640, 360, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

var player;
var platforms;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('dirt', 'assets/dirt.png');
    game.load.image('player', 'assets/player.png');
}

function create() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.input.onDown.add(gofull, this);

    // enable physics and set default gravity
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 200;

    game.world.setBounds(0, 0, 16384, 640);

    // sky
    game.add.tileSprite(0, 0, 16384, 640, 'sky');

    // ground
    platforms = game.add.group();
    platforms.enableBody = true;
    var dirt = game.add.tileSprite(0, game.world.height - 64, game.world.width, 64, 'dirt');
    platforms.add(dirt);
    dirt.body.immovable = true;
    dirt.body.allowGravity = false;

    // player
    player = game.add.sprite(32, game.world.height - 96, 'player');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;

    // controls
    cursors = game.input.keyboard.createCursorKeys();

    // camera
    //game.camera.follow(player);
    //game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 0.2, 0.2);
    game.camera.x = player.body.x-32;
    game.camera.y = player.body.y;
}

function gofull() {
    
        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }
    
    }

function update() {
    game.physics.arcade.collide(player, platforms);

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x += -5;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x += 5;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -200;
    }

    // friction
    player.body.velocity.x *= 0.99;
    
    // lock camera to player
    game.camera.x = player.body.x-32;
}
