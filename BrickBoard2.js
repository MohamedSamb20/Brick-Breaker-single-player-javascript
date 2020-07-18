
var ingame = true;//you can set to false to control start of game
var BOARD_WIDTH=500;//dimension of board
var BOARD_HEIGHT=600;//dimension of board
var ballx = 250;//starting x value for ball
var bally = 430;//starting y value for ball
var xchange = 3;//change in x value per time frame
var ychange = -1;//change in y value per time frame
var bricks = [];//controls all the blocks
var totalBricks = 50;
var showBrick = [];//controls all the blocks visibility
var paddlex = 250;//starting paddle x coordinate
var paddley = 450;//starting paddle y coordinate
var paddleLeft = false;//variable to move paddle left
var paddleRight = false;//variable to move paddle right
var win = false;//tracks if you win the game
var play = false;//tracks if a game has already been played
var lives = 3;//three lives
score = "";//score string
var scores= 0;//tracks the score
var message = "Lives: ";//string that displays lives left
var incSpeed = false;//variable to increase ball speed
var decSpeed = false;//variable to decrease ball speed
var hits = 0;//tracks how many times the ball hits the paddle

drawCanvas();//calls the draw canvas function

function Brick(row, column, length, width) //object for all of the bricks
{
  this.row = row;
  this.column = column;
  this.length = length;
  this.width = width;
}


function BrickBoard()
{
  var rowpos = 50;
  var colpos = 50;
  var count = 1;
  for(var i=0; i<totalBricks; i++)
  {
      bricks[i] = new Brick(rowpos, colpos, 30, 30);//creates 50 bricks
      showBrick[i] = true;//makes the bricks appear on the screen
      rowpos += 40;
      if(count%10 == 0)//if there are 10 blocks in a row...
      {
          rowpos = 50;
          colpos += 40;//starts a new row
      }
      count++;
  }
}

function drawAll()
{
  context.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);//creates the screen
  context.fillStyle = "#00FFFF";
  context.fillRect(0,0,3,600);
  context.fillRect(0,0,500,3);
  context.fillRect(497,0,3,600);
  context.fillRect(0,497,500,3);
  context.fillRect(0,597,500,3);

  context.font = "14px BOLD-Helvetica";
  context.fillStyle = "#000000";
  context.fillText(message + lives.toString(), 10, BOARD_HEIGHT - 160);//displays starting message and/or the amount of lives you have
  context.fillText("score: "+score, 400, 20);//displays the score
  for(i=0; i<bricks.length; i++)
  {
    if(showBrick[i])
    {
      context.fillStyle = "#ffff00";
      context.fillRect(bricks[i].row, bricks[i].column, 30, 30);//makes 50 yellow blocks
    }
  }
  context.fillStyle = "#008000";
  context.fillRect(paddlex, paddley, 100, 50);//makes the green paddle
  context.fillStyle = "#0000ff";
  context.beginPath();
  context.arc(ballx, bally, 10, 0, 2*Math.PI);//makes the blue ball
  context.fill();
  if(win && ingame == false && play)//if you win
  {
    context.font = "35px BOLD-Helvetica";
    context.fillStyle = "#000000"
    context.fillText("WINNER", 200, BOARD_HEIGHT-200);//message to say winner
  }
  else if(win == false && ingame == false && play)//if you lose
  {
    context.font = "35px BOLD-Helvetica";
    context.fillStyle = "#000000"
    context.fillText("LOSER", 200, BOARD_HEIGHT-200);//message to say loser
  }
  window.requestAnimationFrame(drawAll);//loops the animation
}

