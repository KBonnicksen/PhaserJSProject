var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var width = window.innerWidth;
var height = window.innerHeight;
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super.call(this, {
            key: "GameScene"
        }) || this;
    }
    GameScene.prototype.preload = function () {
        this.load.image('background', 'objects/Background.png');
        this.load.image('tile', 'objects/stone-tiles.jpg');
        this.load.image('ruby', 'objects/ruby.png');
        this.load.spritesheet('greenGuy', 'objects/green-sprite.png', {
            frameWidth: 160, frameHeight: 360,
        });
        this.load.spritesheet('yellowJewel', 'objects/yellow-jewel.png', {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('spider', 'objects/spider.png', {
            frameWidth: 64, frameHeight: 64
        });
    };
    GameScene.prototype.create = function () {
        this.add.image(window.innerWidth / 2, window.innerHeight / 5.5, 'background').setScale(1.8);
        this.score = 0;
        this.createJewels();
        this.createPlatforms();
        this.createPlayer();
        this.createSpiders();
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px' });
        this.createAnimation();
        this.physics.add.collider(this.jewels, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.spiders, this.platforms);
        this.physics.add.collider(this.player, this.spiders);
        this.physics.add.overlap(this.player, this.jewels, this.collectJewel, null, this);
    };
    GameScene.prototype.createSpiders = function () {
        this.spiders = this.physics.add.group({
            key: 'ground',
            setXY: { x: 900, y: 100 },
        });
        this.spiders.children.iterate(function (child) {
            child.anims.forward = true;
            child.setVelocityX(-50);
        });
    };
    GameScene.prototype.collectJewel = function (player, jewel) {
        jewel.disableBody(true, true);
        this.score += 10;
        this.scoreText.text = 'score: ' + this.score.toString();
        if (this.jewels.countActive(true) === 0) {
            this.jewels.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    };
    GameScene.prototype.createJewels = function () {
        this.jewels = this.physics.add.group({
            key: 'jewel',
            repeat: 8,
            setXY: { x: 12, y: 300, stepX: (width / 9), stepY: -50 },
        });
        this.jewels.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
        });
    };
    GameScene.prototype.createPlayer = function () {
        this.player = this.physics.add.sprite(200, 20, 'greenGuy').setScale(.4);
        this.player.setBounce(.3);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(500);
    };
    GameScene.prototype.createAnimation = function () {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.anims.create({
            key: 'yellowJewel',
            frames: this.anims.generateFrameNumbers('yellowJewel', { start: 0, end: 7 }),
            frameRate: 7,
            repeat: -1
        });
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
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('yellowJewel', { start: 0, end: 7 }),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'spider-left',
            frames: this.anims.generateFrameNumbers('spider', { start: 0, end: 9 }),
            frameRate: 7,
            repeat: -1,
            showOnStart: true
        });
        this.anims.create({
            key: 'spider-right',
            frames: this.anims.generateFrameNumbers('spider', { start: 20, end: 29 }),
            frameRate: 7,
            repeat: -1,
            showOnStart: true
        });
        this.spiders.playAnimation('spider-left', '0');
        this.jewels.playAnimation('yellowJewel', '0');
    };
    GameScene.prototype.createPlatforms = function () {
        this.platforms = this.physics.add.staticGroup();
        for (var i = 0; i < window.innerWidth / 24; i++) {
            this.platforms.create(24 * i + 12, window.innerHeight - 12, 'tile');
        }
        for (var i = 0; i <= 25; i++) {
            if (i < 12) {
                this.platforms.create(800 + i * 24, 380, 'tile');
            }
            this.platforms.create(i * 24, 200, 'tile');
            this.platforms.create(200 + i * 24, 550, 'tile');
            this.platforms.create(1100 + i * 24, 600, 'tile');
            this.platforms.create(1300 + i * 24, 200, 'tile');
        }
    };
    GameScene.prototype.update = function () {
        this.spiders.children.iterate(function (child) {
            if (child.x <= 0 ||
                child.x >= width) {
            }
        });
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
    };
    return GameScene;
}(Phaser.Scene));
var config = {
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
var GreenManGame = (function (_super) {
    __extends(GreenManGame, _super);
    function GreenManGame(config) {
        return _super.call(this, config) || this;
    }
    ;
    return GreenManGame;
}(Phaser.Game));
;
window.onload = function () {
    var game = new GreenManGame(config);
};
