let road = $('.road');
let leftRoad = $('#leftRoad');
let rightRoad = $('#rightRoad');

let pointView = $('#point');

let gameContainer = $('#gameContainer');
let cntainerCarLeft = $('#cntainerCarLeft');
let cntainerCarRight = $('#cntainerCarRight');
cntainerCarLeft.isLeft = true;
cntainerCarRight.isLeft = false;

let carLeft = $('#carLeft');
let carRight = $('#carRight');

let obst = $('.obst');
let leftObst = $('.obst-left');
let rightObst = $('.obst-right');

let windowHeight = $( window ).height();

var UIEnabled = false;
var isRunning = false;
var startTime = new Date();
var fps = 30;
var speed = 5;
var feedSpeed = 1500;
var point = 0;


initUI = () => {
    console.log('Initing UI');
    console.log('window height:'+windowHeight);
    console.log('height1:'+gameContainer.height());
    gameContainer.height(windowHeight);
    console.log('height2:'+gameContainer.height());
    road.each(function(){
        $(this).height(windowHeight);
    })
}

toggleCar = (car) => {
    if(isRunning == true){
        if(car.isLeft == false){
            //slide left
            car.css('left', '0px');
            car.removeClass("slide-left slide-right").addClass("slide-left");
            car.isLeft = true;
        }else {
            //slide right
            car.css('left', '100px');
            car.removeClass("slide-right slide-left").addClass("slide-right");
            car.isLeft = false;
        }
    }
}

enableUI = () => {
    UIEnabled = true;
}
disableUI = () => {
    UIEnabled = false;
}

resetGame = () => {
    speed = 5;
    point = 0;
    startTime = new Date();
    isRunning = true;
}

pauseGame = () => {
    isRunning = false;
}

updateSpeed = () => {
    setInterval(function(){
        if(isRunning){
            speed += 1;
            feedSpeed -= 100;
        }
    },5000)
}

startGame = () => {
    initUI();
    enableUI();
    resetGame();
    updateFrames();
    updateSpeed();
    feedObstacles();
}

updateFrames = () => {
    if(isRunning == true){
        gameContainer.find('.obst').each(function(){
            let thisObst = $(this)
            thisObst.css('top', '+='+speed+'px');
            childObst = thisObst.children();
            if(thisObst.hasClass('obst-left')){ //left obst
                if(childObst.hasClass('square')){ //square
                    if(checkCollission(childObst, carLeft)){
                        //game over
                        console.log('left road square collided');
                        onGameOver();
                        childObst.explode();
                        return;
                    }
                }else { // round
                    if(checkCollission(childObst, carLeft)){
                        //add point
                        console.log('left road round collided');
                        updatePoint();
                        thisObst.remove();
                        delete thisObst;
                        delete this;
                        return;
                    }
                }
            }else { //right obst
                if(childObst.hasClass('square')){ //square
                    if(checkCollission(childObst, carRight)){
                        //game over
                        console.log('right road square collided');
                        onGameOver();
                        childObst.explode();
                        return;
                    }
                }else { // round
                    if(checkCollission(childObst, carRight)){
                        //add point
                        console.log('right road round collided');
                        updatePoint();
                        thisObst.remove();
                        delete thisObst;
                        delete this;
                        return;
                    }
                }
            }
            if(parseInt(thisObst.css('top').replace('px','')) >= (windowHeight-100) ){
                if(childObst.hasClass('round')){
                    console.log('round missed.')
                    onGameOver();
                    return;
                }
                if(parseInt(thisObst.css('top').replace('px','')) >= windowHeight ){
                    console.log('removing')
                    thisObst.remove();
                    delete thisObst;
                    delete this;
                }
                return;
            }
        })
    }
    requestAnimationFrame(updateFrames);
}

