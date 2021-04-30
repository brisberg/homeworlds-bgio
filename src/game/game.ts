import type {Ctx, Game} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';

function isVictory(cells: GameState['cells']) {
  const positions: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isRowComplete = (row: number[]) => {
    const symbols = row.map((i) => cells[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some((i) => i === true);
}

export interface GameState {
  cells: string[];
}

export const TicTacToe: Game<GameState, Ctx, undefined> = {
  setup: () => ({cells: Array(9).fill(null)}),

  moves: {
    clickCell(G, ctx, id) {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = ctx.currentPlayer;
      return;
    },
  },

  turn: {moveLimit: 1},

  endIf: (G, ctx) => {
    if (isVictory(G.cells)) {
      return {winner: ctx.currentPlayer};
    }
    if (G.cells.filter((c) => c === null).length == 0) {
      return {draw: true};
    }
    return;
  },

  ai: {
    enumerate: (G) => {
      const moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({move: 'clickCell', args: [i]});
        }
      }
      return moves;
    },
  },
};
