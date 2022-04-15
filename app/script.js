// Splash Battle
/*^*^*^*^*^*^*^*
script.js
The main script for Splash Battle.
*^*^*^*^*^*^*^*/

let game = {
  TILESIZE: 8,
  GRAVITYY: 1500,
  playerSpeed: 400,
  playerJumpHeight: 700,
  waterSpeed: 700,
  waterYVel: 500
};
class Game extends Phaser.Scene {
  constructor() {
    super();
  }
  preload() {
    this.engine = new Engine(this);

    // ---------- Load the assets ----------
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("stickman", "assets/stickman.png");
    this.load.image("dirt", "assets/dirt.png");
    this.load.image("stickmanWalk0", "assets/stickmanWalking0.png");
    this.load.image("stickmanWalk1", "assets/stickmanWalking1.png");
    this.load.image("water", "assets/water.png");
  }
  create() {
    // Create cursor
    this.engine.pixelCursor();

    // Create keyboard
    game.keyboard = this.input.keyboard.createCursorKeys();

    // Create dirt
    game.dirt = this.physics.add.group();
    for (var x = 0; x < this.engine.gameWidth / 3 * game.TILESIZE; x += 3 * game.TILESIZE) {
      let dirt = game.dirt.create(x, this.engine.gameHeight - 8, "dirt");
      dirt.setScale(8);
      dirt.setGravityY(-game.GRAVITYY);
      dirt.setImmovable(true);
    }

    // Create stickman
    game.stickman = this.physics.add.sprite(this.engine.gameWidthCenter, this.engine.gameHeightCenter, "stickman");
    game.stickman.setScale(8);
    game.stickman.setDragX(1000);
    game.stickman.setCollideWorldBounds(true);
    game.stickman.dir = true;

    // Create water
    game.water = this.physics.add.group();

    // ---------- Colliders! ----------
    this.physics.add.collider(game.stickman, game.dirt);
    this.physics.add.collider(game.water, game.dirt);

    // ---------- Animation! ----------
    this.engine.addAnimation("stickmanWalk", 5, false, false, "stickmanWalk0", "stickmanWalk1");
  }
  update() {
    // Update cursor
    this.engine.updatePixelCursor();

    // ---------- Movement ----------
    if (!game.keyboard.left.isDown && !game.keyboard.right.isDown && !game.keyboard.up.isDown) {
      game.stickman.setTexture("stickman");
    }
    if (game.keyboard.up.isDown && game.stickman.body.touching.down) {
      game.stickman.setVelocityY(-game.playerJumpHeight);
    }
    if (game.keyboard.right.isDown) {
      game.stickman.flipX = false;
      game.stickman.dir = true
      game.stickman.anims.play("stickmanWalk", true);
      game.stickman.setVelocityX(game.playerSpeed);
    }
    if (game.keyboard.left.isDown) {
      game.stickman.flipX = true;
      game.stickman.dir = false;
      game.stickman.anims.play("stickmanWalk", true);
      game.stickman.setVelocityX(-game.playerSpeed);
    }

    // ---------- Shooting water ----------
    if (game.keyboard.space.isDown) {
      let water = game.water.create(game.stickman.x, game.stickman.y, "water");
      water.setScale(8);
      water.setVelocityY(-game.waterYVel);
      water.setCollideWorldBounds(true);
      if (game.stickman.dir) {
        water.setVelocityX(game.waterSpeed);
      } else {
        water.setVelocityX(-game.waterSpeed);
      }
    }
  }
}
