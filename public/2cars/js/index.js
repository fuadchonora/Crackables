//elements
let obstacleElemts = $('.obstacle');
let carElements = $('.car');

let circleLeft = document.getElementById('circle-left');
let circleRight = document.getElementById('circle-right');
let squareLeft = document.getElementById('square-left');
let squareRight = document.getElementById('square-right');
let carLeft = document.getElementById('car-left');
let carRight = document.getElementById('car-right');

//canvas
let canvas = document.getElementById('carsCanvas');
const c = canvas.getContext('2d');

//variables
let windowWidth = parseInt($( window ).width());
let windowHeight = parseInt($( window ).height()) - 10;

let rWidth;
let obstacleWidth;

let mouse = {
    x:0,
    y:0,
}

let UIEnabled = false;
let isRunning = false;
let time_stamp = 0; // Or Date.now()
let startTime = new Date();

let speed;
let point = 0;

let cars = [];
let circles = {};
let squares = {};

//event Listeners
canvas.addEventListener("mousedown", mouseDown, false);
// canvas.addEventListener("mousemove", mouseXY, false);
canvas.addEventListener("touchstart", touchDown, false);
// canvas.addEventListener("touchmove", touchXY, true);
// canvas.addEventListener("touchend", touchUp, false);

// document.body.addEventListener("mouseup", mouseUp, false);
// document.body.addEventListener("touchcancel", touchUp, false);

addEventListener("touchstart", function(event_) {
    if (event_.timeStamp - time_stamp < 300) { // A tap that occurs less than 300 ms from the last tap will trigger a double tap. This delay may be different between browsers.
        event_.preventDefault();
        return false;
    }
    time_stamp = event_.timeStamp;
});

