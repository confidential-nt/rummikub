const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const colors = ["black", "red", "blue", "orange"];

export default class Deck {
  constructor(deck = this.createDeck()) {
    this.deck = deck;
  }

  createNumberTile() {
    return values.flatMap((val) => {
      return colors.map((col) => {
        return new Tile(val, col);
      });
    });
  }

  get numberOfTiles() {
    return this.deck.length;
  }

  createDeck() {
    const numberTile = this.createNumberTile();
    const JOKER = [new Tile("J", "red"), new Tile("J", "black")];
    return numberTile.concat(numberTile).concat(JOKER);
  }

  shuffle() {
    for (let i = this.numberOfTiles - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * this.numberOfTiles);
      const targetTile = this.deck[i];
      const otherTile = this.deck[newIndex];
      this.deck[i] = otherTile;
      this.deck[newIndex] = targetTile;
    }
  }

  giveTiles(number) {
    return this.deck.splice(0, number);
  }
}

class Tile {
  constructor(value, color) {
    this.value = value;
    this.color = color;
  }
}
