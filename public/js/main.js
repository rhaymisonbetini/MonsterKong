var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.add('InitialGameState', InitialGameState);
game.state.start('InitialGameState');


