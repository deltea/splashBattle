// Splash Battle
/*^*^*^*^*^*^*^*
script.js
The main script for Splash Battle.
*^*^*^*^*^*^*^*/

let game = {
  TILESIZE: 8,
  GRAVITYY: 1500,
  WORLDWIDTH: 2000,
  playerSpeed: 400,
  playerJumpHeight: 700,
  waterSpeed: 700,
  waterYVel: 0,
  waterYVelDir: true,
  currentGun: "basic",
  jetpack: true
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
  shootWater(x, y, dir, speed, isPlayers) {
    let water = game.water.create(x, y, "water");
    water.setScale(8);
    water.setVelocityY(-game.waterYVel);
    water.setCollideWorldBounds(true);
    water.setBounce(0.5);
    water.setDragX(100);
    water.setDepth(-1);
    if (dir) {
      water.setVelocityX(speed);
    } else {
      water.setVelocityX(-speed);
    }
    water.isPlayers = isPlayers;
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
    this.load.image("myHouse", "assets/myHouse.png");
    this.load.image("neighborsHouse", "assets/neighborsHouse.png");
    this.load.image("stickmanGun", "assets/stickmanGun.png");
    this.load.image("neighborsGun", "assets/neighborsGun.png");
    this.load.image("tree", "assets/tree.png");
    this.load.image("jetpackStickman0", "assets/jetpackStickman0.png");
  }
  create() {
    // Create keyboard
    game.keyboard = this.input.keyboard.createCursorKeys();

    // Create tree
    let dirtSize = 3 * game.TILESIZE;
    this.add.image(game.WORLDWIDTH / 2, this.engine.gameHeight - (dirtSize + 288), "tree").setScale(16).setDepth(-1);

    // Create houses
    this.add.image(100, this.engine.gameHeight - dirtSize - 160, "myHouse").setScale(8).setDepth(-1);
    this.add.image(game.WORLDWIDTH - 100, this.engine.gameHeight - dirtSize - 160, "neighborsHouse").setScale(8).setDepth(-1);

    // Create dirt
    game.dirt = this.physics.add.group();
    for (var x = 0; x < game.WORLDWIDTH / 3 * game.TILESIZE; x += 3 * game.TILESIZE) {
      this.createDirt(x, this.engine.gameHeight - 8);
    }
    this.createDirt(800, this.engine.gameHeight - 100);
    this.createDirt(800 + dirtSize, this.engine.gameHeight - 100);
    this.createDirt(800 - dirtSize, this.engine.gameHeight - 100);
    this.createDirt(game.WORLDWIDTH - 800, this.engine.gameHeight - 100);
    this.createDirt(game.WORLDWIDTH - 800 + dirtSize, this.engine.gameHeight - 100);
    this.createDirt(game.WORLDWIDTH - 800 - dirtSize, this.engine.gameHeight - 100);
    this.createDirt(1010, 200);
    this.createDirt(1010 + dirtSize, 200);
    this.createDirt(1010 + dirtSize * 2, 200);
    this.createDirt(1000 + dirtSize * 3, 190);
    this.createDirt(960, 280);
    this.createDirt(960 - dirtSize, 280);
    this.createDirt(960 - dirtSize * 2, 270);
    this.createDirt(game.WORLDWIDTH - 600, this.engine.gameHeight - 200);
    this.createDirt(game.WORLDWIDTH - 600 + dirtSize, this.engine.gameHeight - 200);
    this.createDirt(game.WORLDWIDTH - 600 - dirtSize, this.engine.gameHeight - 200);
    this.createDirt(game.WORLDWIDTH - 800, this.engine.gameHeight - 300);
    this.createDirt(game.WORLDWIDTH - 800 + dirtSize, this.engine.gameHeight - 300);
    this.createDirt(game.WORLDWIDTH - 800 - dirtSize, this.engine.gameHeight - 300);
    this.createDirt(600, this.engine.gameHeight - 200);
    this.createDirt(600 + dirtSize, this.engine.gameHeight - 200);
    this.createDirt(600 - dirtSize, this.engine.gameHeight - 200);
    this.createDirt(800, this.engine.gameHeight - 300);
    this.createDirt(800 + dirtSize, this.engine.gameHeight - 300);
    this.createDirt(800 - dirtSize, this.engine.gameHeight - 300);

    // Create stickman
    game.stickman = this.physics.add.sprite(game.WORLDWIDTH / 2, this.engine.gameHeightCenter, "stickman");
    game.stickman.setScale(8);
    game.stickman.setDragX(1000);
    game.stickman.setCollideWorldBounds(true);
    game.stickman.dir = true;

    // Create gun
    game.stickman.gun = this.add.image(0, 0, "stickmanGun");
    game.stickman.gun.setScale(8);

    // Create water
    game.water = this.physics.add.group();

    // Create... NEIGHBORS!
    game.neighbors = this.physics.add.group();
    for (var i = 0; i < 10; i++) {
      let neighbor = game.neighbors.create(Math.random() * game.WORLDWIDTH, Math.random() * this.engine.gameHeight, "neighborStickman");
      neighbor.setScale(8);
      neighbor.setCollideWorldBounds(true);
      neighbor.dir = true;
      neighbor.health = 100;
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
    this.physics.add.overlap(game.neighbors, game.water, (neighbor, water) => {
      if (water.isPlayers) {
        neighbor.health--;
        if (neighbor.health <= 0) {
          neighbor.destroy();
        }
        water.destroy();
      }
    });
    this.physics.add.overlap(game.stickman, game.water, (stickman, water) => {
      if (!water.isPlayers) {
        water.destroy();
      }
    });

    // ---------- Animation! ----------
    this.engine.addAnimation("stickmanWalk", 5, false, false, "stickmanWalk0", "stickmanWalk1");

    // ---------- Move the neighbors! ----------
    this.engine.setPhaserInterval(() => {
      game.neighbors.getChildren().forEach(neighbor => {
        if (game.stickman.x >= neighbor.x) {
          neighbor.setVelocityX(this.engine.randomBetween(0, 800));
          neighbor.dir = true;
        } else {
          neighbor.setVelocityX(this.engine.randomBetween(-800, 0));
          neighbor.dir = false;
        }
        if (game.stickman.y < neighbor.y) {
          neighbor.setVelocityY(this.engine.randomBetween(-1000, 0));
        }
      });
    }, 1000);

    // ---------- Neighbor actions! ----------
    this.engine.setPhaserInterval(() => {
      game.neighbors.getChildren().forEach(neighbor => {
        this.shootWater(neighbor.x, neighbor.y, neighbor.dir, 500, false);
      });
    }, 100);
  }
  update() {
    if (!game.jetpack) {
      // ---------- Normal Movement ----------
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
    } else {
      // ---------- Jetpack Time! ----------
      game.stickman.setGravityY(game.GRAVITYY);
      game.stickman.setTexture("jetpackStickman0");
      if (game.keyboard.up.isDown) {
        this.physics.velocityFromAngle(game.stickman.angle - 90, 500, game.stickman.body.velocity);
      }
      if (game.keyboard.left.isDown) {
        game.stickman.angle -= 3;
      }
      if (game.keyboard.right.isDown) {
        game.stickman.angle += 3;
      }
    }

    // ---------- Shooting water ----------
    if (game.keyboard.space.isDown) {
      if (game.currentGun === "triple-barrel") {
        this.shootWater(game.stickman.gun.x, game.stickman.gun.y - 24, game.stickman.dir, game.waterSpeed - 100, true);
        this.shootWater(game.stickman.gun.x, game.stickman.gun.y - 24, game.stickman.dir, game.waterSpeed, true);
        this.shootWater(game.stickman.gun.x, game.stickman.gun.y - 24, game.stickman.dir, game.waterSpeed + 100, true);
      } else if (game.currentGun === "make-it-rain") {
        for (var i = 0; i < 10; i++) {
          this.shootWater(game.stickman.gun.x, game.stickman.gun.y, game.stickman.dir, game.waterSpeed + i * 20, true);
        }
      } else if (game.currentGun === "fountain") {
        for (var i = 0; i < 5; i++) {
          let margin = 250;
          let water = game.water.create(game.stickman.gun.x, game.stickman.gun.y - 40, "water");
          water.setScale(8);
          water.setVelocityY(-game.waterYVel);
          water.setCollideWorldBounds(true);
          water.setBounce(0.5);
          water.setDragX(100);
          water.setVelocityY(-1000);
          water.setVelocityX(-(2 * margin) + i * margin);
          water.isPlayers = true;
        }
      } else {
        this.shootWater(game.stickman.gun.x, game.stickman.gun.y - 24, game.stickman.dir, game.waterSpeed, true);
      }
    }

    // Wobble water
    if (game.waterYVel > 300) {
      game.waterYVelDir = !game.waterYVelDir;
    } else if (game.waterYVel <= 0) {
      game.waterYVelDir = !game.waterYVelDir;
    }
    if (game.waterYVelDir) {
      game.waterYVel -= 20;
    } else {
      game.waterYVel += 20;
    }

    // Update gun pos
    if (game.stickman.dir) {
      game.stickman.gun.x = game.stickman.x + 40;
      game.stickman.gun.flipX = false;
    } else {
      game.stickman.gun.x = game.stickman.x - 48;
      game.stickman.gun.flipX = true;
    }
    game.stickman.gun.y = game.stickman.y + 32;
  }
}
