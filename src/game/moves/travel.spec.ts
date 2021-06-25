import type {Ctx} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import {travel} from './travel';
import {Color, GameState, Ship, StarSystem} from '../state';

describe('travel', () => {
  let state: GameState;
  let ctx: Ctx;
  let ship: Ship;
  let star1: StarSystem;
  let star2: StarSystem;

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
    star1 = {id: 'star1', piece: {color: Color.BLUE, size: 1}};
    star2 = {id: 'star2', piece: {color: Color.RED, size: 2}};

    state = {
      bank: {
        [Color.RED]: [0, 0, 0],
        [Color.GREEN]: [0, 0, 0],
        [Color.BLUE]: [0, 0, 0],
        [Color.YELLOW]: [0, 0, 0],
      },
      homeworlds: {},
      stars: {[star1.id]: star1, [star2.id]: star2},
      ships: {[ship.id]: ship},
    };

    ctx = {currentPlayer: '0'} as Ctx;
  });

  describe('should be invalid', () => {
    it('if there is no ship with the id', () => {
      const result = travel(state, ctx, 'invalidShipId', 'star2');

      expect(result).toEqual(INVALID_MOVE);
    });

    it('if destination star is the same size as the current one', () => {
      star1.piece.size = 1;
      star2.piece.size = 1;
      const errorSpy = jest.spyOn(console, 'error').mockReturnValue();

      const result = travel(state, ctx, 'ship1', 'star2');

      expect(result).toEqual(INVALID_MOVE);
      expect(errorSpy).toHaveBeenCalledWith(
          'Cannot travel to a new Star the same size as the origin Star.');
      errorSpy.mockRestore();
    });

    it('if discovering a new star without specifying a Piece', () => {
      const errorSpy = jest.spyOn(console, 'error').mockReturnValue();

      const result = travel(state, ctx, 'ship1', 'newStar');

      expect(result).toEqual(INVALID_MOVE);
      expect(errorSpy).toHaveBeenCalledWith(
          'Traveling to discover a new Star must specify ' +
          'the Piece to use for it');
      errorSpy.mockRestore();
    });

    it('if discovering a new star the same size as the current one', () => {
      state.bank[Color.GREEN][0] = 1;
      star1.piece.size = 1;
      const errorSpy = jest.spyOn(console, 'error').mockReturnValue();

      const result = travel(state, ctx, 'ship1', 'newStar', {
        color: Color.GREEN,
        size: 1,
      });

      expect(result).toEqual(INVALID_MOVE);
      expect(errorSpy).toHaveBeenCalledWith(
          'Cannot discover a new Star the same size as the origin Star.');
      errorSpy.mockRestore();
    });

    it('if no pieces remain to create a new star', () => {
      state.bank[Color.GREEN][1] = 0;
      const errorSpy = jest.spyOn(console, 'error').mockReturnValue();

      const result = travel(state, ctx, 'ship1', 'newStar', {
        color: Color.GREEN,
        size: 2,
      });

      expect(result).toEqual(INVALID_MOVE);
      expect(errorSpy).toHaveBeenCalledWith(
          'No green:2 pieces remaining to create a new star.');
      errorSpy.mockRestore();
    });

    it.skip('if the Yellow power is not available in the system', () => {
      star1.piece.color = Color.BLUE;
      ship.piece.color = Color.BLUE;
      const errorSpy = jest.spyOn(console, 'error').mockReturnValue();

      const result = travel(state, ctx, 'ship1', 'star2');

      expect(result).toEqual(INVALID_MOVE);
      expect(errorSpy).toHaveBeenCalledWith(
          'Cannot travel without the Yellow power available.');
      errorSpy.mockRestore();
    });
  });

  it('should move the ship to an existing destination', () => {
    const result = travel(state, ctx, 'ship1', 'star2');

    expect(result).toBeUndefined();
    expect(ship.location).toEqual('star2');
  });

  it('should move the ship to a newly discovered star', () => {
    state.bank.red[2] = 1;
    const result = travel(state, ctx, 'ship1', 'star3', {
      color: Color.RED,
      size: 3,
    });

    expect(result).toBeUndefined();
    expect(ship.location).toEqual('star3');
    expect(state.stars['star3']).toEqual({
      id: 'star3',
      piece: {color: Color.RED, size: 3},
    });
    const bank = state.bank;
    expect(bank.red[2]).toEqual(0);
  });
});
