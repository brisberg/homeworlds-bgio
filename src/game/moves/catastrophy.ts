import type {Ctx} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import type {Color, GameState, Ship} from '../state';

export function catastrophy(
    G: GameState, ctx: Ctx, starId: string, color: Color): string {
  const star = G.stars[starId];

  if (!star) {
    return INVALID_MOVE;
  }

  const shipsAtStar = Object.values(G.ships).filter((ship) => {
    return ship.location === starId;
  });
  const shipsWithColor = shipsAtStar.filter((ship) => {
    return ship.piece.color === color;
  });

  if (star.piece.color === color) {
    if (shipsWithColor.length + 1 >= 4) {
      // Destroy the star and everything in it
      delete G.stars[star.id];
      G.bank[star.piece.color][star.piece.size]++;

      shipsAtStar.forEach((ship) => destroyShip(G, ship));
    } else {
      return INVALID_MOVE;
    }
  } else {
    if (shipsWithColor.length >= 4) {
      shipsWithColor.forEach((ship) => destroyShip(G, ship));
    } else {
      return INVALID_MOVE;
    }
  }

  return;
}

function destroyShip(G: GameState, ship: Ship): void {
  delete G.ships[ship.id];
  G.bank[ship.piece.color][ship.piece.size]++;
}
