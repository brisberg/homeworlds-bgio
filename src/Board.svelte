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
  <table id="board">
    <tbody class="cell">Grid Here</tbody>
  </table>
  <div id="winner">Winsdsdner: {winner}</div>
</div>

<!-- <div class="client" class:active={$client.isActive}>
  <li>
    <strong>Player {playerID}</strong>
  </li>

  {#if $client.isActive}
    <li>
      {#if discard}
        <button on:click={() => client.moves.discard()}>Discard</button>
      {:else}
        <button on:click={() => client.moves.militia()}>Play Card</button>
      {/if}
    </li>
    <li>
      <button on:click={() => client.events.endTurn()}>End Turn</button>
    </li>
  {/if}
</div> -->
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