function bounceBall()
{
  if(ballx <= 0 || ballx >= BOARD_WIDTH)
  {
    xchange = -1*xchange;//change in slope if it hits the sides
  }
  if(bally <= 0)
  {
    ychange = -1*ychange;//changes in slope it it hits the top
  }

  if(ballx>= paddlex && ballx<= paddlex+100 && bally>= paddley && bally<=paddley+50)
  {
    ychange = -1*ychange;//change in slope if it hits the paddle
    hits++;
    if(incSpeed)
    {
      ychange -= 1;//increases the magnitude of the slope
    }
    if(decSpeed)
    {
      if(ychange != -1)
      {
        ychange += 1;//increases the magnitude of the slope
      }
    }
  }

  if(bally >= 500)//if the ball hits the floor
  {
    lives--;//takes away a life
    scores -= 500;//takes aways 500 every time you lose a life
    if(lives == 0)
    {
      win = false;//didnt win
      ingame = false;//the game isn't on
      play = true;//the game ended
    }
    else
    {
      ballx = 250;//moves ball to original spot
      bally = 430;//moves ball to original spot
      xchange += 3+(2*(3-lives));//makes speed faster
      ychange += -1-(2*(3-lives));//makes speed faster
      paddlex = 250;//moves paddle to original spot
      paddley = 450;//moves paddle to original spot
      paddleLeft = false;
      paddleRight = false;
    }
  }
  for(var i=0; i<bricks.length; i++)
  {
    if(showBrick[i]== true && ballx + 10 > bricks[i].row && ballx < bricks[i].row + bricks[i].length && bally + 10 > bricks[i].column && bally < bricks[i].column + bricks[i].width)
    {
      showBrick[i] = false;//makes the brick disappear
      scores+= 50;//adds to the score when a block is it
      var speed = Math.sqrt(Math.pow(xchange,2)+Math.pow(ychange,2));//gets the speed of the ball
      var angle = (Math.random()*Math.PI)/2;//picks a random angle that the ball will hit off at
      if(ychange>0)
      {
        ychange = speed*Math.sin(angle);//changes the speed, keeps the direction
      }
      else
      {
        ychange = speed*Math.sin(angle+Math.PI);//changes the speed, keeps the direction
      }
      if(xchange>0)
      {
        xchange = speed*Math.cos(angle+Math.PI);//changes the speed and the direction
      }
      else
      {
        xchange = speed*Math.cos(angle);//changes the speed and the direction
      }
    }
  }

  if(ingame)
  {
    for(var i=0; i<bricks.length; i++)
    {
      if(i == bricks.length -1)
      {
        if(showBrick[i]==false)
        {
          ingame = false;//the game isn't on
          win = true;//did win
          play = true;//have played the game
          scores += 1000-(15*hits);
        }
        else
        {
          i = bricks.length;
        }
      }
      if(showBrick[i]== true)
      {
        i = bricks.length;
      }
    }
    ballx += xchange;//changes position of ball
    bally += ychange;//changes position of ball
    score = scores.toString();//allows the score to be added to the screen
  }
}

function paddleMove()
{
  if(ingame)
  {
    if(paddleRight == true)
    {
      paddlex +=5;//moves paddle 5 units to the right
    }
    if(paddleLeft == true)
    {
      paddlex -= 5;//moves the paddle 5 units left
    }
  }
}

function myKeyDown(event)
// This function detects when keys are pressed to control the motion of the player and speed of the ball.
{
  keyCode = event.which;

  // If the key was '<', then go left
  if (keyCode == 37)
  {
    paddleLeft = true;
  }
  // If the key was '>', then go right
  if (keyCode == 39)
  {
    paddleRight = true;
  }
  // If the key was 'f', then ball gets faster
  if(keyCode == 70)
  {
    incSpeed = true;
  }
  // If the key was 's', then ball gets slower
  if(keyCode == 83)
  {
    decSpeed = true;
  }
}
function GoLeft()
{
  // If the player presses the move left button, the paddle will move that way.
  paddleLeft = true;
}
function GoSlow()
{
  // If the player presses the slow ball button, the ball will get slower.
  decSpeed = true;
}
function GoFast()
{
  // If the player presses the fast ball button, the ball will get faster.
  incSpeed = true;
}
function GoRight()
{
  // If the player presses the move right button, the paddle will move that way.
  paddleRight = true;
}
function myMouseOut()
{
  // If the player lifts finger off any button, stop going that way.
  paddleLeft = false;
  paddleRight = false;
  incSpeed = false;
  decSpeed = false;
}
function myKeyUp ()
{
  // If the player lifts finger off the key, stop going that way.
  paddleLeft = false;
  paddleRight = false;
  incSpeed = false;
  decSpeed = false;
}


function drawCanvas()
// Startup code
{
  // Listen to see if a key is pressed, link to event handler.
  document.addEventListener("keydown", myKeyDown);

  // Listen to see if a key goes from pressed to not pressed, link to an event handler.
  document.addEventListener("keyup", myKeyUp);

  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  if (windowWidth > BOARD_WIDTH)
  {
    document.getElementById("mainCanvas").width = BOARD_WIDTH;
    marginLR = (windowWidth - BOARD_WIDTH) / 2;
    document.getElementById("mainCanvas").style.marginLeft = marginLR;
  }
  else
  {
    document.getElementById("mainCanvas").width = windowWidth;
  }

  // Repeat for height.
  if (windowHeight > BOARD_HEIGHT)
  {
    document.getElementById("mainCanvas").height = BOARD_HEIGHT;
    marginUD = (windowHeight - BOARD_HEIGHT) / 2;
    document.getElementById("mainCanvas").style.marginTop = marginUD;
  }
  else
  {
    document.getElementById("mainCanvas").height = windowHeight;
  }
  // Find the canvas element in the HTML so I can refer to it later
  canvas = document.getElementById("mainCanvas");

  // Set up the context for the animation
  context = canvas.getContext("2d");

  BrickBoard();
  window.setInterval(bounceBall, 10);
  window.setInterval(paddleMove, 10);
  window.requestAnimationFrame(drawAll);
}
