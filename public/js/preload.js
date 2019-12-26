var InitialGameState = {
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.initialGameState = true;
    },

    preload: function () {
        this.load.image('background', 'assets/images/images.jpeg');
        this.load.audio('initialAudio', 'assets/audio/audio.wav');

    },

    create: function () {
        this.background = this.game.add.sprite(0, 0, 'background');
        this.record = game.add.audio('initialAudio');
        this.record.loop = true;
        let style = {
            font: '40px bold Arial', fill: 'red'
        };
        let text = game.add.text(game.world.centerX, game.world.centerY, 'PRESS ENTER', style);
        let style2 = {
            font: '20px bold Arial', fill: '#fff'
        };
        let text2 = game.add.text(game.world.centerX, 500, 'Desenvolvido por Rhaymison Betini', style2);
        text.anchor.setTo(0.5);
        text2.anchor.setTo(0.5);
        text.inputEnabled = true;
        text.events.onInputDown.add(this.gameInit, this);

        window.addEventListener('keyup', (e) => {
            if (e.keyCode == 13 && this.initialGameState) {
                this.initialGameState = false;
                this.record.play();
                game.state.start('GameState');
            }
        });

        document.addEventListener("DOMContentLoaded", function (event) {
        });
    },

    gameInit: function () {
        this.initialGameState = false;
        this.record.play();
        game.state.start('GameState');
    },


}
