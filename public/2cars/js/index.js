let road = $('.road');
let leftRoad = $('#leftRoad');
let rightRoad = $('#rightRoad');

let cntainerCarLeft = $('#cntainerCarLeft');
let cntainerCarRight = $('#cntainerCarRight');
cntainerCarLeft.isLeft = false;
cntainerCarRight.isLeft = true;

let leftCar = $('#leftCar');
let rigthCar = $('#rightCar');

var UiEnabled = false;
var speed = 1000/30;


initUi = () => {

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

leftRoad.on('click', function(){
    toggleCar(cntainerCarLeft);
})

rightRoad.on('click', function(){
    toggleCar(cntainerCarRight);
})