let road = $('.road');
let leftRoad = $('#leftRoad');
let rightRoad = $('#rightRoad');

let cntainerCarLeft = $('#cntainerCarLeft');
let cntainerCarRight = $('#cntainerCarRight');
cntainerCarLeft.isLeft = false;
cntainerCarRight.isLeft = true;

let carLeft = $('#carLeft');
let carRight = $('#carRight');

let obst = $('.obst');

var UIEnabled = false;
var isRunning = false;
var startTime = new Date();
var frames = 1000/30;
var speed = 5;
var point = 0;


initUI = () => {
    
}

toggleCar = (car) => {
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

startGame = () => {
    initUI();
    enableUI();
    resetGame();
    updateFrames();
    feedObstacles();
}

updateFrames = () => {
    setInterval(function(){
        if(isRunning == true){
            $('#gameContainer').find('.obst').each(function(){
                let thisObst = $(this)
                thisObst.css('top', '+='+speed+'px');
                childObst = thisObst.children();
                if(thisObst.hasClass('obst-left')){ //left obst
                    if(childObst.hasClass('square')){ //square
                        if(checkCollission(childObst, carLeft)){
                            //game over
                            console.log('left road square collided');
                            onGameOver();
                            return;
                        }
                    }else { // round
                        if(checkCollission(childObst, carLeft)){
                            //add point
                            console.log('left road round collided');
                            updatePoint();
                        }
                    }
                }else { //right obst
                    if(childObst.hasClass('square')){ //square
                        if(checkCollission(childObst, carRight)){
                            //game over
                            console.log('right road square collided');
                            onGameOver();
                            return;
                        }
                    }else { // round
                        if(checkCollission(childObst, carRight)){
                            //add point
                            console.log('right road round collided');
                            updatePoint();
                        }
                    }
                }
                if(parseInt(thisObst.css('top').replace('px','')) >= 700){
                    if(childObst.hasClass('round')){
                        console.log('round missed.')
                        onGameOver();
                        return;
                    }
                    console.log('removing')
                    thisObst.remove();
                }
            })
        }
    },frames)
}

feedObstacles = () => {
    if(isRunning == true){
        setInterval(function(){
            feedLeftObst();
            setTimeout(function(){
                feedRightObst();
            },1000)
        },1000)
    }
}
feedLeftObst = () => {
    let squareObject =   "<div class=\"obst obst-left square-cont square-cont-left flex-center flex-column\">"+
                        "<object type=\"image/svg+xml\" class=\"square square-left\" data=\"img/square-left.svg\"></object>"+
                        "</div>";
    let roundObject =  "<div class=\"obst obst-left round-cont round-cont-left flex-center flex-column\">"+
                        "<object type=\"image/svg+xml\" class=\"round round-left\" data=\"img/round-left.svg\"></object>"+
                        "</div>";
    let i = Math.floor(Math.random() * 3);
    if(i == 0){
        leftRoad.append(roundObject);
    }else if(i == 1){
        leftRoad.append(squareObject);
    }
}
feedRightObst = () => {
    let squareObject =   "<div class=\"obst obst-right square-cont square-cont-right flex-center flex-column\">"+
                        "<object type=\"image/svg+xml\" class=\"square square-right\" data=\"img/square-right.svg\"></object>"+
                        "</div>";
    let roundObject =  "<div class=\"obst obst-right round-cont round-cont-right flex-center flex-column\">"+
                        "<object type=\"image/svg+xml\" class=\"round round-right\" data=\"img/round-right.svg\"></object>"+
                        "</div>";
    let i = Math.floor(Math.random() * 3);
    if(i == 0){
        rightRoad.append(roundObject);
    }else if(i == 1){
        rightRoad.append(squareObject);
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
}

onGameOver = () => {
    pauseGame();
}

leftRoad.on('click', function(){
    toggleCar(cntainerCarLeft);
})

rightRoad.on('click', function(){
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