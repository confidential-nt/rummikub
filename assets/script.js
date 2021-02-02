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
  // const copiedPlayerTiles = player.tiles.slice();
  // const useArr = copiedPlayerTiles.concat(
  //   player.runMatch[player.runMatch.length - 1]
  // );
  // console.log(useArr, player.runMatch);
  let run = player.run();
  console.log(run);
  gameProcessing([], run, player);
}

function gameProcessing(group, run, player) {
  if (group.length && run.length) {
    player.groupMatch.push(group.flatMap((el) => el));
    player.runMatch.push(run);
    const intergration = [...group, ...run];
    processingLogic(intergration, player);
  } else if (group.length || run.length) {
    if (group.length > 0) {
      player.groupMatch.push(group);
      processingLogic(group, player);
    } else if (run.length > 0) {
      player.runMatch.push(run);
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
</div>`; //얘때문에 제대로 안그려지고 없어지는 오류나는듯
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
