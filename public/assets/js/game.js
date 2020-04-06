let gameContainer = $('#gameContainer');
let containerTitle = $('#containerTitle');
let restartGameBtn = $('#restartGame')

let leaderboardModel = $('#leaderboardModel');
let saveModel = $('#saveModel');
let timeDOM = $('#timeDOM');

let saveBtn = $('#saveBtn');
let formName = $('#form-name');
let formInstaId = $('#form-instaId');

var database = firebase.database();

var uid = "";
var playersArray = [];
var startTime = new Date();
var winTime;
var timeRunning = true;

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
    resetTime();
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
        onWin();
    }else{
        enableUI();
    }
}
onWin = () => {
    disableUI();
    containerTitle.html('You Won It.');
    pauseTime();
    saveModel.modal('show')
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

function signIn() {
  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  }
  // [START authanon]
  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode === 'auth/operation-not-allowed') {
      alert('You must enable Anonymous auth in the Firebase Console.');
    } else {
      console.error(error);
    }
  });
}

function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var isAnonymous = user.isAnonymous;
      uid = user.uid;
      console.log('uid:'+uid);
    }
  });
}

function writeUserData(name, time, instaId) {
    uid = firebase.auth().currentUser.uid;
    if(uid && uid != undefined && uid != ''){
        firebase.database().ref('puzzle_leaderboard/' + uid).set({
            userName: name,
            time: time,
            instaId : instaId,
        });
    }else {
        console.log('user id undefined')
    }
}

function displayPlayers(players){
  leaderboardModel.find('tbody').html('');
  let id = 1;
  for(let i in players){
      console.log(players[i].userName+' - '+players[i].time+' - '+players[i].instaId);

      var row;
      var col1;
      var col2;
      var col3;

      let time = parseInt(players[i].time);
      time = new Date(time).toISOString().slice(11, -1);

      col1 = "<td> "+id+" </td>";
      col2 = "<td> "+players[i].userName+" </td>";
      col3 = "<td> "+time+" </td>";
      if(players[i].instaId && (players[i].instaId!= null || players[i].instaId != '')){
        col2 = "<td> <a href='https://instagram.com/"+players[i].instaId+"'> "+players[i].userName+" </a></td>";
      }
      row = col1+" "+col2+" "+col3;

      var data = {
        id: "player-"+players[i].userName,
        class: "display-5",
      };
      var $tr = $("<tr>", data);
      $tr.html(row);
      leaderboardModel.find('tbody').append($tr);
      id++;
    }
}

function displayLeaderboard(){
  firebase.database().ref('/puzzle_leaderboard').once('value').then(function(snapshot) {
    var players = snapshot.val();
    console.log(players);
    playersArray = [];
    for(let i in players){
      playersArray.push(players[i]);
    }
    playersArray.sort(function(a, b){return a.time - b.time});
    displayPlayers(playersArray);
  });
}

function pauseTime(){
  console.log('pausing time')
  timeRunning = false;
}
function resetTime(){
  startTime = new Date();
  timeRunning = true;
}
setInterval(function(){
  if(timeRunning == true){
    let time = new Date() - startTime;
    winTime = time;
    time = new Date(time).toISOString().slice(11, -1);
    timeDOM.html(time);
  }
},100)

leaderboardModel.on('show.bs.modal', function (e) {
  console.log('showing leaderboard')
  displayLeaderboard();
})

saveBtn.on('click', function(){
    let name = formName.val();
    let instaId = formInstaId.val();
    let time = winTime;
    if(name == '' || name == ' '){
        return;
    }
    writeUserData(name, time, instaId);
    saveModel.modal('hide');
    leaderboardModel.modal('show');
})

$(document).ready(function(){
    disableUI();
    initMatrix();
    initPosSet();
    initUI();
    shufleTiles();

    initApp();
    signIn();
    displayLeaderboard();
})