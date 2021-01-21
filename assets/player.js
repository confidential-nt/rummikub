export default class Player {
  constructor(name) {
    this.name = name;
    this.tiles = [];
    this.score = null;
    this.turn;
    this.initialMeldDone = false;
  }

  group(condition = 0) {
    let list = [];

    let usedNum = [];

    for (let i = 0; i < this.tiles.length; i++) {
      if (usedNum.includes(this.tiles[i].value)) continue;
      const result = this.tiles.filter(
        (el) => this.tiles[i].value === el.value
      );

      let reduceRes = [];
      result.forEach((el) => reduceRes.push(el.value));
      if (reduceRes.length < 3) continue;
      const sum = reduceRes.reduce((acc, cur) => {
        return acc + cur;
      }, 0);

      if (sum >= condition) {
        list.push(result);
        usedNum.push(this.tiles[i].value);
      }
    } //30을 컨디션 argument로 줘야할듯

    return list;
  }

  run(condition = 0) {
    let list = [];
    let copiedTiles = this.tiles.slice();

    copiedTiles.sort((a, b) => a.value - b.value);
    let usedNum = [];

    for (let i = 0; i < copiedTiles.length - 1; i++) {
      if (copiedTiles[i].value + 1 === copiedTiles[i + 1].value) {
        if (usedNum.includes(copiedTiles[i].value)) {
          list.push(copiedTiles[i + 1]);
        } else {
          list.push(copiedTiles[i], copiedTiles[i + 1]);
        }

        usedNum.push(copiedTiles[i].value, copiedTiles[i + 1].value);
      } else continue;
    }

    const valueList = [];
    list.forEach((el) => valueList.push(el.value));

    let sum = 0;
    const sumPartial = [];
    const elPartial = [];
    let currentIndex = 0;
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

    const overCondition = sumPartial.findIndex((el) => el >= condition);

    if (elPartial[overCondition] && elPartial[overCondition].length >= 3)
      return elPartial[overCondition];
    else return [];
  }
}
