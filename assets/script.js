import Deck from "./deck.js";

const playBtn = document.querySelector(".play-btn");
const userTileContainers = document.querySelectorAll(".me .tile-container");
const computerTileContainers = document.querySelectorAll(
  ".other .tile-container"
);

let start = false;
const deck = new Deck();
deck.shuffle();

let user = { tiles: [], score: null }; //class로 만들어야할듯 run, group이런거 조정하려면
let computer = { tiles: [], score: null };

function gamePlay() {
  if (!start) dividingTiles();

  start = true;
}

function dividingTiles(number = 14) {
  user.tiles = user.tiles.concat(deck.giveTiles(number));
  computer.tiles = computer.tiles.concat(deck.giveTiles(number));

  drawTiles();
}

function drawTiles() {
  user.tiles.forEach((tile, i) => {
    userTileContainers[i].innerHTML = `<div class="tile">
      <span class="tile__value ${tile.color}">${tile.value}</span>
  </div>`;
  });
  computer.tiles.forEach((tile, i) => {
    computerTileContainers[i].innerHTML = `<div class="tile">
    <span class="tile__value ${tile.color}">${tile.value}</span>
</div>`;
  });
}

playBtn.addEventListener("click", gamePlay);
