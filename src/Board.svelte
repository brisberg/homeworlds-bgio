<script lang="ts">
  export let playerID: string;
  import { Client } from "boardgame.io/client";
  import { Local } from "boardgame.io/multiplayer";
  import { TicTacToe } from "./game";
  import { Debug } from "boardgame.io/debug";

  const client = Client({
    game: TicTacToe,
    matchID: "default",
    playerID,
    debug: { impl: Debug },
    numPlayers: 2,
    multiplayer: Local(),
  });

  client.start();

  $: winner = $client.ctx.gameover
    ? $client.ctx.gameover.winner || "Draw!"
    : undefined;
</script>

<div>
  Current Player {$client.ctx.currentPlayer}
  <table id="board">
    <tbody>
      {#each Array(3) as _, row}
        <tr>
          {#each Array(3) as _, col}
            <td
              class="cell"
              on:click={() => client.moves.clickCell(row * 3 + col)}
            >
              {$client.G.cells[row * 3 + col]}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  {#if winner}
    <div id="winner">Winner: {winner}</div>
  {/if}
</div>

<style>
  .cell {
    cursor: pointer;
    border: 1px solid #555;
    width: 50px;
    height: 50px;
    /* lineheight: 50px;
    textalign: center;
    fontfamily: monospace;
    fontsize: 20px;
    fontweight: bold; */
  }
</style>
