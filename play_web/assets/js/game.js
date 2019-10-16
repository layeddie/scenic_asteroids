import { throttle } from './throttle.js'

const scaleFactor = 0.6;
const gameWidth = 800 * scaleFactor;
const gameHeight = 350 * scaleFactor
var config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var cursors;
var keys;
var arrows;
var game;
var fullScreenBtnGroup;
var fullScreenBtn;
var shooting = false;

// Circle location is used to calculate the angle for firing
const arrowBaseX = 100;
const arrowBaseY = 100;
const circleX = 350;
const circleY = 100;

window.onCreateGame = function() {
  game = new Phaser.Game(config);
  window.game = game
}

function preload() {
  this.load.image('arrow', '/images/arrow.png');
  this.load.image('fullscreen', '/images/full-screen.png');
}

function create() {
  var that = this;

  arrows = this.physics.add.staticGroup();
  createArrows(arrows);

  fullScreenBtnGroup = this.physics.add.staticGroup();
  fullScreenBtn = fullScreenBtnGroup.create(gameWidth - 20, 20, 'fullscreen').setInteractive();
  fullScreenBtn.name = "full-screen-btn"

  this.input.on('gameobjectdown', function(pointer, gameObject) {

    if (isArrow(gameObject)) {
      const direction = arrowToDirection(gameObject);
      console.log("send", direction);

      sendSetDirection(direction);
    } else if(gameObject.name == "full-screen-btn") {
      if (that.scale.isFullscreen) {
        that.scale.stopFullscreen();
      } else {
        that.scale.startFullscreen();
      }
  
    } else {
      console.log("clicked on", gameObject.name);
    }
  });

  this.input.on('gameobjectup', function(pointer, gameObject) {
    if (isArrow(gameObject)) {
      const direction = arrowToDirection(gameObject);
      console.log("done", direction);
      sendClearDirection(direction);
    }
  });

  cursors = this.input.keyboard.createCursorKeys();
  keys = {};

  var graphics = this.add.graphics({ fillStyle: { color: 0x00ff00 } });

  var circle = new Phaser.Geom.Circle(circleX, circleY, 15);

  function drawCircle () {
    graphics.fillCircleShape(circle);
  }

  drawCircle(graphics, circle);

  this.input.on('pointerdown', function (pointer) {
    console.log('pointer down!');
    var touchX = pointer.x;
    var touchY = pointer.y;
    console.log(`x: ${touchX} y:${touchY}`);

    var relX = touchX - circleX;
    var relY = touchY - circleY;
    // Only shoot if the touch is near the circle (ideally this area would be a
    // circle but it isn't really that important)
    if (Math.abs(relX) < 100 && Math.abs(relY) < 100) {
      shooting = true;
      sendShootDirection(relX, -relY);
    }
  });

  this.input.on('pointerup', function (pointer) {
    if (shooting) {
      shooting = false;
      clearShooting();
    }
  });

  this.input.keyboard.on('keydown-SPACE', function (event) {
    sendShoot();
  });

  this.input.keyboard.on('keyup-SPACE', function (event) {
    clearShooting();
  });

  this.input.keyboard.on('keydown-F', function (event) {
    if (that.scale.isFullscreen) {
      that.scale.stopFullscreen();
    } else {
      that.scale.startFullscreen();
    }
  })

  this.input.keyboard.on('keydown-Q', function (event) {
    window.onRotateLeft();
  })
  this.input.keyboard.on('keyup-Q', function (event) {
    window.onClearRotateLeft();
  })

  this.input.keyboard.on('keydown-E', function (event) {
    window.onRotateRight();
  })
  this.input.keyboard.on('keyup-E', function (event) {
    window.onClearRotateRight();
  })
  this.input.keyboard.on('keydown', function (event) {
    // console.log('')
    const direction = keyToDirection(event.key)
    if (direction) {
      sendSetDirection(direction);
    }
  })
  this.input.keyboard.on('keyup', function (event) {
    const direction = keyToDirection(event.key)
    if (direction) {
      sendClearDirection(direction);
    }
  })
}

