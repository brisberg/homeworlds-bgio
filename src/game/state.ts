/** Game State */
export interface GameState {
  // Pieces available in the bank for play
  bank: {[id: string]: number};
  homeworlds: {[playerId: string]: string};
  stars: {[id: string]: StarSystem};
  ships: {[id: string]: Ship}
}

interface StarSystem {
  id: string;
  piece: Piece;
}

interface Ship {
  id: string;
  piece: Piece;
  // Player ID who controls this ship
  player: string;
  // Star ID this ship is orbiting
  location: string;
}

interface Piece {
  color: Color;
  size: number;
}

enum Color {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
}
