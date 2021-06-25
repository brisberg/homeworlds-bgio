import type {Ctx} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import type {GameState, Piece, Ship} from '../state';

// Module level counter for producing sequential, unique IDs
let nextIDNum = 0;

export function build(G: GameState, ctx: Ctx, shipId: string): string {
  const ship = G.ships[shipId];

  if (!ship || ship.player !== ctx.currentPlayer) {
    return INVALID_MOVE;
  }

  const color = ship.piece.color;
  const pieces = G.bank[color];
  const piece: Piece = {color, size: -1};
  for (const [size, num] of pieces.entries()) {
    if (num > 0) {
      piece.size = size;
      pieces[size] = num - 1;
      break;
    }
  }

  if (piece.size === -1) {
    // No piece available for build
    return INVALID_MOVE;
  }

  const newShip: Ship = {
    id: getNextID(),
    location: ship.location,
    player: ship.player,
    piece,
  };
  G.ships[newShip.id] = newShip;
  return;
}

function getNextID(): string {
  const nextID = `ship${nextIDNum}`;
  nextIDNum++;
  return nextID;
}
