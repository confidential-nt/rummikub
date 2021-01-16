export default class Player {
  constructor(name) {
    this.name = name;
    this.tiles = [];
    this.score = null;
    this.turn; //차례를위한 것. ture or false;
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
      // if (result.length < 3) continue;
      let reduceRes = [];
      result.forEach((el) => reduceRes.push(el.value));
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
}
