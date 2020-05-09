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
let windowWidth = $( window ).width();
let windowHeight = $( window ).height() - 10;

let rWidth;

let lines = [
    {x:windowWidth * 0.25, w:1},
    {x:windowWidth * 0.5, w:2},
    {x:windowWidth * 0.75, w:1}
]

let mouse = {
    x:0,
    y:0,
}

let colors = {
    bg:'#CCCCCC',
    white: '#ffffff',
    left: 'red',
    right: 'blue',
}

let UIEnabled = false;
let isRunning = false;
let time_stamp = 0; // Or Date.now()
let startTime = new Date();

let speed = 0.002;
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
    point++
    console.log('Point:'+point);
}

function gameOver(){
    console.log('Game Over. Point:'+point);
}

function distance(x1, y1, x2, y2) {
    xDistance = x2 - x1;
    yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function randonIntFromRange(min, max) {
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
    canX = e.pageX - canvas.offsetLeft;
    canY = e.pageY - canvas.offsetTop;
    console.log(canX+' -> '+canY);
    canX < 200? cars[0].toggle(): cars[1].toggle();
}

function touchXY(e) {
    if (!e)
        var e = event;
    e.preventDefault();
    canX = e.targetTouches[0].pageX - canvas.offsetLeft;
    canY = e.targetTouches[0].pageY - canvas.offsetTop;
    console.log(canX+' -> '+canY);
    canX < 200? cars[0].toggle(): cars[1].toggle();
}

//Objects
function Car(id, isLeft, img, x, y, width, height, color){
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
    this.color = color;
    this.img = img;

    this.toggle = function() {

        if(this.isLeft){
            console.log('moving right')
            this.isLeft = false;
            this.velocity.angle = 2;
            this.velocity.x = 5;
        } else {
            console.log('moving left')
            this.isLeft = true;
            this.velocity.angle = -2;
            this.velocity.x = -5;
        }
    }

    this.update = function(){

        if(this.id == 0 && (this.x < 0 || this.x > rWidth)){
            this.velocity.x = 0;
            this.isLeft? this.x = 0: this.x = rWidth;
        }
        else if(this.id == 1 && (this.x < rWidth*2 || this.x > rWidth*3)){
            this.velocity.x = 0;
            this.isLeft? this.x = rWidth*2: this.x = rWidth*3;
        }
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.angle += this.velocity.angle;

        if(this.angle == 0){
            this.velocity.angle = 0;
        }else if(this.angle > 30){
            this.velocity.angle = -2;
        }else if(this.angle < -30){
            this.velocity.angle = 2;
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
function Circle(id, img, x, y, width, height, color){
    this.id = id;
    this.x = x;
    this.y = y;
    this.mass = 1;
    this.width = width;
    this.height = height;
    this.radious = height/2;
    this.color = color;
    this.img = img;

    this.update = cars => {

        for(let i in cars){

            if(distance(this.x, this.y, cars[i].x, cars[i].y) - (this.height/2 + cars[i].height/2) + this.height * 0.2 < 0){
                console.log('Circle Collided');
                updatePoint();
                delete circles[this.id];
                delete this;
            }
        }

        if(windowHeight - (windowHeight - cars[1].y - 100 * 1.25) - this.y <= 0){
            console.log('Circle Missed');
            pauseGame();
            delete this;
            return;
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
function Square(id, img, x, y, width, height, color){
    this.id = id;
    this.x = x;
    this.y = y;
    this.mass = 1;
    this.width = width;
    this.height = height;
    this.radious = height/2;
    this.color = color;
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
            return;
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

    if(windowWidth > 400){
        windowWidth = 400;
    }

    canvas.width = windowWidth;
    canvas.height = windowHeight;

    rWidth = canvas.width/4; //single road width

    cars.push(new Car(0, true,  carLeft,  0,        windowHeight-rWidth*2, rWidth, rWidth, 'red' ));
    cars.push(new Car(1, false, carRight, rWidth*3, windowHeight-rWidth*2, rWidth, rWidth, 'blue'));

    setInterval( () => {
        let id = Math.random();
        let obstacle = randomObstacle();
        if (!obstacle) return;

        if (obstacle.isCircle) {
            circles[id] = new Circle(id, obstacle.obst, obstacle.x + rWidth/4, -rWidth/2, rWidth/2, rWidth/2, 'red');
        } else {
            squares[id] = new Square(id, obstacle.obst, obstacle.x + rWidth/4, -rWidth/2, rWidth/2, rWidth/2, 'blue');
        }
    },2000)
}

//Animation Loop
function update() {
    setInterval( () => {
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

    },1000/100)
}
function animate() {

    // if(!isRunning) return;

    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

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