import type {Ctx, MoveFn} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import type {GameState, Piece, StarSystem} from '../state';

export const travel: MoveFn<GameState, Ctx> =
    (G, ctx, shipId: string, destStarId: string, newPiece?: Piece) => {
      const ship = G.ships[shipId];

      if (!ship || ship.player !== ctx.currentPlayer) {
        return INVALID_MOVE;
      }

      const star = G.stars[ship.location];
      let dest = G.stars[destStarId];

      if (dest && newPiece) {
        console.warn(
            'Traveling to an existing star should not specify a new Piece ' +
            'for the star. Did you mean to specify a new Star ID?');
      }

      if (!dest) {
        if (!newPiece) {
          console.error(
              'Traveling to discover a new Star must specify ' +
              'the Piece to use for it');
          return INVALID_MOVE;
        }

        if (G.bank[newPiece.color][newPiece.size - 1] <= 0) {
          console.error(`No ${newPiece.color}:${
              newPiece.size} pieces remaining to create a new star.`);
          return INVALID_MOVE;
        }

        // Build the newly discovered star
        dest = {id: destStarId, piece: newPiece};

        if (!isConnected(star, dest)) {
          console.error(
              'Cannot discover a new Star the same size as the origin Star.');
          return INVALID_MOVE;
        }

        G.stars[destStarId] = dest;
        G.bank[newPiece.color][newPiece.size - 1]--;
      }

      if (!isConnected(star, dest)) {
        console.error(
            'Cannot travel to a new Star the same size as the origin Star.');
        return INVALID_MOVE;
      }

      // TODO: Implement checking for power access

      ship.location = dest.id;
    };

function isConnected(starA: StarSystem, starB: StarSystem): boolean {
  return starA.piece.size !== starB.piece.size;
}
