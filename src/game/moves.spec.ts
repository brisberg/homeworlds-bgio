import type {Ctx} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import {trade} from './moves';
import {Color, GameState, Ship, StarSystem} from './state';

describe('trade', () => {
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

  it('should return invalid if there is no ship with the id', () => {
    const result = trade(state, ctx, 'invalidShipId', Color.RED);

    expect(result).toEqual(INVALID_MOVE);
  });

  it('should return invalid if player does not own the ship', () => {
    ship.player = 'otherPlayer';
    ctx.currentPlayer = '0';

    const result = trade(state, ctx, ship.id, Color.RED);

    expect(result).toEqual(INVALID_MOVE);
  });

  it('should return invalid if ship matches the requested color', () => {
    ship.piece.color = Color.RED;

    const result = trade(state, ctx, ship.id, ship.piece.color);

    expect(result).toEqual(INVALID_MOVE);
  });

  it('should return invalid if there are no coresponding pieces in the bank',
     () => {
       const size = ship.piece.size;
       state.bank[Color.RED][size] = 0;

       const result = trade(state, ctx, ship.id, Color.RED);

       expect(result).toEqual(INVALID_MOVE);
     });

  it.skip(
      'should return invalid if the player does not have access to Trade power',
      () => {
        ship.piece.color = Color.GREEN;
        star.piece.color = Color.GREEN;

        const result = trade(state, ctx, ship.id, Color.RED);

        expect(result).toEqual(INVALID_MOVE);
      });

  it('should exchange a ship for another of color of the same size', () => {
    ship.piece = {color: Color.GREEN, size: 0};
    star.piece.color = Color.BLUE;
    state.bank[Color.RED][0] = 1;
    state.bank[Color.GREEN][0] = 0;

    const result = trade(state, ctx, ship.id, Color.RED);

    expect(result).toBeUndefined();
    const bank = state.bank;
    expect(bank[Color.RED][0]).toEqual(0);
    expect(bank[Color.GREEN][0]).toEqual(1);
    expect(ship.piece.color).toEqual(Color.RED);
  });
});
