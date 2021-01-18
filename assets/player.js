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
    let index = 0;
    let list = [];
    let calList = this.tiles.slice();

    calList.sort((a, b) => a.value - b.value);
    let usedNum = [];

    let firstRunNum = calList[index].value;
    usedNum.push(firstRunNum);
    // this.tiles.forEach((el) => calList.push(el.value));
    // console.log(calList);

    for (let i = 0; i < calList.length - 1; i++) {
      if (usedNum.includes(calList[i].value)) continue;
      console.log(calList);
      if (calList[i].value + 1 === calList[i + 1].value) {
        list.push(calList[i], calList[i + 1]);
        usedNum.push(calList[i], calList[i + 1]);
      } else continue;
    }

    const set = new Set(list);
    console.log(set);

    index++;
  }
}
