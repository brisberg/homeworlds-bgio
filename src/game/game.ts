import type {Ctx, Game} from 'boardgame.io';
import {GameState, initialData} from './state';
import {build, capture, trade, travel} from './moves';

export const Homeworlds: Game<GameState, Ctx, undefined> = {
  setup: () => ({...initialData}),

  moves: {build, capture, trade, travel},

  turn: {moveLimit: 1},

  endIf: (G, ctx) => {
    return false;
  },

  // TODO: Implement AI portion
  // ai: {
  //   enumerate: (G) => {},
  // },
};
