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
  waterYVel: 500,
  WORLDWIDTH: 2000
};
class Game extends Phaser.Scene {
  constructor() {
    super();
  }
  createDirt(x, y) {
    let dirt = game.dirt.create(x, y, "dirt");
    dirt.setScale(8);
    dirt.setImmovable(true);
    dirt.setCollideWorldBounds(true);
    dirt.setGravityY(-game.GRAVITYY);
  }
  shootWater(x, y, dir, speed) {
    let water = game.water.create(x, y, "water");
    water.setScale(8);
    water.setVelocityY(-game.waterYVel);
    water.setCollideWorldBounds(true);
    water.setBounce(0.5);
    water.setDragX(100);
    if (dir) {
      water.setVelocityX(speed);
    } else {
      water.setVelocityX(-speed);
    }
  }
  preload() {
    this.engine = new Engine(this);

    // ---------- Load the assets ----------
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("stickman", "assets/stickman.png");
    this.load.image("dirt", "assets/dirt.png");
    this.load.image("stickmanWalk0", "assets/walkingStickman0.png");
    this.load.image("stickmanWalk1", "assets/walkingStickman1.png");
    this.load.image("water", "assets/water.png");
    this.load.image("neighborStickman", "assets/neighborStickman.png");
  }
  create() {
    // Create cursor
    this.engine.pixelCursor();

    // Create keyboard
    game.keyboard = this.input.keyboard.createCursorKeys();

    // Create dirt
    game.dirt = this.physics.add.group();
    for (var x = 0; x < game.WORLDWIDTH / 3 * game.TILESIZE; x += 3 * game.TILESIZE) {
      this.createDirt(x, this.engine.gameHeight - 8);
    }
    this.createDirt(800, this.engine.gameHeight - 100);
    this.createDirt(game.WORLDWIDTH - 800, this.engine.gameHeight - 100);
    this.createDirt(game.WORLDWIDTH / 2, this.engine.gameHeight / 3 * 2);
    this.createDirt(game.WORLDWIDTH / 2 - 3 * game.TILESIZE, this.engine.gameHeight / 3 * 2);
    this.createDirt(game.WORLDWIDTH / 2 + 3 * game.TILESIZE, this.engine.gameHeight / 3 * 2);

    // Create stickman
    game.stickman = this.physics.add.sprite(game.WORLDWIDTH / 2, this.engine.gameHeightCenter, "stickman");
    game.stickman.setScale(8);
    game.stickman.setDragX(1000);
    game.stickman.setCollideWorldBounds(true);
    game.stickman.dir = true;

    // Create water
    game.water = this.physics.add.group();

    // Create... NEIGHBORS!
    game.neighbors = this.physics.add.group();
    for (var i = 0; i < 5; i++) {
      let neighbor = game.neighbors.create(Math.random() * game.WORLDWIDTH, Math.random() * this.engine.gameHeight, "neighborStickman");
      neighbor.setScale(8);
      neighbor.setCollideWorldBounds(true);
      neighbor.dir = true;
    }

    // ---------- It's a big world after all! ----------
    this.cameras.main.setBounds(0, 0, 2000, this.engine.gameHeight);
    this.physics.world.setBounds(0, 0, 2000, this.engine.gameHeight);
    this.cameras.main.startFollow(game.stickman, true, 0.1, 0.1);

    // ---------- Colliders! ----------
    this.physics.add.collider(game.stickman, game.dirt);
    this.physics.add.collider(game.dirt, game.dirt);
    this.physics.add.collider(game.neighbors, game.dirt);
    this.physics.add.collider(game.water, game.dirt, (water, dirt) => {
      setTimeout(function () {
        water.destroy();
      }, 2000);
    });
    this.physics.add.collider(game.neighbors, game.water);

    // ---------- Animation! ----------
    this.engine.addAnimation("stickmanWalk", 5, false, false, "stickmanWalk0", "stickmanWalk1");

    // ---------- Move the neighbors! ----------
    this.engine.setPhaserInterval(() => {
      game.neighbors.getChildren().forEach(neighbor => {
        if (Math.floor(Math.random() * 2) === 1) {
          neighbor.setVelocityX(this.engine.randomBetween(0, 800));
          neighbor.dir = true;
        } else {
          neighbor.setVelocityX(this.engine.randomBetween(-800, 0));
          neighbor.dir = false;
        }
        if (neighbor.body.touching.down) {
          neighbor.setVelocityY(this.engine.randomBetween(-1000, 1000));
        }
      });
    }, 1000);

    // ---------- Neighbor actions! ----------
    this.engine.setPhaserInterval(() => {
      game.neighbors.getChildren().forEach(neighbor => {
        this.shootWater(neighbor.x, neighbor.y, neighbor.dir, 500);
      });
    }, 100);
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
      this.shootWater(game.stickman.x, game.stickman.y, game.stickman.dir, game.waterSpeed);
    }
  }
}