function arrowToDirection(gameObject) {
  switch(gameObject.name) {
    case 'right-arrow': return 'right';
    case 'down-arrow': return 'down';
    case 'left-arrow': return 'left';
    case 'up-arrow': return 'up';
    default: return false;
  }
}

function isArrow(gameObject) {
  return ['right-arrow', 'down-arrow', 'left-arrow', 'up-arrow'].indexOf(gameObject.name) !== -1
}

function createArrows() {
  const offset = 50;

  var rightArrow = arrows.create(arrowBaseX + offset, arrowBaseY, 'arrow').setInteractive();
  rightArrow.name = "right-arrow";

  var downArrow = arrows.create(arrowBaseX, arrowBaseY + offset, 'arrow').setInteractive();
  downArrow.name = "down-arrow";
  downArrow.angle = 90;

  var leftArrow = arrows.create(arrowBaseX - offset, arrowBaseY, 'arrow').setInteractive();
  leftArrow.name = "left-arrow";
  leftArrow.angle = 180;

  var upArrow = arrows.create(arrowBaseX, arrowBaseY - offset, 'arrow').setInteractive();
  upArrow.name = "up-arrow";
  upArrow.angle = 270;
}

// game.input.addPointer(3);

function recordDirection(direction) {
  sendSetDirection(direction);
  // Need to keep track of if this key is currently pressed so we know when it
  // transitions
  if (!keys[direction]) {
    console.log(`recording direction: ${direction}`)
    keys[direction] = true;
    // sendSetDirection(direction);
  }
}

function unRecordDirection(direction) {
  if (keys[direction]) {
    keys[direction] = false;
    console.log('unrecord ' + direction);
    sendClearDirection(direction);
  }
}
// var sendSetDirectionThrottled = throttle(sendSetDirection, 200)
// var sendSetDirection = throttle(function(direction) {
//   console.log("send set direction with direction", direction)
//   window.onDirection(direction);
// }, 200);

function sendSetDirection(direction) {
  // window.onDirection(direction);
  recordDirectionFunctions[direction]()
}

function sendClearDirection(direction) {
  window.onClearDirection(direction);
}

function sendShoot() {
  window.onSendShoot();
}

function sendShootDirection(relX, relY) {
  window.onSendShootDirection(relX, relY);
}

function clearShooting() {
  window.onClearShooting();
}

function update() {
  // console.log('update!')
  // console.log("keys", keys);

  // console.log("cursors.left", cursors.left)

  // TODO: Use this to periodically send the orientation of the ship
  // var pointer = game.input.activePointer;
  // if (pointer.isDown) {
  //   var touchX = pointer.x;
  //   var touchY = pointer.y;
  //   console.log(`x: ${touchX} y:${touchY}`);

  //   var relX = arrowBaseX - touchX;
  //   var relY = arrowBaseY - touchY;
  //   console.log(`relX: ${relX} relY: ${relY}`)
  // }

  // console.log("cursors.left.isDown", cursors.left.isDown);
  // console.log("cursors.right.isDown", cursors.right.isDown);
  // console.log("cursors.up.isDown", cursors.up.isDown);
  // console.log("cursors.down.isDown", cursors.down.isDown);

  if (cursors.left.isDown) {
    recordDirection('left');
  } else {
    unRecordDirection('left');
  }

  if (cursors.up.isDown) {
    recordDirection('up');
  } else {
    unRecordDirection('up');
  }

  if (cursors.right.isDown) {
    recordDirection('right');
  } else {
    unRecordDirection('right');
  }

  if (cursors.down.isDown) {
    recordDirection('down');
  } else {
    unRecordDirection('down');
  }
}

function keyToDirection(key) {
  switch(key) {
    case 'w': return 'up'
    case 'a': return 'left'
    case 's': return 'down'
    case 'd': return 'right'
    default: return null
  }
}

const throttleTimeMs = 300
var recordDirectionFunctions = {
  up: throttle(() => window.onDirection('up'), throttleTimeMs),
  left: throttle(() => window.onDirection('left'), throttleTimeMs),
  down: throttle(() => window.onDirection('down'), throttleTimeMs),
  right: throttle(() => window.onDirection('right'), throttleTimeMs)  
}

