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
}

updateFrames = () => {
    setInterval(function(){
        if(isRunning == true){
            obst.each(function(){
                let thisObst = $(this)
                thisObst.css('top', '+='+speed+'px');
                childObst = thisObst.children('img');
                if(thisObst.hasClass('obst-left')){ //left obst
                    if(childObst.hasClass('square')){ //square
                        if(checkCollission(childObst, carLeft)){
                            //game over
                            console.log('left road square collided');
                            pauseGame();
                        }
                    }else { // round
                        if(checkCollission(childObst, carLeft)){
                            //add point
                            console.log('left road round collided');
                            pauseGame();
                        }
                    }
                }else { //right obst
                    if(childObst.hasClass('square')){ //square

                    }else { // round

                    }
                }
                if(parseInt(thisObst.css('top').replace('px','')) >= 800){
                    console.log('removing')
                    thisObst.remove();
                }
            })
        }
    },frames)
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