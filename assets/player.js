export default class Player {
  constructor() {
    this.tiles = [];
    this.score = null;
    this.turn; //차례를위한 것. ture or false;
    this.initialMeldDone = false;
  }
}
