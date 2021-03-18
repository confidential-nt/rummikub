import { Deck } from "./deck.js";
import Player from "./player.js";

const playBtn = document.querySelector(".play-btn");
const userTileContainers = document.querySelectorAll(".me .tile-container");

const computerTileContainers = document.querySelectorAll(
  ".other .tile-container"
);

const userTable = document.querySelector(".me");
const computerTable = document.querySelector(".other");
const userResultTable = document.querySelector(".result-me");
const computerResultTable = document.querySelector(".result-computer");

let start = true;
const deck = new Deck();

// deck.shuffle();

let user = new Player("user");
user.turn = false;
let computer = new Player("computer");
computer.turn = true;

function handleNumberComb(player) {
  let group = player.group();
  // let run = player.run();
  gameProcessing(group, [], player);
}

function gameProcessing(group, run, player) {
  pushIntoMatch(group, run, player);
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

function pushIntoMatch(group, run, player) {
  const isGroupMatchEmpty = player.groupMatch.length;
  const isRunMatchEmpty = player.runMatch.length;
  const latestGroup = player.groupMatch[player.groupMatch.length - 1]
    ? player.groupMatch[player.groupMatch.length - 1].slice()
    : [];
  const latestRun = player.runMatch[player.runMatch.length - 1]
    ? player.runMatch[player.runMatch.length - 1].slice()
    : [];

  if (group.length && run.length) {
    if (!isGroupMatchEmpty) {
      player.groupMatch.push(group.flatMap((el) => el));
    }
    if (!isRunMatchEmpty) {
      player.runMatch.push(run);
    }
    if (isGroupMatchEmpty) {
      const groupMod = group.flatMap((el) => el);
      latestGroup.push(...groupMod);
      player.groupMatch.push(latestGroup);
    }
    if (isRunMatchEmpty) {
      latestRun.push(...run);
      latestRun.sort((a, b) => a.value - b.value);
      player.runMatch.push(latestRun);
    }
  } else if (group.length) {
    if (!isGroupMatchEmpty) {
      player.groupMatch.push(group.flatMap((el) => el));
    } else {
      const groupMod = group.flatMap((el) => el);
      latestGroup.push(...groupMod);
      player.groupMatch.push(latestGroup);
    }
  } else if (run.length) {
    if (!isRunMatchEmpty) {
      player.runMatch.push(run);
    } else {
      latestRun.push(...run);
      latestRun.sort((a, b) => a.value - b.value);
      player.runMatch.push(latestRun);
    }
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
    handleNumberComb(computer);
  }
}

function processingLogic(logic, player) {
  logic = logic.flatMap((el) => el);
  console.log(logic);
  player.tiles.forEach((el, i) => {
    const same = logic.find((ol) => ol.id === el.id);

    if (same) {
      player.tiles.splice(i, 1); //얘네는 전부 game processing으로 묶고..switch와 객체 조건 알규먼트 사용하게 해서 하면 어떨까..
    }
  });
  player.onTableTiles.push(...logic);

  if (!player.initialMeldDone) player.initialMeldDone = true;

  drawTiles(logic, player);
}

function initialMeld(player) {
  let group = player.group(30);
  // let run = player.run(30);

  gameProcessing(group, [], player);
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

function dividingTiles(number = 3) {
  user.tiles = user.tiles.concat(deck.giveTiles(number));
  computer.tiles = computer.tiles.concat(deck.giveTiles(number));

  drawTiles();
}

function drawResultTiles(player) {
  const runMatchForDraw = player.runMatch.length
    ? player.runMatch[player.runMatch.length - 1]
    : [];
  const groupMatchForDraw = player.groupMatch.length
    ? player.groupMatch[player.groupMatch.length - 1]
    : [];

  if (player.name === "user") {
    userResultTable.innerHTML = runMatchForDraw
      .map(
        (tile) => `<div class="tile">
    <span class="tile__value ${tile.color}">${tile.suit}</span>
</div>`
      )
      .join("");

    userResultTable.innerHTML += groupMatchForDraw
      .map(
        (tile) => `<div class="tile">
    <span class="tile__value ${tile.color}">${tile.suit}</span>
</div>`
      )
      .join("");
  } else {
    computerResultTable.innerHTML = runMatchForDraw
      .map(
        (tile) => `<div class="tile">
   <span class="tile__value ${tile.color}">${tile.suit}</span>
</div>`
      )
      .join("");

    computerResultTable.innerHTML += groupMatchForDraw
      .map(
        (tile) => `<div class="tile">
   <span class="tile__value ${tile.color}">${tile.suit}</span>
</div>`
      )
      .join("");
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
  drawResultTiles(player);
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
