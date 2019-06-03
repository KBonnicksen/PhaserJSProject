/// <reference path="phaser.d.ts"/>

//how you configure your game
var config = {
    type: Phaser.AUTO, //renderer
    width: 800,
    height: 600,
    scene: { 
        preload: preload, //load the assets
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);


function preload() {
}

function create() {
}

function update() {
}