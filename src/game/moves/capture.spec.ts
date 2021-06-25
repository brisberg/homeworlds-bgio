import type {Ctx} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import {capture} from './capture';
import {Color, GameState, Ship, StarSystem} from '../state';

describe('capture', () => {
  let state: GameState;
  let ctx: Ctx;
  let ship1: Ship;
  let ship2: Ship;
  let star: StarSystem;

  beforeEach(() => {
    ship1 = {
      id: 'ship1',
      player: '0',
      location: 'star1',
      piece: {
        color: Color.BLUE,
        size: 0,
      },
    };
    ship2 = {
      id: 'ship2',
      player: '1',
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
      ships: {[ship1.id]: ship1, [ship2.id]: ship2},
    };

    ctx = {currentPlayer: '0'} as Ctx;
  });

  describe('should return invalid', () => {
    it('if there is no ship with the id', () => {
      const result = capture(state, ctx, 'invalidShipId', ship2.id);

      expect(result).toEqual(INVALID_MOVE);
    });

    it('if there is no ship with the target id', () => {
      const result = capture(state, ctx, ship1.id, 'invalidTarget');

      expect(result).toEqual(INVALID_MOVE);
    });

    it('if player does not own the ship', () => {
      ship1.player = 'otherPlayer';
      ctx.currentPlayer = '0';

      const result = capture(state, ctx, ship1.id, ship2.id);

      expect(result).toEqual(INVALID_MOVE);
    });

    it('if player owns target ship', () => {
      ship1.player = '0';
      ship2.player = '0';

      const result = capture(state, ctx, ship1.id, ship2.id);

      expect(result).toEqual(INVALID_MOVE);
    });

    it('if ships are not in the same system', () => {
      ship1.location = 'star1';
      ship2.location = 'otherStar';

      const result = capture(state, ctx, ship1.id, ship2.id);

      expect(result).toEqual(INVALID_MOVE);
    });

    it('if target is a larger ship', () => {
      ship1.piece.size = 0;
      ship2.piece.size = 1;

      const result = capture(state, ctx, ship1.id, ship2.id);

      expect(result).toEqual(INVALID_MOVE);
    });

    it.skip('if the player does not have access to Capture power', () => {
      ship1.piece.color = Color.GREEN;
      star.piece.color = Color.GREEN;

      const result = capture(state, ctx, ship1.id, ship2.id);

      expect(result).toEqual(INVALID_MOVE);
    });
  });

  it('should capture an enemy ship', () => {
    ship1.piece = {color: Color.RED, size: 0};
    ship2.piece = {color: Color.GREEN, size: 0};
    ship2.player = '1';

    const result = capture(state, ctx, ship1.id, ship2.id);

    expect(result).toBeUndefined();
    expect(ship1.player).toEqual('0');
  });
});
