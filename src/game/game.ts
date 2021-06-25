import type {Ctx, Game} from 'boardgame.io';
import {GameState, initialData} from './state';
import {capture, trade, travel} from './moves';

// function isVictory(cells: GameState['cells']) {
//   const positions: number[][] = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];

//   const isRowComplete = (row: number[]) => {
//     const symbols = row.map((i) => cells[i]);
//     return symbols.every((i) => i !== null && i === symbols[0]);
//   };

//   return positions.map(isRowComplete).some((i) => i === true);
// }

export const Homeworlds: Game<GameState, Ctx, undefined> = {
  setup: () => ({...initialData}),

  moves: {capture, trade, travel},

  turn: {moveLimit: 1},

  endIf: (G, ctx) => {
    return false;
  },

  // TODO: Implement AI portion
  // ai: {
  //   enumerate: (G) => {},
  // },
};
