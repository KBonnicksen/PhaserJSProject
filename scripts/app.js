var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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
function preload() {
    this.load.image('background', 'objects/Background.png');
    this.load.spritesheet('greenGuy', 'objects/adv_chara.png', { frameWidth: 160, frameHeight: 360,
        startFrame: 0, endFrame: 47 });
    this.load.image('tile', 'objects/stone-tiles.jpg');
}
function create() {
    this.add.image(window.innerWidth / 2, window.innerHeight / 5.5, 'background').setScale(1.8);
    player = this.physics.add.sprite(200, 20, 'greenGuy').setScale(.5);
    player.setBounce(.02);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(300);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('greenGuy', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'greenGuy', frame: 4 }],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('greenGuy', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
}
function update() {
}
