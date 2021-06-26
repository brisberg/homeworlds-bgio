import type {Ctx} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import {catastrophy} from './catastrophy';
import {Color, GameState, Ship, StarSystem} from '../state';

describe('catastrophy', () => {
  let state: GameState;
  let ctx: Ctx;
  let ship1: Ship;
  let ship2: Ship;
  let ship3: Ship;
  let ship4: Ship;
  let ship5: Ship;
  let star: StarSystem;

  beforeEach(() => {
    ship1 = {
      id: 'ship1',
      player: '0',
      location: 'star1',
      piece: {color: Color.BLUE, size: 0},
    };
    ship2 = {
      id: 'ship2',
      player: '0',
      location: 'star1',
      piece: {color: Color.BLUE, size: 0},
    };
    ship3 = {
      id: 'ship3',
      player: '0',
      location: 'star1',
      piece: {color: Color.BLUE, size: 0},
    };
    ship4 = {
      id: 'ship4',
      player: '0',
      location: 'star1',
      piece: {color: Color.BLUE, size: 1},
    };
    ship5 = {
      id: 'ship5',
      player: '0',
      location: 'star1',
      piece: {color: Color.RED, size: 1},
    };
    star = {id: 'star1', piece: {color: Color.BLUE, size: 1}};

    state = {
      bank: {
        [Color.RED]: [0, 0, 0],
        [Color.GREEN]: [0, 0, 0],
        [Color.BLUE]: [0, 0, 0],
        [Color.YELLOW]: [0, 0, 0],
      },
      homeworlds: {},
      stars: {[star.id]: star},
      ships: {
        [ship1.id]: ship1,
        [ship2.id]: ship2,
        [ship3.id]: ship3,
        [ship4.id]: ship4,
        [ship5.id]: ship5,
      },
    };

    ctx = {currentPlayer: '0'} as Ctx;
  });

  describe('should return invalid', () => {
    it('if there is no star with the id', () => {
      const result = catastrophy(state, ctx, 'invalidStar', Color.GREEN);

      expect(result).toEqual(INVALID_MOVE);
    });

    it('if there are less than 4 pieces of the given color', () => {
      ship1.piece.color = Color.BLUE;
      star.piece.color = Color.BLUE;
      const result = catastrophy(state, ctx, star.id, Color.GREEN);

      expect(result).toEqual(INVALID_MOVE);
    });
  });

  it('should destroy all ships of the given color', () => {
    ship1.piece.color = Color.BLUE;
    ship2.piece.color = Color.BLUE;
    ship3.piece.color = Color.BLUE;
    ship4.piece.color = Color.BLUE;
    ship5.piece.color = Color.RED;
    star.piece.color = Color.RED;

    const result = catastrophy(state, ctx, star.id, Color.BLUE);

    expect(result).toBeUndefined();
    expect(state.stars[star.id]).toBeTruthy();
    expect(state.ships).toEqual({[ship5.id]: ship5});
    expect(state.bank[Color.BLUE]).toEqual([3, 1, 0]);
  });

  it('should destroy all ships of both players', () => {
    ship1.piece.color = Color.BLUE;
    ship1.player = '0';
    ship2.piece.color = Color.BLUE;
    ship2.player = '0';
    ship3.piece.color = Color.BLUE;
    ship3.player = '1';
    ship4.piece.color = Color.BLUE;
    ship4.player = '1';
    star.piece.color = Color.RED;

    const result = catastrophy(state, ctx, star.id, Color.BLUE);

    expect(result).toBeUndefined();
    expect(state.stars[star.id]).toBeTruthy();
    expect(state.ships).toEqual({[ship5.id]: ship5});
    expect(state.bank[Color.BLUE]).toEqual([3, 1, 0]);
  });

  it('should destroy a star and all ships with it', () => {
    ship1.piece.color = Color.GREEN;
    ship2.piece.color = Color.BLUE;
    ship3.piece.color = Color.BLUE;
    ship4.piece.color = Color.BLUE;
    ship5.piece.color = Color.RED;
    star.piece.color = Color.BLUE;

    const result = catastrophy(state, ctx, star.id, Color.BLUE);

    expect(result).toBeUndefined();
    expect(state.stars[star.id]).toBeUndefined();
    expect(state.ships).toEqual({});
    expect(state.bank[Color.BLUE]).toEqual([2, 2, 0]);
    expect(state.bank[Color.GREEN]).toEqual([1, 0, 0]);
  });
});
