const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const colors = ["black", "red", "blue", "orange"];

let id = 0;

export default class Deck {
  constructor(deck = this.createDeck()) {
    this.deck = deck;
  }

  createNumberTile() {
    return values.flatMap((val) => {
      return colors.map((col) => {
        return new Tile(val, val, col);
      });
    });
  }

  get numberOfTiles() {
    return this.deck.length;
  }

  createDeck() {
    const numberTile = this.createNumberTile();

    const JOKER = [new Tile("J", 10, "red"), new Tile("J", 10, "black")]; //나중에 보강
    return numberTile.concat(this.createNumberTile()).concat(JOKER);
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
  constructor(suit, value, color) {
    this.suit = suit;
    this.value = value;
    this.color = color;
    this.id = id;
    id++;
  }
}
