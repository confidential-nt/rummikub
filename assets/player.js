//1. giveTile이 이상하게 작동. 원래 있는 걸 자꾸 가져옴...=> 애초에 댁을 잘못 생성하고 있었음..id 중복되게
//2. differentColor 작동 제대로 안함....=> NICE 나오면 안되는데 나옴...=> 해결. RESULT 값이 이미 LASTGROUPMATCH에 있는 애임
//3. lastgroupmatch는 이미 ontable에 있는것이므로 이거 고려해서 또 로직 설정...
import { Tile } from "./deck.js";

export default class Player {
  constructor(name) {
    this.name = name;
    this.tiles = [];
    this.onTableTiles = [];
    this.groupMatch = [];
    this.runMatch = [];
    this.score = null;
    this.turn;
    this.initialMeldDone = false;
  }

  group(condition = 0, tiles = this.tiles) {
    // console.log(this.groupMatch, this.onTableTiles);
    // initial meld 가 group일때...
    //
    const lastGroupMatch = this.groupMatch[this.groupMatch.length - 1];
    const lastRunMatch = this.runMatch[this.runMatch.length - 1];
    const comparedTiles = this.initialMeldDone ? this.onTableTiles : tiles;
    let list = [];

    let usedNum = [];
    if (this.initialMeldDone)
      list = this.findOtherGroupMatch(usedNum, lastGroupMatch, lastRunMatch);
    else {
      for (let i = 0; i < tiles.length; i++) {
        if (usedNum.includes(tiles[i].value)) continue;
        const result = tiles.filter((el) => tiles[i].value === el.value);

        let reduceRes = [];
        result.forEach((el) => reduceRes.push(el.value));

        if (reduceRes.length < 3) continue;
        const sum = reduceRes.reduce((acc, cur) => {
          return acc + cur;
        }, 0);

        if (sum >= condition && areDifferentColor(result, lastGroupMatch)) {
          //initalmeld 이후 색깔 다른지도 확인해야함
          list.push(result);
          usedNum.push(tiles[i].value);
        }
      }
    }

    console.log(list);
    console.log(tiles);
    return list; //중간에 있는 숫자인 경우 4개인가? 혹은 run match의 맨 앞. 맨 뒤 숫자와 같은가.
  }

