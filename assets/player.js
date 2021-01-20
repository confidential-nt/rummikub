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
    let copyList = this.tiles.slice();

    copyList.sort((a, b) => a.value - b.value);
    let usedNum = [];

    for (let i = 0; i < copyList.length - 1; i++) {
      if (copyList[i].value + 1 === copyList[i + 1].value) {
        if (usedNum.includes(copyList[i].value)) {
          list.push(copyList[i + 1]);
        } else {
          list.push(copyList[i], copyList[i + 1]);
        }

        usedNum.push(copyList[i].value, copyList[i + 1].value);
      } else continue;
    }

    const valueList = [];
    list.forEach((el) => valueList.push(el.value));

    let sum = 0;
    const sumPartial = [];
    const elPartial = [];
    for (let i = 0; i < valueList.length; i++) {
      if (valueList[i] + 1 !== valueList[i + 1]) {
        sum = sum + valueList[i];
        sumPartial.push(sum);
        elPartial.push(list.splice(0, i + 1)); //이 과정 위에서 해야할듯
        sum = 0;
        continue;
      }

      sum = sum + valueList[i];
    }

    console.log(sumPartial);
    console.log(elPartial);

    const overCondition = sumPartial.findIndex((el) => el >= condition);
    return elPartial[overCondition];
  }
}
