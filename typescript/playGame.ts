/// <reference path="phaser.d.ts"/>
//TODO: add baddies
//TODO: scale for screens
//DONE: add gems
//DONE: Keep score
//DONE: animate jewels

var width = window.innerWidth;
var height = window.innerHeight;
class GameScene extends Phaser.Scene {
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    jewels: Phaser.Physics.Arcade.Group
    score:number;
    scoreText:Phaser.GameObjects.Text; 
    spiders: Phaser.Physics.Arcade.Group;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    preload() {
        this.load.image('background', 'objects/Background.png');
        this.load.image('tile', 'objects/stone-tiles.jpg');
        this.load.image('ruby', 'objects/ruby.png');
        this.load.spritesheet('greenGuy', 'objects/green-sprite.png',
            {
                frameWidth: 160, frameHeight: 360,
            });
        
        //this.load.audio('hit', 'sounds/thud.mp3')
        this.load.spritesheet('yellowJewel', 'objects/yellow-jewel.png', 
            {
                frameWidth: 32, frameHeight: 32,
            });
        
        this.load.spritesheet('spider', 'objects/spider.png',
        {
            frameWidth: 64, frameHeight: 64
        });
    }

    create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 5.5, 'background').setScale(1.8);
        this.score = 0;
        this.createJewels();
        
        this.createPlatforms();

        this.createPlayer();

        this.spiders = this.physics.add.group(
            /* {
                key: 'top-left',        TODO: ADD ALL SPIDERS
                repeat: 8,
                setXY: { x: 12, y: 300, stepX: (width / 9), stepY: -50 },
            }, */
            {
                key: 'ground',
                setXY: { x: 0, y: height - 24},
            }

        );

        this.scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px'});
        this.createAnimation();
        this.physics.add.collider(this.jewels, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.jewels, this.collectJewel, null, this);
    }

    private collectJewel(player, jewel){
        (<Phaser.Physics.Arcade.Sprite>jewel).disableBody(true, true);
        this.score += 10;
        this.scoreText.text = 'score: ' + this.score.toString();

        if(this.jewels.countActive(true) === 0){
            this.jewels.children.iterate(function(child){ //reset jewels
                (<Phaser.Physics.Arcade.Sprite>child).enableBody(true, 
                    (<Phaser.Physics.Arcade.Sprite>child).x, 0, true, true);
            })
        }
    }

    private createJewels() {
        this.jewels = this.physics.add.group({
            key: 'jewel',
            repeat: 8,
            setXY: { x: 12, y: 300, stepX: (width / 9), stepY: -50},
        });

        this.jewels.children.iterate(function (child) {
            (<Phaser.Physics.Arcade.Sprite>child).setBounceY(Phaser.Math.FloatBetween(0.2, 0.6))
        })
    }

    private createPlayer() {
        this.player = this.physics.add.sprite(200, 20, 'greenGuy').setScale(.4);
        this.player.setBounce(.3);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(500);
    }

    private createAnimation() {

        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({ //move left
            key: 'yellowJewel',
            frames: this.anims.generateFrameNumbers('yellowJewel', { start: 0, end: 7 }),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({ //move left
            key: 'left',
            frames: this.anims.generateFrameNumbers('greenGuy', { start: 15, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({ //on stop/turn
            key: 'turn',
            frames: this.anims.generateFrameNumbers('greenGuy', { start: 24, end: 26 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({ //move right
            key: 'right',
            frames: this.anims.generateFrameNumbers('greenGuy', { start: 3, end: 11 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('yellowJewel', { start: 0, end: 7 }),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'spider-walk-right',
            frames: this.anims.generateFrameNumbers('spider', { start: 0, end: 8}),
            frameRate: 7,
            repeat: -1
        });
        this.spiders.playAnimation('spider-walk-right', '0');
        this.jewels.playAnimation('yellowJewel', '0');
    }

    private createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        
        for (let i = 0; i < window.innerWidth / 24; i++) {
            this.platforms.create(24 * i + 12, window.innerHeight - 12, 'tile'); //floor
        }
        for (let i = 0; i <= 25; i++) {
            if (i < 12) {
                this.platforms.create(800 + i * 24, 380, 'tile'); //small middle
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



