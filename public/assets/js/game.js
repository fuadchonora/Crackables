let gameContainer = $('#gameContainer');
let containerTitle = $('#containerTitle');
let restartGameBtn = $('#restartGame')

let size = 5;
let containerSize = 500;

if ($(window).width() < 700){
    gameContainer.width(250).height(250);
    containerSize = 250;
}

let tileSize = containerSize/size;
let matrix = [];
let tileNo = 1;
var uiEnabled = false;

let freeTilePos = { x: 0, y: 0}
var posSet = []

initPosSet = () => {
    for(let i=0; i<size; i++){
        for(let j=0; j<size; j++){
            let set = {
                x:i*tileSize,
                y:j*tileSize,
            }
            posSet.push(set);
        }
    }
}

initMatrix = () => {
    for(let idR=0; idR<size; idR++){
        matrix[idR] = [];
        for(let idC=0; idC<size; idC++){
            if((idR == (size-1)) && (idC == (size-1))){
                matrix[idR][idC] = null;
                return;
            }
            matrix[idR][idC] = tileNo;
            tileNo++;
        }
    }
}

initUI = () => {
    // containerTitle.height(containerTitle.outerWidth())
    tileNo = 1;
    for(let idR in matrix){
        let row = matrix[idR];
        for(let idC in row){
            if(matrix[idR][idC] == null){
                freeTilePos.x = idC * tileSize;
                freeTilePos.y = idR * tileSize;
            }else {
                var tile = {
                    id: "tile-"+tileNo,
                    class: "tile flex-center flex-column noselect",
                    css: {
                        width: tileSize,
                        height: tileSize
                    }
                };
                var $div = $("<div>", tile);
                $div.html(tileNo);
                gameContainer.append($div);
                let x = idC * tileSize;
                let y = idR * tileSize;
                document.getElementById("tile-"+tileNo).style.transform = "translate("+x+"px, "+y+"px)";
                tileNo++;
            }
        }
    }
}

shufleTiles = () => {
    disableUI();
    var posSetTemp = posSet.slice();
    $('.tile').each(function(){
        let tile = $(this);
        tileNo = tile.html();

        let idX = Math.floor(Math.random() * posSetTemp.length);
        let x = posSetTemp[idX]['x'];
        let y = posSetTemp[idX]['y'];
        posSetTemp.splice(idX, 1);

        document.getElementById("tile-"+tileNo).style.transform = "translate("+x+"px, "+y+"px)";
    });

    freeTilePos.x = posSetTemp[0]['x'];
    freeTilePos.y = posSetTemp[0]['y'];

    containerTitle.html('Slide It & Win');
    enableUI();
}

moveTile = (tile) => {
    tileNo = tile.html();
    let tempPos = tile.position();
    tempPos.top = Math.round(tempPos.top);
    tempPos.left = Math.round(tempPos.left);
    if(     ( ((tempPos.left == freeTilePos.x-tileSize) || (tempPos.left == freeTilePos.x+tileSize)) && (tempPos.top == freeTilePos.y) ) || 
            ( ((tempPos.top == freeTilePos.y-tileSize) || (tempPos.top == freeTilePos.y+tileSize)) && (tempPos.left == freeTilePos.x) ) ){
        //disableUI();
        console.log('moving tile '+tileNo);
        document.getElementById("tile-"+tileNo).style.transform = "translate("+freeTilePos.x+"px, "+freeTilePos.y+"px)";
        freeTilePos.x = tempPos.left;
        freeTilePos.y = tempPos.top;
        setTimeout(function(){
            checkStatus();
        },500);
    }
}

enableUI = () => {
    console.log('enabling ui')
    uiEnabled = true;
}
disableUI = () => {
    console.log('disabling ui')
    uiEnabled = false;
}

checkStatus = () => {
    let preVal = 0;
    let status = false;
    $('.tile').each(function(){
        let tile = $(this)

        let pos = tile.position();
        let val = (pos.top*size/tileSize)+(pos.left/tileSize);
        val = Math.round(val);

        if( parseInt(tile.html()) !== (val+1) ){
            status = false;
            return false;
        }
        status = true;
    })
    if(status == true){
        containerTitle.html('You Won It.');
        disableUI();
    }else{
        enableUI();
    }
}

$('#gameContainer').on('click','.tile',function(event){
    console.log('tile clicked');
    if(uiEnabled == true){
        moveTile($(this));
    }
    return false;
})

restartGameBtn.on('click', function(event){
    disableUI();
    containerTitle.html('Slide It & Win');
    shufleTiles();
})

$(document).ready(function(){
    disableUI();
    initMatrix();
    initPosSet();
    initUI();
    shufleTiles();
})