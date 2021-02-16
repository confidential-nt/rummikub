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
    console.log(this.groupMatch, this.onTableTiles);
    const lastGroupMatch = this.groupMatch[this.groupMatch.length - 1];
    const comparedTiles = this.initialMeldDone ? this.onTableTiles : tiles;
    let list = [];

    let usedNum = [];

    for (let i = 0; i < comparedTiles.length; i++) {
      if (usedNum.includes(comparedTiles[i].value)) continue;
      const result = tiles.filter((el) => comparedTiles[i].value === el.value);
      if (this.initialMeldDone) console.log(result);
      let reduceRes = [];
      result.forEach((el) => reduceRes.push(el.value));
      if (reduceRes.length < 3) continue;
      const sum = reduceRes.reduce((acc, cur) => {
        return acc + cur;
      }, 0);

      if (sum >= condition && areDifferentColor(result)) {
        list.push(result);
        usedNum.push(comparedTiles[i].value);
      }
    }

    return list; //중간에 있는 숫자인 경우 4개인가? 혹은 run match의 맨 앞. 맨 뒤 숫자와 같은가.
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

function areDifferentColor(arr) {
  let resultArr = [];
  const target = arr.slice();
  for (let i = 0; i < arr.length; i++) {
    const base = arr[i];
    target.splice(0, 1);

    target.forEach((el, i) => {
      const result = base.color === el.color;
      resultArr.push(result);
    });
  }

  if (resultArr.some((el) => el === true)) return false;

  return true;
}