  findOtherGroupMatch(usedNum, lastGroupMatch, lastRunMatch) {
    if (lastGroupMatch) {
      console.log(this.tiles);
      const base = lastGroupMatch[0];

      const result = this.tiles.filter((el) => el.value === base.value);
      console.log(lastGroupMatch, result, this.tiles);

      if (!result.length) return;

      // if (areDifferentColor(result, lastGroupMatch, this.name)) {
      //   list = list.concat(lastGroupMatch, result);
      // }
      const groupMatchColor = lastGroupMatch.map((el) => el.color);
      let diffColor = [];
      let checkedColor = [];
      for (let i = 0; i < lastGroupMatch.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (groupMatchColor.includes(result[j].color)) continue;
          if (result[j].color === lastGroupMatch[i].color) continue;
          if (checkedColor.includes(result[j].color)) continue;
          else {
            diffColor.push(result[j]);
            checkedColor.push(result[j].color);
          }
        }
      }

      return diffColor;
    }
  }

  run(condition = 0, tiles = this.tiles) {
    let startNumberIndex;
    const lengthCondition = this.initialMeldDone ? 1 : 3;
    const lastRunMatch = this.runMatch[this.runMatch.length - 1];
    let list = [];
    let copiedTiles = tiles.slice();

    copiedTiles.sort((a, b) => a.value - b.value);
    if (this.initialMeldDone) {
      if (!lastRunMatch) return []; //수정. 그룹만 가지고 있을 경우를 위해.
      startNumberIndex = copiedTiles.findIndex((el) => {
        return (
          el.value === lastRunMatch[lastRunMatch.length - 1].value + 1 ||
          el.value === lastRunMatch[0].value - 1
        );
      });
    }
    if (startNumberIndex === -1) return [];
    let usedNum = [];

    if (
      copiedTiles[startNumberIndex] &&
      copiedTiles[startNumberIndex].value === lastRunMatch[0].value - 1
    ) {
      this.findRunMatchElDecre(copiedTiles, list, usedNum, startNumberIndex);
    } else {
      this.findRunMatchElIncre(copiedTiles, list, usedNum, startNumberIndex);
    }

    if (!list.length) {
      return copiedTiles[startNumberIndex];
    }

    const valueList = [];
    list.forEach((el) => valueList.push(el.value));
    let sum = 0;
    const sumPartial = [];
    const elPartial = [];
    let currentIndex = 0;
    let decreaseIndex = false;

    if (list[0].value > list[list.length - 1].value) decreaseIndex = true;
    this.runElSum(
      valueList,
      sum,
      sumPartial,
      elPartial,
      list,
      currentIndex,
      decreaseIndex
    );

    const overCondition = sumPartial.findIndex((el) => el >= condition);

    if (
      elPartial[overCondition] &&
      elPartial[overCondition].length >= lengthCondition
    )
      return elPartial[overCondition].sort((a, b) => a.value - b.value);
    else return [];
  }

  findRunMatchElIncre(copiedTiles, list, usedNum, startNumberIndex) {
    for (
      let i = this.initialMeldDone ? startNumberIndex : 0;
      i < copiedTiles.length - 1;
      i++
    ) {
      if (copiedTiles[i].value + 1 === copiedTiles[i + 1].value) {
        this.runMatchElProcess(copiedTiles, list, i, usedNum);
      } else continue;
    }
  }

  findRunMatchElDecre(copiedTiles, list, usedNum, startNumberIndex) {
    for (let i = startNumberIndex; i > 0; i--) {
      if (copiedTiles[i].value - 1 === copiedTiles[i - 1].value) {
        this.runMatchElProcess(copiedTiles, list, i, usedNum, true);
      } else break;
    }
  }

  runMatchElProcess(copiedTiles, list, i, usedNum, decreaseIndex = null) {
    if (!decreaseIndex) {
      if (usedNum.includes(copiedTiles[i].value)) {
        list.push(copiedTiles[i + 1]);
      } else {
        list.push(copiedTiles[i], copiedTiles[i + 1]);
      }

      usedNum.push(copiedTiles[i].value, copiedTiles[i + 1].value);
    }

    if (decreaseIndex) {
      if (usedNum.includes(copiedTiles[i].value)) {
        list.push(copiedTiles[i - 1]);
      } else {
        list.push(copiedTiles[i], copiedTiles[i - 1]);
      }

      usedNum.push(copiedTiles[i].value, copiedTiles[i - 1].value);
    }
  }

  runElSum(
    valueList,
    sum,
    sumPartial,
    elPartial,
    list,
    currentIndex,
    decreaseIndex
  ) {
    if (!decreaseIndex) {
      for (let i = 0; i < valueList.length; i++) {
        if (valueList[i] + 1 !== valueList[i + 1]) {
          sum = sum + valueList[i];
          sumPartial.push(sum);
          elPartial.push(list.slice(currentIndex, i + 1));
          sum = 0;
          currentIndex = i + 1;
          continue;
        }

        sum = sum + valueList[i];
      }
    }
    if (decreaseIndex) {
      for (let i = 0; i < valueList.length; i++) {
        if (valueList[i] - 1 !== valueList[i + 1]) {
          sum = sum + valueList[i];
          sumPartial.push(sum);
          elPartial.push(list.slice(currentIndex, i + 1));
          sum = 0;
          currentIndex = i + 1;
          continue;
        }

        sum = sum + valueList[i];
      }
    }
  }
}

function areDifferentColor(arr, lastGroupMatch, name) {
  let resultArr = [];
  let target = arr.slice();
  if (lastGroupMatch) {
    target = target.concat(lastGroupMatch);
  }
  for (let i = 0; i < arr.length; i++) {
    const base = arr[i];
    target.splice(0, 1);

    target.forEach((el, i) => {
      const result = base.color === el.color;
      resultArr.push(result);
    });
  }

  console.log(resultArr);

  if (resultArr.some((el) => el === true)) return false;
  console.log(`${name}: nice!`);
  return true;
}
