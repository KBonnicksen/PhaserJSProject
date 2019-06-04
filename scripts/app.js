var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    audio: {
        disableWebAudio: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var platforms;
var player;
var cursors;
function preload() {
    this.load.image('background', 'objects/Background.png');
    this.load.spritesheet('greenGuy', 'objects/green-sprite.png', { frameWidth: 160, frameHeight: 360,
        startFrame: 0, endFrame: 47 });
    this.load.image('tile', 'objects/stone-tiles.jpg');
}
function create() {
    this.add.image(window.innerWidth / 2, window.innerHeight / 5.5, 'background').setScale(1.8);
    platforms = this.physics.add.staticGroup();
    for (var i = 0; i < window.innerWidth / 24; i++) {
        platforms.create(24 * i + 12, window.innerHeight - 12, 'tile');
    }
    for (var i = 0; i <= 25; i++) {
        if (i < 12) {
            platforms.create(800 + i * 24, 380, 'tile');
        }
        platforms.create(i * 24, 200, 'tile');
        platforms.create(200 + i * 24, 550, 'tile');
        platforms.create(1100 + i * 24, 600, 'tile');
        platforms.create(1300 + i * 24, 200, 'tile');
    }
    player = this.physics.add.sprite(200, 20, 'greenGuy').setScale(.4);
    player.setBounce(.3);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(500);
    cursors = this.input.keyboard.createCursorKeys();
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('greenGuy', { start: 15, end: 23 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('greenGuy', { start: 24, end: 26 }),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('greenGuy', { start: 3, end: 11 }),
        frameRate: 12,
        repeat: -1
    });
    this.physics.add.collider(player, platforms);
}
function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn', true);
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-570);
    }
}
