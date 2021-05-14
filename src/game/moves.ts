import type {Ctx, MoveFn} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import type {Color, GameState} from './state';

export const trade: MoveFn<GameState, Ctx> =
    (G, ctx, shipId: string, color: Color) => {
      const ship = G.ships[shipId];

      if (!ship || ship.player !== ctx.currentPlayer) {
        return INVALID_MOVE;
      }

      if (ship.piece.color === color) {
        return INVALID_MOVE;
      }

      const size = ship.piece.size;

      if (G.bank[color][size] <= 0) {
        return INVALID_MOVE;
      }

      // TODO: Implement checking for power access

      G.bank[color][size] -= 1;
      G.bank[ship.piece.color][size] += 1;
      ship.piece.color = color;
    };
