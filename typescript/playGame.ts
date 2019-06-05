/// <reference path="phaser.d.ts"/>

class GameScene extends Phaser.Scene {
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    preload() {
        this.load.image('background', 'objects/Background.png');
        this.load.spritesheet('greenGuy', 'objects/green-sprite.png',
            {
                frameWidth: 160, frameHeight: 360,
                startFrame: 0, endFrame: 47
            });

        this.load.image('tile', 'objects/stone-tiles.jpg');
        this.load.audio('hit', 'sounds/thud.mp3')
    }

    create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 5.5, 'background').setScale(1.8);

        this.createPlatforms();

        this.createPlayer();

        this.createAnimation();
    }

    private createPlayer() {
        this.player = this.physics.add.sprite(200, 20, 'greenGuy').setScale(.4);
        this.physics.add.collider(this.player, this.platforms);
        this.player.setBounce(.3);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(500);
    }

    private createAnimation() {

        this.cursors = this.input.keyboard.createCursorKeys();

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
    }

    private createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        //floor
        for (let i = 0; i < window.innerWidth / 24; i++) {
            this.platforms.create(24 * i + 12, window.innerHeight - 12, 'tile');
        }
        for (let i = 0; i <= 25; i++) {
            if (i < 12) {
                this.platforms.create(800 + i * 24, 380, 'tile');//small middle
            }
            this.platforms.create(i * 24, 200, 'tile'); //top left
            this.platforms.create(200 + i * 24, 550, 'tile'); //bottom left
            this.platforms.create(1100 + i * 24, 600, 'tile'); //bottom right
            this.platforms.create(1300 + i * 24, 200, 'tile'); //top right
        }
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn', true);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-570);
        }
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, 
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'content',

    audio: {
        disableWebAudio: true
    },
    scene: GameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

class GreenManGame extends Phaser.Game{
    constructor(config:Phaser.Types.Core.GameConfig) {
        super(config);
    };
};

window.onload = function(){
    let game = new GreenManGame(config);
}



