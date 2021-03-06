import Deck from "./deck.js";
import Player from "./player.js";

const playBtn = document.querySelector(".play-btn");
const userTileContainers = document.querySelectorAll(".me .tile-container");
const userResultTileContainers = document.querySelectorAll(
  ".result-me .tile-container"
);
const computerTileContainers = document.querySelectorAll(
  ".other .tile-container"
);
const computerResultTileContainers = document.querySelectorAll(
  ".result-computer .tile-container"
);
const userTable = document.querySelector(".me");
const computerTable = document.querySelector(".other");
const userResultTable = document.querySelector(".result-me");
const computerResultTable = document.querySelector(".result-computer");

let start = false;
const deck = new Deck();
deck.shuffle();

let user = new Player("user");
user.turn = false;
let computer = new Player("computer");
computer.turn = true;

function handleNumberComb(player) {
  const copiedPlayerTiles = player.tiles.slice();
  const copiedTableTiles = player.onTableTiles.slice();
  for (let i = 0; i < copiedPlayerTiles.length; i++) {
    copiedTableTiles.push(copiedPlayerTiles[i]);
    const run = player.run(0, copiedTableTiles);
    if (run.find((el) => el.id === copiedPlayerTiles[i].id)) continue;

    copiedTableTiles.splice(copiedTableTiles.length - 1, 1);

    const group = player.group(0, copiedTableTiles);
    if (group.find((el) => el.id === copiedPlayerTiles[i].id)) continue;

    copiedTableTiles.splice(copiedTableTiles.length - 1, 1);
  }
}

function gameProcessing(group, run, player) {
  if (group.length && run.length) {
    const intergration = [...group, ...run];
    processingLogic(intergration, player);
  } else if (group.length || run.length) {
    if (group.length > 0) {
      processingLogic(group, player);
    } else if (run.length > 0) {
      processingLogic(run, player);
    }
  } else {
    player.tiles = player.tiles.concat(deck.giveTiles(1));
    drawTiles();
  }
}

function whosTurn() {
  if (user.turn) {
    userTable.classList.add("highLight");
    computerTable.classList.remove("highLight");
  } else {
    userTable.classList.remove("highLight");
    computerTable.classList.add("highLight");
  }
}

function dogame() {
  whosTurn();
  if (user.turn) {
    if (!user.initialMeldDone) {
      initialMeld(user);
      return;
    }
    handleNumberComb(user);
  } else if (computer.turn) {
    if (!computer.initialMeldDone) {
      initialMeld(computer);
      return;
    }
  }
}

function processingLogic(logic, player) {
  logic = logic.flatMap((el) => el);
  player.tiles.forEach((el, i) => {
    const same = logic.find((ol) => ol.id === el.id);

    if (same) {
      player.tiles.splice(i, 1); //얘네는 전부 game processing으로 묶고..switch와 객체 조건 알규먼트 사용하게 해서 하면 어떨까..
    }
  });
  player.onTableTiles.push(...logic);

  if (!player.initialMeldDone) player.initialMeldDone = true;

  drawTiles(logic, player.name);
}

function initialMeld(player) {
  let group = player.group(30);
  let run = player.run(30);

  gameProcessing(group, run, player);
}

function handlePlayBtn() {
  user.turn = !user.turn;
  computer.turn = !computer.turn;
  if (!start) {
    dividingTiles();
    start = true;
    return;
  }
  dogame();
}

function dividingTiles(number = 14) {
  user.tiles = user.tiles.concat(deck.giveTiles(number));
  computer.tiles = computer.tiles.concat(deck.giveTiles(number));

  drawTiles();
}

function drawResultTiles(result, player) {
  if (player === "user") {
    result.forEach((tile, i) => {
      userResultTileContainers[i].innerHTML = `<div class="tile">
    <span class="tile__value ${tile.color}">${tile.suit}</span>
</div>`;
    });
  } else {
    result.forEach((tile, i) => {
      computerResultTileContainers[i].innerHTML = `<div class="tile">
    <span class="tile__value ${tile.color}">${tile.suit}</span>
</div>`;
    });
  }
}

function drawTiles(result = null, player = null) {
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
  if (result === null && player === null) return;
  drawResultTiles(result, player);
}

function cleanHtml() {
  userTileContainers.forEach((con) => {
    con.innerHTML = ``;
  });
  computerTileContainers.forEach((con) => {
    con.innerHTML = ``;
  });
}

playBtn.addEventListener("click", handlePlayBtn);
