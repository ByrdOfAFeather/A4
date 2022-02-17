function random(min, max) {
    //https://www.techiedelight.com/generate-random-number-between-javascript/
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
class ChangingShape {
    constructor(initX, initY) {
        this.x = initX;
        this.y = initY;
        this.radius = 5;
        this.fillColor = "black";
        this.strokeColor = "black";
        this.velocity_x = 1;
        this.velocity_y = 1;
        this.currentShape = "circle";
    }

    _drawBall(context) {
        context.save();
        context.beginPath();
        context.translate(this.x, this.y);
        context.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        context.restore();
    }

    drawBall(context) {
        this._drawBall(context);
        context.fillStyle = this.fillColor;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = this.strokeColor;
        context.stroke();
    }

    _drawTriangle(context) {
        context.save();
        context.beginPath();
        context.translate(this.x, this.y);
        context.lineTo(0,0);
        context.lineTo(this.radius * 2, 0);
        context.save();
        context.translate(this.radius * 2, 0);
        context.save();
        context.rotate( -(2*Math.PI / 3));
        context.lineTo(0,0);
        context.lineTo(this.radius * 2,0);
        context.save();
        context.translate(this.radius * 2, 0);
        context.save();
        context.rotate(-(2*Math.PI / 3));
        context.lineTo(0,0);
        context.lineTo(this.radius * 2,0);
        context.restore();
        context.restore();
        context.restore();
        context.restore();
        context.restore();
    }

    drawTriangle(context) {
        this._drawTriangle(context);
        context.fillStyle = this.fillColor;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = this.strokeColor;
        context.stroke();
    }

    _drawSquare(context) {
        context.save();
        let sideLength = Math.sqrt(Math.PI*this.radius ** 2);
        context.beginPath();
        context.translate(this.x, this.y);
        context.lineTo(0,0);
        context.lineTo(sideLength, 0);
        context.lineTo(sideLength, sideLength);
        context.lineTo(0, sideLength);
        context.lineTo(0,0);
        context.restore();
    }

    drawSquare(context) {
        this._drawSquare(context);
        context.fillStyle = this.fillColor;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = this.strokeColor;
        context.stroke();
    }

    draw(context) {
        if (this.currentShape === "circle") {
            this.drawBall(context);
        } else if (this.currentShape === "triangle") {
            this.drawTriangle(context);
        } else {
            this.drawSquare(context);
        }
    }

    setShape(newShape) {
        this.currentShape = newShape;
    }
}

class Obstacle extends ChangingShape {
    constructor(initx, inity) {
        super(initx, inity);
        this.x = initx;
        this.y = inity;
        this.velocityX = 5;
        this.velocityY = 5;
        // this.width = initWidth;
        // this.height = initHeight;
        // this.fillColor = initFillColor;
        // this.strokeColor = initStrokeColor;
    }

    checkBoundingBox(context, pointX, pointY, shape) {
        if (this.currentShape === "circle") {
            super._drawBall(context);
        } else if (this.currentShape === "triangle") {
            super._drawTriangle(context);
        } else {
            super._drawSquare(context);
        }
        if (context.isPointInPath(pointX, pointY)) {
            return this.currentShape !== shape;
        } else return false;
    }

    draw(context){
        super.draw(context);
    }
}

//A list of keys that are currently pressed down
var keysdown = {};

//Event listener for when the user presses a key
window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  
  keysdown[event.key] = true;

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
// the last option dispatches the event to the listener first,
// then dispatches event to window

//Event listener for when the user releases a key
window.addEventListener("keyup", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  
  keysdown[event.key] = false;

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
// the last option dispatches the event to the listener first,
// then dispatches event to window

window.onload = function() {
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");
  let primaryShape = new ChangingShape(canvas.width / 2, canvas.height / 2);
  let framesThisSecond = 0;
  let fps = 0;
  let updateCount = 0;
  let lag = 0.0;
  let MS_PER_UPDATE = 1000/60;
  let lastFrameTimeMs = 0;
  primaryShape.radius = 10;
  let previousTime = window.performance.now();
  let lastAdd = previousTime
  let tempTester = new Obstacle(canvas.width / 2, canvas.height / 2);
  let obst = [];
  tempTester.radius = 15;
  let score = 0;
  let gameOver = false;

  requestAnimationFrame(mainLoop);

  function mainLoop(timestamp) {
      if (gameOver) {
          	context.clearRect(0, 0, canvas.width, canvas.height);
          context.font = '15px serif';

    context.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2);

      } else {
          processInput();
    let currentTime = window.performance.now();
    let diffInMilli = currentTime - previousTime;
    previousTime = currentTime;
    lag += diffInMilli;
    if (lag >= MS_PER_UPDATE) {
        	update();
            lag -= MS_PER_UPDATE;
    }
	draw();

	requestAnimationFrame(mainLoop);
      }

  }
  
  //Handle user input by adjusting ball velocity based on keys pressed
  function processInput()
  {
    if(keysdown.ArrowLeft) {
		primaryShape.velocity_x -= 1; //equivalent to ball.velocity_x = ball.velocity_x - 1;
        primaryShape.setShape("triangle");
        // primaryShape.fillColor = "green";
	}
    
    if(keysdown.ArrowUp){
		primaryShape.velocity_y -= 1;
        primaryShape.setShape("circle");
        // primaryShape.fillColor = "red";
	}
				
	if (keysdown.ArrowRight) {
		primaryShape.velocity_x += 1;
        primaryShape.setShape("square");
        // primaryShape.fillColor = "blue";
	}
				
	if (keysdown.ArrowDown) {
		primaryShape.velocity_y += 1;
	}
  }
  
  function update() {
      let updateVelocity = (velocityObject) => {
          velocityObject.x += velocityObject.velocity_x; //equivalent to ball.x = ball.x + ball.velocity_x;
	velocityObject.y += velocityObject.velocity_y;

    //make the ball bounce off the walls
	if (velocityObject.x >= canvas.width) {
      velocityObject.velocity_x *= -1;
      // primaryShape.x = canvas.width;
	}

	if (velocityObject.x <= 0) {
      velocityObject.velocity_x *= -1;
	}

	if (velocityObject.y >= canvas.height) {
      velocityObject.velocity_y *= -1;
	}

	if (velocityObject.y <= 0) {
      velocityObject.velocity_y *= -1;
	}
    if (updateCount < 100) {
        console.log("ball.x: " + velocityObject.x);
    }
      }
      updateVelocity(primaryShape);
      obst.forEach((obsti) => updateVelocity(obsti));

    //update position based on velocity
    obst.forEach((obst) => {
        if (obst.checkBoundingBox(context, primaryShape.x, primaryShape.y, primaryShape.currentShape)) {
            console.log("game over")
            gameOver = true;
        }
      })

    if (window.performance.now() - lastAdd >= 1000) {
        score += 1;
         if (Math.random() > .5) {
        // add new object of some type
        let chance = Math.random();
        if (chance < .33) {
            // green
            let newOb = new Obstacle(0,0);
            newOb.radius = random(10, 50);
            newOb.velocity_x = random(0, 15);
            newOb.velocity_y = random(0,15);
            newOb.setShape("triangle");
            newOb.fillColor = "green";
            obst.push(newOb);
        } else if (chance >= .33 && chance <.66) {
            // blue
            let newOb = new Obstacle(0,0);
            newOb.radius = random(10, 50);
            newOb.velocity_x = random(0, 15);
            newOb.velocity_y = random(0,15);
            newOb.setShape("square");
            newOb.fillColor = "blue";
            obst.push(newOb);
        } else {
            // red
            let newOb = new Obstacle(0,0);
            newOb.radius = random(10, 50);
            newOb.velocity_x = random(0, 15);
            newOb.velocity_y = random(0,15);
            newOb.setShape("circle");
            newOb.fillColor = "red"
            obst.push(newOb);
        }
        lastAdd = window.performance.now()
    }
    }
    
    updateCount++;
  }
  
  function draw() {			
    //clear our drawing
	context.clearRect(0, 0, canvas.width, canvas.height);
    primaryShape.draw(context);
    obst.forEach((obsti) => obsti.draw(context));
    context.fillText("SCORE: " + score, 10, 10);
    ++framesThisSecond;
    if (updateCount < 100) {
        console.log("updatesThusFar: " + updateCount);
    }
  }


    setInterval(function() { fps = framesThisSecond; framesThisSecond = 0; }, 1000);
}