addEventListener('mousemove', function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

//utiliy functions

function enableUI() {
    UIEnabled = true;
}

function disableUI() {
    UIEnabled = false;
}

function resetGame() {
    speed = 5;
    point = 0;
    startTime = new Date();
    isRunning = true;
}

function pauseGame() {
    isRunning = false;
}

function updatePoint(){
    point++;
    console.log('Point:'+point);
    if(point%5 == 0){
        speed++;
    }
}

function gameOver(){
    console.log('Game Over. Point:'+point);
}

function distance(x1, y1, x2, y2) {
    xDistance = x2 - x1;
    yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomObstacle(){
    let obstacle;
    let idx = Math.floor(Math.random() * 10);
    switch(idx){
        case 0: obstacle = {isCircle:true, obst:circleLeft,x:0}; break;
        case 1: obstacle = {isCircle:true, obst:circleLeft,x:100}; break;
        case 2: obstacle = {isCircle:true, obst:circleRight,x:200}; break;
        case 3: obstacle = {isCircle:true, obst:circleRight,x:300}; break;
        case 4: obstacle = {isCircle:false, obst:squareLeft,x:0}; break;
        case 5: obstacle = {isCircle:false, obst:squareLeft,x:100}; break;
        case 6: obstacle = {isCircle:false, obst:squareRight,x:200}; break;
        case 7: obstacle = {isCircle:false, obst:squareRight,x:300}; break;
        default: obstacle = null;
    }
    return obstacle;
}

// function mouseUp() {
//     console.log('mouseIsDown = 0');
// }

// function touchUp() {
//     console.log('mouseIsDown = 0');
// }

function mouseDown() {
    // console.log('mouseIsDown = 1');
    mouseXY();
}

function touchDown() {
    // console.log('mouseIsDown = 1');
    touchXY();
}

function mouseXY(e) {
    if (!e)
        var e = event;
    let canX = e.pageX - canvas.offsetLeft;
    let canY = e.pageY - canvas.offsetTop;
    console.log(canX+' -> '+canY);
    canX < 200? cars[0].toggle(): cars[1].toggle();
}

function touchXY(e) {
    if (!e)
        var e = event;
    e.preventDefault();
    let canX = e.targetTouches[0].pageX - canvas.offsetLeft;
    let canY = e.targetTouches[0].pageY - canvas.offsetTop;
    console.log(canX+' -> '+canY);
    canX < 200? cars[0].toggle(): cars[1].toggle();

    if(e.targetTouches[1]){
        canX = e.targetTouches[1].pageX - canvas.offsetLeft;
        canY = e.targetTouches[1].pageY - canvas.offsetTop;
        console.log(canX+' -> '+canY);
        canX < 200? cars[0].toggle(): cars[1].toggle();
    }
}

//Objects
function Car(id, isLeft, img, x, y, width, height){
    this.id = id;
    this.isLeft = isLeft;
    this.isMOving = false;
    this.x = x;
    this.y = y;
    this.velocity = {
        x: 0,
        y: 0,
        angle: 0,
    };
    this.mass = 1;
    this.width = width;
    this.height = height;
    this.radious = height/2;
    this.angle = 0;
    this.img = img;

    this.toggle = function() {

        if(this.isLeft){
            console.log('moving right')
            this.isLeft = false;
            this.velocity.angle = speed*0.5;
            this.velocity.x = speed;
        } else {
            console.log('moving left')
            this.isLeft = true;
            this.velocity.angle = -speed*0.5;
            this.velocity.x = -speed;
        }
    }

    this.update = function(){

        if(this.id == 0 && (this.x < 0 || this.x > rWidth)){
            this.velocity.x = 0;
            this.isLeft? this.x = 0: this.x = rWidth;
        }
        if(this.id == 1 && (this.x < rWidth*2 || this.x > rWidth*3)){
            this.velocity.x = 0;
            this.isLeft? this.x = rWidth*2: this.x = rWidth*3;
        }
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.angle += this.velocity.angle;

        if(this.angle < 1 && this.angle > -1) {
            this.velocity.angle = 0;
            this.angle = 0;
        } else if (this.angle > 45) {
            this.velocity.angle = -speed;
        } else if (this.angle < -45) {
            this.velocity.angle = speed;
        }

    }

    this.draw = function() {
        c.beginPath();
        c.save();
        c.translate( this.x + this.width/2, this.y + this.height/2 );
        c.rotate(this.angle * Math.PI/180);
        c.fillStyle = "red";
        c.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
        c.restore();
        c.closePath();
    }
}
function Circle(id, img, x, y, width, height){
    this.id = id;
    this.x = x;
    this.y = y;
    this.mass = 1;
    this.width = width;
    this.height = height;
    this.radious = height/2;
    this.img = img;

    this.update = cars => {

        for(let i in cars){

            if(distance(this.x, this.y, cars[i].x, cars[i].y) - (this.height/2 + cars[i].height/2) + this.height * 0.2 < 0){
                updatePoint();
                delete circles[this.id];
                delete this;
            }
        }

        if(windowHeight - (windowHeight - cars[1].y - 100 * 1.25) - this.y <= 0){
            console.log('Circle Missed');
            pauseGame();
            delete this;
        }

        this.y += speed;
    }

    this.draw = function() {
        c.beginPath();
        c.save();
        c.drawImage(this.img, this.x, this.y, this.width, this.height);
        c.restore();
        c.closePath();
    }
}
function Square(id, img, x, y, width, height){
    this.id = id;
    this.x = x;
    this.y = y;
    this.mass = 1;
    this.width = width;
    this.height = height;
    this.radious = height/2;
    this.img = img;

    this.update = cars => {

        for(let i in cars){

            if(distance(this.x, this.y, cars[i].x, cars[i].y) - (this.height/2 + cars[i].height/2) + this.height * 0.2 < 0){
                console.log('Square Collided');
                pauseGame();
            }
        }

        if(windowHeight - this.y <= 0){
            console.log('removing');
            delete squares[this.id];
            delete this;
        }

        this.y += speed;
    }

    this.draw = function() {
        c.save();
        c.beginPath();
        c.drawImage(this.img, this.x, this.y, this.width, this.height);
        c.restore();
        c.closePath();
    }
}

//Implimentation

function init(){

    if(windowWidth > 700){
        windowWidth = 400;
    }

    canvas.width = windowWidth;
    canvas.height = windowHeight;

    rWidth = parseInt(canvas.width/4); //single road width
    obstacleWidth = parseInt(rWidth/2);

    cars.push(new Car(0, true,  carLeft,  0,        windowHeight-rWidth*2, rWidth, rWidth));
    cars.push(new Car(1, false, carRight, rWidth*3, windowHeight-rWidth*2, rWidth, rWidth));

    setInterval( () => {
        let id = Math.random();
        let obstacle = randomObstacle();
        if (!obstacle) return;

        if (obstacle.isCircle) {
            circles[id] = new Circle(id, obstacle.obst, obstacle.x + rWidth/4, -obstacleWidth, obstacleWidth, obstacleWidth);
        } else {
            squares[id] = new Square(id, obstacle.obst, obstacle.x + rWidth/4, -obstacleWidth, obstacleWidth, obstacleWidth);
        }
    },1000)
}

//Animation Loop
function update() {
        requestAnimationFrame(update);
        if(!isRunning) return;

        c.clearRect(0, 0, canvas.width, canvas.height);

        for(let i in cars){
            cars[i].update();
        }
        
        for(let i in circles){
            circles[i].update(cars);
        }
        for(let i in squares){
            squares[i].update(cars);
        }

}
function animate() {

    // if(!isRunning) return;

    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.beginPath();
    c.fillStyle = "#25337a";
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.moveTo(rWidth, 0);
    c.lineTo(rWidth, windowHeight);
    c.moveTo(rWidth*2, 0);
    c.lineTo(rWidth*2, windowHeight);

    c.moveTo(rWidth*3, 0);
    c.lineTo(rWidth*3, windowHeight);

    c.strokeStyle = "#839bf3";
    c.lineWidth = 2;
    c.stroke();
    
    c.font = "50px Arial";
    c.fillStyle = "white";
    c.textAlign = "center";
    c.fillText(point, canvas.width-50, 50);
    
    c.closePath();

    cars.forEach(function(car){
        car.draw();
    })
    for(let  i in circles){
        circles[i].draw();
    }
    for(let i in squares){
        squares[i].draw();
    }
}

function startGame() {
    init();
    enableUI();
    resetGame();
    update();
    animate();
}

$(document).ready(function(){
    startGame();
})