// Splash Battle
/*^*^*^*^*^*^*^*
script.js
The main script for Splash Battle.
*^*^*^*^*^*^*^*/

class Game extends Phaser.Scene {
  constructor() {
    super();
  }
  preload() {
    this.engine = new Engine(this);
    
    // ---------- Load the assets ----------
    this.load.image("cursor", "assets/cursor.png");
  }
  create() {
    this.engine.pixelCursor();
  }
  update() {
    this.engine.updatePixelCursor();
  }
}
