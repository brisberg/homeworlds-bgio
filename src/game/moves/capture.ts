import type {Ctx} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import type {GameState} from '../state';

export function capture(
    G: GameState, ctx: Ctx, shipId: string, targetId: string): string {
  const ship = G.ships[shipId];

  if (!ship || ship.player !== ctx.currentPlayer) {
    return INVALID_MOVE;
  }

  const target = G.ships[targetId];

  if (!target || target.player === ctx.currentPlayer) {
    return INVALID_MOVE;
  }

  if (ship.location !== target.location) {
    return INVALID_MOVE;
  }

  if (ship.piece.size < target.piece.size) {
    return INVALID_MOVE;
  }

  target.player = ctx.currentPlayer;
  return;
}
