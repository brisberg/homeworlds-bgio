import type {PlayerID} from 'boardgame.io';

/** Game State */
export interface GameState {
  // Pieces available in the bank for play
  // Array is a list of counts [small, medium, large]
  bank: {[color in Color]: number[]};
  homeworlds: {[playerId: string]: string};
  stars: {[id: string]: StarSystem};
  ships: {[id: string]: Ship}
}

export interface StarSystem {
  id: string;
  piece: Piece;
}

export interface Ship {
  id: string;
  piece: Piece;
  // Player ID who controls this ship
  player: PlayerID;
  // Star ID this ship is orbiting
  location: string;
}

export interface Piece {
  color: Color;
  size: number;
}

export enum Color {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  YELLOW = 'yellow',
}

export const initialData: GameState = {
  bank: {
    [Color.RED]: [3, 3, 3],
    [Color.GREEN]: [3, 3, 3],
    [Color.BLUE]: [3, 3, 3],
    [Color.YELLOW]: [3, 3, 3],
  },
  homeworlds: {},
  ships: {},
  stars: {},
};
