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

let user = new Player("user");
user.turn = false;
let computer = new Player("computer");
computer.turn = true;

function gameProcessing(option = null) {
  if (option) {
  }
}

function dogame() {
  if (user.turn) {
    if (!user.initialMeldDone) {
      initialMeld(user);
    }
  } else if (computer.turn) {
    if (!computer.initialMeldDone) {
      initialMeld(computer);
    }
  }
}

function initialMeld(player) {
  console.log(player.name);
  // const condition = 30;
  // gameProcessing(condition);
  let group = player.group(30);

  if (group.length > 0) {
    group = group.flatMap((el) => el);
    player.tiles.forEach((el, i) => {
      const same = group.find((ol) => ol.id === el.id);

      if (same) {
        player.tiles.splice(i, 1);
      }
    });
    player.initialMeldDone = true;
    drawTiles();
    console.log(player.tiles);
  } else {
    player.tiles = player.tiles.concat(deck.giveTiles(1));
    drawTiles();
  }
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
  cleanHtml();
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

function cleanHtml() {
  userTileContainers.forEach((con) => {
    con.innerHTML = ``;
  });
  computerTileContainers.forEach((con) => {
    con.innerHTML = ``;
  });
}

playBtn.addEventListener("click", gamePlay);
