import type {Ctx} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import {build} from './build';
import {Color, GameState, Ship, StarSystem} from '../state';

describe('build', () => {
  let state: GameState;
  let ctx: Ctx;
  let ship: Ship;
  let star: StarSystem;

  beforeEach(() => {
    ship = {
      id: 'ship1',
      player: '0',
      location: 'star1',
      piece: {
        color: Color.BLUE,
        size: 0,
      },
    };
    star = {id: 'star1', piece: {color: Color.BLUE, size: 1}};

    state = {
      bank: {
        [Color.RED]: [1, 0, 0],
        [Color.GREEN]: [1, 0, 0],
        [Color.BLUE]: [1, 0, 0],
        [Color.YELLOW]: [1, 0, 0],
      },
      homeworlds: {},
      stars: {[star.id]: star},
      ships: {[ship.id]: ship},
    };

    ctx = {currentPlayer: '0'} as Ctx;
  });

  describe('should return invalid', () => {
    it('if there is no ship with the id', () => {
      const result = build(state, ctx, 'invalidShipId');

      expect(result).toEqual(INVALID_MOVE);
    });

    it('if player does not own the ship', () => {
      ship.player = 'otherPlayer';
      ctx.currentPlayer = '0';

      const result = build(state, ctx, ship.id);

      expect(result).toEqual(INVALID_MOVE);
    });

    it('there are no pieces of the ship color in the bank', () => {
      ship.piece.color = Color.GREEN;
      state.bank[Color.GREEN] = [0, 0, 0];

      const result = build(state, ctx, ship.id);

      expect(result).toEqual(INVALID_MOVE);
    });

    it.skip('if the player does not have access to Build power', () => {
      ship.piece.color = Color.RED;
      star.piece.color = Color.RED;

      const result = build(state, ctx, ship.id);

      expect(result).toEqual(INVALID_MOVE);
    });
  });

  it('should build a new ship with the smallest piece available', () => {
    ship.piece.color = Color.GREEN;
    state.bank[Color.GREEN] = [1, 1, 1];

    const result = build(state, ctx, ship.id);

    expect(result).toBeUndefined();
    const newShip = state.ships['ship0'];
    expect(newShip.location).toEqual(ship.location);
    expect(newShip.player).toEqual(ship.player);
    expect(newShip.piece).toEqual({color: Color.GREEN, size: 0});
    expect(state.bank[Color.GREEN]).toEqual([0, 1, 1]);
  });
});
