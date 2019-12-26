var GameState = {

  init: function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //configurações da física do jogo
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;

    //fazendo com que a camera siga o player durante o jogo
    this.game.world.setBounds(0, 0, 360, 700);


    //criandos os botoes e as globais de velocidades
    this.cursor = this.game.input.keyboard.createCursorKeys();
    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 600;

  },

  preload: function () {
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('goal', 'assets/images/gorilla3.png');
    this.load.image('arrowButton', 'assets/images/arrowButton.png');
    this.load.image('actionButton', 'assets/images/actionButton.png');
    this.load.image('barrel', 'assets/images/barrel.png');

    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);
    this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', 20, 21, 2, 1, 1);

    this.load.text('level', 'assets/data/level.json');

  },

  create: function () {

    //import de arquivo json
    this.levelData = JSON.parse(this.game.cache.getText('level'));


    //solo
    this.ground = this.add.sprite(0, 638, 'ground');
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false; // configuracando fisica da plataforma
    this.ground.body.immovable = true;


    this.platforms = this.add.group();
    this.platforms.enableBody = true;

    //interando sobre o array de posicoes e criandos as plataformas     
    this.levelData.platformData.forEach(element => {
      this.platforms.create(element.x, element.y, 'platform');
    })

    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);

    //criaçao dos foguinhos importados do json
    this.fires = this.add.group();
    this.fires.enableBody = true;

    var fire;
    this.levelData.fireData.forEach(element => {
      fire = this.fires.create(element.x, element.y, 'fire');
      fire.animations.add('fire', [0, 1, 0, 1], 4, true);
      fire.play('fire');
    }, this);

    //criando o heroi
    this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {}

    this.camera.follow(this.player);


    //criando os botoes para dispositivos móveis
    this.createOnscreenControls();


  },

  update: function () {
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.platforms);
    this.game.physics.arcade.overlap(this.player, this.fires, this.killPlayer);
    this.game.physics.arcade.collide(this.platforms, this.fires);


    //definindo os padroes de velocidade do avatar
    this.player.body.velocity.x = 0;

    //controle de movimentos e frames
    if (this.cursor.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play('walking');

    } else if (this.cursor.right.isDown || this.player.customParams.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');

    } else {
      this.player.animations.stop();
      this.player.frame = 3;
    }


    if ((this.cursor.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    }


  },


  createOnscreenControls: function () {
    this.leftArrow = this.add.button(20, 535, 'arrowButton');
    this.rigthArrow = this.add.button(110, 535, 'arrowButton');
    this.actionButton = this.add.button(280, 535, 'actionButton');

    this.leftArrow.alpha = 0.5;
    this.rigthArrow.alpha = 0.5;
    this.actionButton.alpha = 0.5;

    this.leftArrow.fixedToCamera = true;
    this.rigthArrow.fixedToCamera = true;
    this.actionButton.fixedToCamera = true;

    //pulo
    this.actionButton.events.onInputDown.add(() => {
      this.player.customParams.mustJump = true;
    }, this);

    this.actionButton.events.onInputUp.add(() => {
      this.player.customParams.mustJump = false;
    }, this);

    //esquerda
    this.leftArrow.events.onInputDown.add(() => {
      this.player.customParams.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputUp.add(() => {
      this.player.customParams.isMovingLeft = false;
    }, this);


    this.leftArrow.events.onInputOver.add(() => {
      this.player.customParams.isMovingLeft = true;
    }, this);

    this.leftArrow.events.onInputOut.add(() => {
      this.player.customParams.isMovingLeft = false;
    }, this);


    //direita
    this.rigthArrow.events.onInputDown.add(() => {
      this.player.customParams.isMovingRight = true;
    }, this);

    this.rigthArrow.events.onInputUp.add(() => {
      this.player.customParams.isMovingRight = false;
    }, this);

    this.rigthArrow.events.onInputOver.add(() => {
      this.player.customParams.isMovingRight = true;
    }, this);

    this.rigthArrow.events.onInputOut.add(() => {
      this.player.customParams.isMovingRight = false;
    }, this);

  },

  killPlayer: function (player, fire) {
    game.state.start('GameState');
  }

}

var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');