feedObstacles = () => {
    setInterval(function(){
        if(isRunning == true){
            feedLeftObst();
            setTimeout(function(){
                feedRightObst();
            },500)
            console.log('temp:'+feedSpeed)
        }
    },feedSpeed)
}
feedLeftObst = () => {
    let squareObjectLeft =  "<div class=\"  obst obst-left square-cont square-cont-left flex-center flex-column\" style=\"left: 0px;\" >"+
                                "<img class=\" square square-left\" src=\"img/square-left.svg\" >"+
                            "</div>";
    let roundObjectLeft =   "<div class=\"  obst obst-left round-cont round-cont-left flex-center flex-column\" style=\"left: 0px;\" >"+
                                "<img class=\" round round-left\" src=\"img/round-left.svg\" >"+
                            "</div>";
    let squareObjectRight = "<div class=\"  obst obst-left square-cont square-cont-left flex-center flex-column\" style=\"left: 100px;\" >"+
                                "<img class=\" square square-left\" src=\"img/square-left.svg\" >"+
                            "</div>";
    let roundObjectRight =  "<div class=\"  obst obst-left round-cont round-cont-left flex-center flex-column\"  style=\"left: 100px;\">"+
                                "<img class=\" round round-left\" src=\"img/round-left.svg\" >"+
                            "</div>";

    let i = Math.floor(Math.random() * 6);
    switch(i){
        case 0: leftRoad.append(squareObjectLeft); break;
        case 1: leftRoad.append(roundObjectLeft); break;
        case 2: leftRoad.append(squareObjectRight); break;
        case 3: leftRoad.append(roundObjectRight); break;
    }
}
feedRightObst = () => {
    let squareObjectLeft =  "<div class=\"  obst obst-right square-cont square-cont-right flex-center flex-column\" style=\"left: 0px;\" >"+
                                "<img class=\" square square-right\" src=\"img/square-right.svg\" >"+
                            "</div>";
    let roundObjectLeft =   "<div class=\"  obst obst-right round-cont round-cont-right flex-center flex-column\" style=\"left: 0px;\" >"+
                                "<img class=\" round round-right\" src=\"img/round-right.svg\" >"+
                            "</div>";
    let squareObjectRight = "<div class=\"  obst obst-right square-cont square-cont-right flex-center flex-column\" style=\"left: 100px;\" >"+
                                "<img class=\" square square-right\" src=\"img/square-right.svg\" >"+
                            "</div>";
    let roundObjectRight =  "<div class=\"  obst obst-right round-cont round-cont-right flex-center flex-column\"  style=\"left: 100px;\">"+
                                "<img class=\" round round-right\" src=\"img/round-right.svg\" >"+
                            "</div>";

    let i = Math.floor(Math.random() * 6);
    switch(i){
        case 0: rightRoad.append(squareObjectLeft); break;
        case 1: rightRoad.append(roundObjectLeft); break;
        case 2: rightRoad.append(squareObjectRight); break;
        case 3: rightRoad.append(roundObjectRight); break;
    }
}

checkCollission = ($div1, $div2) => {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

updatePoint = () => {
    point++;
    pointView.html(point);
}

onGameOver = () => {
    pauseGame();
}

leftRoad.on('click', function(){
    toggleCar(cntainerCarLeft);
})
carLeft.on('click', function(){
    toggleCar(cntainerCarLeft);
})
leftObst.on('click', function(){
    toggleCar(cntainerCarLeft);
})


rightRoad.on('click', function(){
    toggleCar(cntainerCarRight);
})
carRight.on('click', function(){
    toggleCar(cntainerCarRight);
})
rightObst.on('click', function(){
    toggleCar(cntainerCarRight);
})


var time_stamp = 0; // Or Date.now()
window.addEventListener("touchstart", function(event_) {
    if (event_.timeStamp - time_stamp < 300) { // A tap that occurs less than 300 ms from the last tap will trigger a double tap. This delay may be different between browsers.
        event_.preventDefault();
        return false;
    }
    time_stamp = event_.timeStamp;
});

$(document).ready(function(){
    startGame();
})