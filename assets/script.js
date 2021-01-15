import Deck from "./deck.js";
import Player from "./player.js";

const playBtn = document.querySelector(".play-btn");
const userTileContainers = document.querySelectorAll(".me .tile-container");
const computerTileContainers = document.querySelectorAll(
  ".other .tile-container"
);

let start = false;
const deck = new Deck();
deck.shuffle();

let user = new Player(); //class로 만들어야할듯 run, group이런거 조정하려면
user.turn = false;
let computer = new Player();
computer.turn = true;

function gameProcessing(condition = null) {
  if (condition) {
  }
}

function dogame() {
  if (user.turn) {
    if (!user.initialMeldDone) {
      initialMeld();
    }
  } else if (computer.turn) {
  }
}

function initialMeld() {
  const condition = 30;
  gameProcessing(condition);
}

function gamePlay() {
  user.turn = !user.turn;
  computer.turn = !computer.turn;
  if (!start) {
    dividingTiles();
    start = true;
  }
  dogame();
}

function dividingTiles(number = 14) {
  user.tiles = user.tiles.concat(deck.giveTiles(number));
  computer.tiles = computer.tiles.concat(deck.giveTiles(number));

  drawTiles();
}

function drawTiles() {
  user.tiles.forEach((tile, i) => {
    userTileContainers[i].innerHTML = `<div class="tile">
      <span class="tile__value ${tile.color}">${tile.suit}</span>
  </div>`;
  });
  computer.tiles.forEach((tile, i) => {
    computerTileContainers[i].innerHTML = `<div class="tile">
    <span class="tile__value ${tile.color}">${tile.suit}</span>
</div>`;
  });
}

playBtn.addEventListener("click", gamePlay);
