
    (()=>{
    let mazelocked = false;
    //board
    let snakecol = "blue";
    const blockSize = 20;
    const rows = 30;
    const cols = 30;
    let room = 0;
    let board;
    let context;
    let choosing =  Math.round(Math.random() * 4) - 1;
    //score
    let score = 0;
    let mult = 1;
    let appleChoose;
    let appleColor;
    //other
    let sunColors = {
    base: 'yellow',
    inner: '#c78f00',
    outer: '#a17300'
    }
    let escapeOn = false;
    let deathReason = "";
    const Epsilon = 21;
    let wallArray = [];
    let poisonX;
    let poisonY;
    let portalX;
    let portalY;
    let portalX2;
    let portalY2;
    let blackHoleX;
    let blackHoleY;
    let sunX = 300;
    let sunY = 260;
    let neutronX;
    let neutronY;
    let goldX;
    let goldY;
    let hpX;
    let hpY;
    let grapeX;
    let grapeY;
let miniGrapes = {
  oneX: 0,
  oneY: 0,
  twoX: 0,
  twoY: 0,
  threeX: 0,
  threeY: 0,
  fourX: 0,
  fourY: 0,
  oneAlive: false,
 twoAlive: false,
  threeAlive: false,
  fourAlive: false,
}
    let hp = 3;
    const d = document;
    const gE = function(id){
      return d.getElementById(id);
    }
    const gEs = function(cls){
      return d.getElementsByClassName(cls);
    }
    
    //snake heads
    let snakeX = blockSize * 5;
    let snakeY = blockSize * 5;
    let velocityX = 0;
    let velocityY = 0;
    
    let snakeBody = [];
    //food
    let foodX;
    let foodY;
    let gameOver = false;
    
    function getHighScore() {
      // Get Item from LocalStorage or highScore === 0
      let highScore = localStorage.getItem('highScore') || 0;
      // If the user has more points than the currently stored high score then
      if (score > highScore) {
        // Set the high score to the users' current points
        highScore = parseInt(score);
        // Store the high score
        localStorage.setItem('highScore', highScore);
      }
      // Return the high score
      return highScore;
    }
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function updateHighScore() {
      gE("bestscore").innerHTML = 'Personal Best: ' + localStorage.highScore;
    }
    function updateHP(){
      gE("health").innerHTML = 'Health: ' + hp;
    }
    
      window.onload = function(){
      board = gE("board");
      board.height = rows * blockSize;
      board.width = cols * blockSize;
      context = board.getContext("2d"); //used for drawing on the board  
     appleChoose = Math.round(Math.random() * 1)
      placeFood();
      placePoison();
      placeGrape();

    blackHole();
    setInterval(()=>{
    if(room == 1 && blackHoleX <= 500 && blackHoleX >= -500){
    blackHoleX += Math.random() < 0.5 ? 1 - Math.random()*2 : 1;
    } else {
    blackHoleX -= Math.random() < 0.5 ? 1 + Math.random()*2 : 1;
    }
    if(room == 1 && blackHoleY <= 500 && blackHoleY >= -500){
      blackHoleY += Math.random() < 0.5 ? 1 - Math.random()*2 : 1;
      } else {
        blackHoleY -= Math.random() < 0.5 ? 1 + Math.random()*2 : 1;
        }
    }, 70)
    Neutron()
    setInterval(reset, 1000000)
      setInterval(placeGold, 2000);
      d.addEventListener("keyup", changeDirection);
      setInterval(update, 950 / 10);
      setInterval(updateHTML, 1000 / 100);
      setInterval(getHighScore, 1000/10);
      setInterval(updateHighScore, 1000/10);
      setInterval(updateHP, 1);
      setInterval(placeHP, 3000);
      }

      function sunCollision(sX, sY, objectX, objectY) {
        const objectSize = blockSize * 3;
        if (
          sX < objectX + objectSize &&
          sX + blockSize > objectX &&
          sY < objectY + objectSize &&
          sY + blockSize > objectY
        ) {
        escapeOn = true;
          sunColors.base = 'red'
          sunColors.inner = '#cf0000'
          sunColors.outer = '#9c0000'
          sleep(5000)
          .then(()=>{
        if (room == 1){
        gameOver = true;
        deathReason = "Didn't evacuate during sun explosion in time"
        } else {
        gE('escape').style.color = "green"
        gE('escape').innerHTML = "You can now enter outer space."
        escapeOn = false;
        setTimeout(()=>{
            gE('escape').style.color = "black"
        gE('escape').innerHTML = "";
        }, 7000)
        sunColors.base = 'yellow'
        sunColors.inner = '#c78f00',
        sunColors.outer = '#a17300'
        }
        })
        }
      }

    function updateHTML(){
      if (!gameOver){
        gE("gameover").style.display = 'none';
    
        } else if (gameOver){
          gE("gameover").style.display = 'block';
        document.getElementById('board').style.display = 'none'
        document.getElementById('thing1').style.display = 'none'
        } 
        gE("reason").innerHTML = deathReason
    let restart = gE("restartgame");
    restart.addEventListener("click", ()=>{
      gameOver = false;
      hp = 3
      gE("health").innerHTML = "Health: 3"
    score = 0
    gE("score").innerHTML = "Score: 0"
    room = 0;
    sunColors = {
      base: 'yellow',
      inner: '#c78f00',
      outer: '#a17300'
      }
      snakeY = 40;
        snakeX = 40;
        velocityX = 0;
        velocityY = 0;
        gE("escape").innerHTML= ""
      document.getElementById('board').style.display = 'inline-block'
document.getElementById('thing1').style.display = 'block'
gE("gameover").style.display = 'none';
  console.log("game restarted")
    })
    }
    function update() {
      if (escapeOn){
        if (room == 1){
            gE('escape').innerHTML = 'Get out <strong>NOW!</strong>'
             gE('escape').style.color = 'red'
        } else {
          gE('escape').innerHTML = 'Stay out of space until the sun cools down.'
          gE('escape').style.color = 'yellow'
      }
      
      }
      if (gameOver) {
        return;
      }
      if (appleChoose == 0){
        appleColor = "red"
      } else if (appleChoose == 1){
        appleColor = "lime"
      } else {
        appleColor = "orange"
      }
      if (room == 0){
    gE('room').innerHTML = "Main"
    gE('room').style.color = "black"
      } else if(room == 1){
      gE('room').innerHTML = "Outer Space"
      gE('room').style.color = "#131313"
      } else if(room == 2){
    gE('room').innerHTML = "The Fields"
    gE('room').style.color = "#7aa300"
      }
    
      if (hp <= 0){
        gameOver = true;
        hp = 3;
       deathReason = "Out of lives"
      };
      if (room == 0){
      context.fillStyle = "black";
      context.fillRect(0, 0, board.width, board.height);
      context.fillStyle = '#131313';
    context.fillRect(portalX, portalY, blockSize, blockSize);
      context.fillStyle = appleColor;
      context.fillRect(foodX, foodY, blockSize, blockSize);
      context.fillStyle = "purple";
      context.fillRect(poisonX, poisonY, blockSize, blockSize);

      context.fillStyle = "pink";
      context.fillRect(hpX, hpY, blockSize, blockSize);
      portalX = 580;
      portalY = 280;
      snakecol = "blue";
      } else if (room == 1){
      context.fillStyle = '#131313';
      context.fillRect(0, 0, board.width, board.height);
      context.fillStyle = 'black';
      context.fillRect(portalX, portalY, blockSize, blockSize);    
      context.fillStyle = '#658700';
      context.fillRect(portalX2, portalY2, blockSize, blockSize); 
      context.fillStyle = sunColors.outer;
      context.fillRect(sunX-20, sunY-20, blockSize*5, blockSize*5);
      context.fillStyle = sunColors.inner;
      context.fillRect(sunX-10, sunY-10, blockSize*4, blockSize*4);
      context.fillStyle = sunColors.base;
      context.fillRect(sunX, sunY, blockSize*3, blockSize*3);
      context.fillStyle = "cyan"
      context.fillRect(neutronX, neutronY, blockSize, blockSize)
      context.fillStyle = 'grey'
      context.fillRect(blackHoleX, blackHoleY, blockSize, blockSize)
      context.fillStyle = "yellow"
      context.fillRect(goldX, goldY, blockSize, blockSize)
      portalX = 0;
      portalY = 280;
      portalX2 = 580;
      portalY2 = 280;   
      snakecol = "#2bffff" 
      sunCollision(snakeX, snakeY, sunX, sunY)
      }else if (room == 2){
        context.fillStyle = '#7aa300';
        context.fillRect(0, 0, board.width, board.height);
        context.fillStyle = '#658700';
        context.fillRect(portalX2, portalY2, blockSize, blockSize); 
        context.fillStyle = "purple";
        context.fillRect(grapeX, grapeY, blockSize, blockSize);
        context.fillStyle = '#131313';
        context.fillRect(portalX, portalY, blockSize, blockSize); 
        portalX2 = 0;
        portalY2 = 280;
    snakecol = "blue"
    let wall = class{
    constructor(Xpos,Ypos, isTreasure, isThorn, isFakeTreasure){
      
    if (!isNaN(Xpos) && !isNaN(Ypos)){
    if (isTreasure && !isThorn && !isFakeTreasure){
    context.fillStyle = 'yellow';
    context.fillRect(Xpos, Ypos, blockSize, blockSize);
    } else if (!isTreasure && !isThorn && isFakeTreasure){
      context.fillStyle = '#e8e800';
      context.fillRect(Xpos, Ypos, blockSize, blockSize);
      } else if(!isTreasure && isThorn && !isFakeTreasure){
    context.fillStyle = 'green';
    context.fillRect(Xpos, Ypos, blockSize, blockSize);
    } else{
    context.fillStyle = 'black';
    context.fillRect(Xpos, Ypos, blockSize, blockSize);
}
    wallArray[wallArray.length] = [Xpos,Ypos, isTreasure, isThorn, isFakeTreasure];
    } else{
    return;
}
    }
    }
    if (choosing == 1){
    new wall(40, 20)
    new wall(60, 20)
    new wall(80, 20)
    new wall(100, 20)
    new wall(120, 20)
    console.log(1)
    } else if (choosing == 2){
    new wall(60, 0)
    new wall(60, 20)
    new wall(60, 40)
    new wall(60, 60)
    new wall(60, 80)
    new wall(60, 100)
    new wall(60, 120)
    new wall(60, 140)
    new wall(60, 160)
    new wall(60, 180)
    new wall(60, 200)
    new wall(60, 220)
    new wall(60, 240)
    new wall(120, 0)
    new wall(180, 20)
    new wall(120, 20)
    new wall(120, 80)
    new wall(140, 80)
    new wall(160, 80)
    new wall(140, 20)
    new wall(160, 20)
    new wall(120, 100)
    new wall(120, 120)
    new wall(120, 140)
    new wall(120, 160)
    new wall(120, 180)
    new wall(120, 200)
    new wall(120, 220)
    new wall(120, 240)
    new wall(120, 300)
    new wall(140, 300)
    new wall(180, 300)
    new wall(120, 320)
    new wall(60, 320)
    new wall(120, 340)
    new wall(60, 340)
    new wall(120, 360)
    new wall(120, 380, false, true)
    new wall(60, 380)
    new wall(60, 360)
    new wall(60, 300)
    new wall(40, 300)
    new wall(20, 300)
    new wall(0, 300)
    new wall(0, 240)
    new wall(20, 240)
    new wall(40, 240)
    new wall(200, 300)
    new wall(160, 300)
    new wall(200, 300)
    new wall(140, 240)
    new wall(160, 240)
    new wall(180, 240, false, true)
    new wall(180, 220)
    new wall(180, 200)
    new wall(180, 180)
    new wall(180, 160)
    new wall(180, 140)
    new wall(180, 120)
    new wall(180, 100, false, false, true)
    new wall(180, 0)
    new wall(180, 80, false, true)
    console.log(2)
    } else if (choosing == 3){
    new wall(20, 20)
    new wall(20, 40)
    new wall(40, 40)
    console.log(3)
    }
    for(let i = 0; i < wallArray.length; ++i) {
    let Xpos = wallArray[i][0]
    let Ypos = wallArray[i][1]
    let isTreasure = wallArray[i][2]
    let isThorn = wallArray[i][3]
    let isFakeTreasure = wallArray[i][4]
if (snakeX == Xpos && snakeY == Ypos && isTreasure && !isThorn && !isFakeTreasure){
    velocityX = 0;
    velocityY = 0;
    snakeX = 20;
    snakeY = 280;
    score += Math.floor(Math.random()*7)+15
    gE('score').innerHTML = 'Score: '+score;
    console.log('collected the treasure');
    mazelocked = true;
    console.log('maze locked')
    room = 1;
    } else if(snakeX == Xpos && snakeY == Ypos && !isTreasure && isThorn && !isFakeTreasure){
    velocityX = 0;
    velocityY = 0;
    snakeX = 20;
    snakeY = 280;
    hp--
    console.log('hit a thorn')
    velocityX = 0;
    velocityY = 0;
    snakeX = 20;
    snakeY = 280;
    } else if(snakeX == Xpos && snakeY == Ypos && !isTreasure && !isThorn && !isFakeTreasure){
    velocityX = 0;
    velocityY = 0;
    snakeX = 20;
    snakeY = 280;
    console.log('hit a wall')
    } else if (snakeX == Xpos && snakeY == Ypos && !isTreasure && !isThorn && isFakeTreasure){
      velocityX = 0;
      velocityY = 0;
      snakeX = 20;
      snakeY = 280;
      score -= Math.floor(Math.random()*7)+15
      gE('score').innerHTML = 'Score: ' + score;
      console.log('collected the wrong treasure');
      mazelocked = true;
      console.log('maze locked')
      room = 1;
      } 
}
        }
    
      if (snakeX == portalX && snakeY == portalY && room == 0){
        room = 1;
        while(snakeBody.length > 0){
        snakeBody.pop()
      }
    blackHole();
      velocityX = 0;
      velocityY = 0;
      snakeX = 20;
      snakeY = 280;
      }
       if (snakeX == portalX && snakeY == portalY && room == 1){
        room = 0;
        while(snakeBody.length > 0){
        snakeBody.pop()
      }
    
      velocityX = 0;
      velocityY = 0;
      snakeX = 560;
      snakeY = 280;
      }
       if (snakeX == portalX2 && snakeY == portalY2 && room == 1 && mazelocked == false){
       /* room = 2;
        while(snakeBody.length > 0){
        snakeBody.pop()} 
        velocityX = 0;
        velocityY = 0;
        snakeX = 20;
        snakeY = 280;*/
        while(snakeBody.length > 0){
          snakeBody.pop()
        }
        velocityX = 0;
        velocityY = 0;
        snakeX = 560;
        snakeY = 280;
        alert("The fields are locked for now, please check in later.")
      } else if (snakeX == portalX2 && snakeY == portalY2 && room == 1 && mazelocked == true){
        while(snakeBody.length > 0){
        snakeBody.pop()
      }
      velocityX = 0;
      velocityY = 0;
      snakeX = 560;
      snakeY = 280; 
      }  else if (snakeX == portalX2 && snakeY == portalY2 && room == 2){
        room = 1;
        while(snakeBody.length > 0){
        snakeBody.pop()
      }
      choosing = Math.round(Math.random() * 4) - 1
      velocityX = 0;
      velocityY = 0;
      snakeX = 560;
      snakeY = 280;
      }
      if (snakeX == neutronX && snakeY == neutronY && room == 1){
      score += Math.floor(Math.random()*-8)+5;
      snakeBody.push([neutronX, neutronY])
      neutronX = 999999;
      neutronY = 999999;
      setTimeout(Neutron, 9000)
      }
      if (snakeX == foodX && snakeY == foodY && room == 0) {
        snakeBody.push([foodX, foodY]);
        score = score + 1*mult
        gE("score").innerHTML = 'Score: ' + score;
        placeFood();
        appleChoose = Math.round(Math.random() * 1)
      }
      if (snakeX == hpX && snakeY == hpY && room == 0) {
        if(hp < 3){
        if (mult >= 2){
          hp += 1.5
        } else {
         hp++ 
        }
        placeHP();
      } else{
      score++
      }
      placeHP();
      }
    
      if (snakeX == poisonX && snakeY == poisonY && room == 0) {
        snakeBody.pop([poisonX, poisonY]);
        gE('score').style.color = 'purple'
        let poisonint = setInterval(()=>{
        score -= 1;
        hp -= 0.75
        gE("score").innerHTML = 'Score: ' + score;
        gE("health").innerHTML = 'Health: ' + health;
        }, 1000)
        sleep(3000).then(()=>{
        clearInterval(poisonint)
        gE('score').style.color = 'black'
       if (hp <= 0.5){
        hp = 0
        gameOver = true
        deathReason = "Succumbed to poison"
       } else {
        hp = 1
       }
        gE("score").innerHTML = 'Score: ' + score;
        gE("health").innerHTML = 'Health: ' + health;
        })
    
        gE("score").innerHTML = 'Score: ' + score;
        gE("health").innerHTML = 'Health: ' + health;
        placePoison();
      }
    
      if (snakeX == goldX && goldY == snakeY && room == 1) {
       goldThing();
      }
      const difference= Math.abs(blackHoleX-snakeX);
      const differencetwo= Math.abs(blackHoleY-snakeY);
      if(difference<Epsilon && differencetwo<Epsilon && room == 1){
        gameOver = true;
       deathReason = "Touched black hole"
      }
      async function goldThing(){
        mult = 2;
        gE("mult").innerHTML = 'Multiplier: ' + mult;
        placeGold()
        sleep(10000)
        .then(() => mult = 1)
        .then(() => gE("mult").innerHTML = 'Multiplier: ' + mult)
        .catch((err)=>{console.log(err)})
    
      }
    
      if (foodX == poisonX && foodY == poisonY) {
        placePoison();
        placeFood();
        appleChoose = Math.round(Math.random() * 1)
      }
      if (snakeX == grapeX && snakeY == grapeY && room == 2) {
        snakeBody.push([grapeX,grapeY]);
        score = score + 1 * mult
        gE("score").innerHTML = 'Score: ' + score;
        placeGrape();
        placeMiniGrape()
        setTimeout(()=>{miniGrapes.oneAlive = false; miniGrapes.twoAlive = false; miniGrapes.threeAlive = false; miniGrapes.fourAlive = false}, 4000)
 
        
      }
let wallX = wallArray[0]
let wallY = wallArray[1]
if (grapeX == wallX && wallY == grapeY){
  placeGrape()
}
if (miniGrapes.oneAlive == true){
  context.fillStyle = "purple"
  context.fillRect(miniGrapes.oneX, miniGrapes.oneY, blockSize/1.5, blockSize/1.5)
} else {
  context.fillStyle = "rgba(0,0,0,0)"
  context.fillRect(miniGrapes.oneX, miniGrapes.oneY, blockSize/1.5, blockSize/1.5)
}
if (miniGrapes.twoAlive == true){
  context.fillStyle = "purple"
  context.fillRect(miniGrapes.twoX, miniGrapes.twoY, blockSize/1.5, blockSize/1.5)
} else {
  context.fillStyle = "rgba(0,0,0,0)"
  context.fillRect(miniGrapes.twoX, miniGrapes.twoY, blockSize/1.5, blockSize/1.5)
}
if (miniGrapes.threeAlive == true){
  context.fillStyle = "purple"
  context.fillRect(miniGrapes.threeX, miniGrapes.threeY, blockSize/1.5, blockSize/1.5)
} else {
  context.fillStyle = "rgba(0,0,0,0)"
  context.fillRect(miniGrapes.threeX, miniGrapes.threeY, blockSize/1.5, blockSize/1.5)
}
if (miniGrapes.fourAlive == true){
  context.fillStyle = "purple"
  context.fillRect(miniGrapes.fourX, miniGrapes.fourY, blockSize/1.5, blockSize/1.5)
} else {
  context.fillStyle = "rgba(0,0,0,0)"
  context.fillRect(miniGrapes.fourX, miniGrapes.fourY, blockSize/1.5, blockSize/1.5)
}
      if (snakeX == miniGrapes.oneX && snakeY == miniGrapes.oneY && room == 2 && miniGrapes.oneAlive == true) {
        score = score + 0.5
        gE("score").innerHTML = 'Score: ' + score;
  miniGrapes.oneAlive = false
      } else if (snakeX == miniGrapes.twoX && snakeY == miniGrapes.twoY && room == 2 && miniGrapes.twoAlive == true) {
        score = score + 0.5
        gE("score").innerHTML = 'Score: ' + score;
  miniGrapes.twoAlive = false
      } else   if (snakeX == miniGrapes.threeX && snakeY == miniGrapes.threeY && room == 2 && miniGrapes.threeAlive == true) {
        score = score + 0.5
        gE("score").innerHTML = 'Score: ' + score;
  miniGrapes.threeAlive = false
      } else   if (snakeX == miniGrapes.fourX && snakeY == miniGrapes.fourY && room == 2 && miniGrapes.fourAlive == true) {
        score = score + 0.5
        gE("score").innerHTML = 'Score: ' + score;
  miniGrapes.fourAlive = false
      }

      for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
      }
      
      if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
      }
    
      context.fillStyle = snakecol;
      snakeX += velocityX * blockSize;
      snakeY += velocityY * blockSize;
      if (room == 1){
        context.fillStyle = '#00d1d1';
        context.fillRect(snakeX-2.5, snakeY-2.5, blockSize*1.25, blockSize*1.25); 
        context.fillStyle = snakecol;
        context.fillRect(snakeX, snakeY, blockSize, blockSize);
        for (let i = 0; i < snakeBody.length; i++) {
            context.fillStyle = '#00d1d1';
            context.fillRect(snakeBody[i][0]-2.5, snakeBody[i][1]-2.5, blockSize*1.25, blockSize*1.25);
            context.fillStyle = snakecol;
            context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
        }
      } else{
        context.fillStyle = snakecol;
        context.fillRect(snakeX, snakeY, blockSize, blockSize);
        for (let i = 0; i < snakeBody.length; i++) {
            context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
          }
      }
     
    
    
      if (snakeX < 0 || snakeX > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize) {
        hp = hp - 1;
        if (room == 2){
          snakeX = 20;
          snakeY = 280;
        } else {
        snakeY = 40;
        snakeX = 40;
      }
        velocityX = 0;
        velocityY = 0;
    
      }
    
      for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
          if (!hp < 1){
          snakeBody.pop(snakeBody.length)
        } else {hp++}
        }
      }
    }
    function changeDirection(e) {
      if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
      } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
      } else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
      } else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
      } else if (e.code == "KeyS" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
      } else if (e.code == "KeyA" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
      } else if (e.code == "KeyD" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
      } else if (e.code == "KeyW" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
      }
    }
    
    
    function placeFood() {
      //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
      foodX = Math.floor(Math.random() * cols) * blockSize;
      foodY = Math.floor(Math.random() * rows) * blockSize;
      
    }
    function placeGrape() {
      //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
      grapeX = Math.floor(Math.random() * cols) * blockSize;
      grapeY = Math.floor(Math.random() * rows) * blockSize;
      miniGrapes.oneX = Math.floor(Math.random() * cols) * blockSize;;
      miniGrapes.oneY = Math.floor(Math.random() * rows) * blockSize;
      miniGrapes.twoX = Math.floor(Math.random() * cols) * blockSize;
      miniGrapes.twoY = Math.floor(Math.random() * rows) * blockSize;
      miniGrapes.threeX = Math.floor(Math.random() * cols) * blockSize;
      miniGrapes.threeY = Math.floor(Math.random() * rows) * blockSize;
      miniGrapes.fourX = Math.floor(Math.random() * cols) * blockSize;
      miniGrapes.fourY = Math.floor(Math.random() * rows) * blockSize;
    }
    function placeMiniGrape() {
      miniGrapes.oneAlive = true;
      miniGrapes.twoAlive = true;
      miniGrapes.threeAlive = true;
      miniGrapes.fourAlive = true;
    }
    function placeFood() {
      //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
      foodX = Math.floor(Math.random() * cols) * blockSize;
      foodY = Math.floor(Math.random() * rows) * blockSize;
      
    }
    function blackHole(){
      blackHoleX = Math.floor(Math.random() * cols) * blockSize;
     blackHoleY = Math.floor(Math.random() * rows) * blockSize;
    }
    function Neutron(){
     neutronX =  Math.floor(Math.random() * cols) * blockSize;
     neutronY = Math.floor(Math.random() * rows) * blockSize;
    }
 
    function placePoison() {
      poisonX = Math.floor(Math.random() * cols) * blockSize;
      poisonY = Math.floor(Math.random() * rows) * blockSize;
    }
    function placeGold() {
      goldX = Math.floor(Math.random() * cols) * blockSize;
      goldY = Math.floor(Math.random() * rows) * blockSize;
    }
    function placeHP() {
      hpX = Math.floor(Math.random() * cols) * blockSize;
      hpY = Math.floor(Math.random() * rows) * blockSize;
    
    }
    function reset(){
    placeGold();
    placePoison();
    Neutron();
    placeFood();
    appleChoose = Math.round(Math.random() * 1)
    placeHP();
    blackHole();
    }
  })();
