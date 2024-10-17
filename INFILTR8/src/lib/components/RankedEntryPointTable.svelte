<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { fetchRankedEntryPoints } from '$lib/api';
  import type { RankedEntryPointRow } from '$lib/types'; 

  let rows = writable<RankedEntryPointRow[]>([]);
  let loading = writable(true);
  let error = writable<string | null>(null);

  
  onMount(async () => {
    try {
      const data: RankedEntryPointRow[] = await fetchRankedEntryPoints();
      rows.set(data); 
      loading.set(false);
    } catch (err) {
      console.error("Error fetching ranked entry points:", err);
      error.set('Failed to load data. Please try again later.');
      loading.set(false);
    }
  });
</script>

<!-- HTML Section to render the data table -->
<div class="table-container space-y-4">
  {#if $loading}
    <p>Loading...</p>
  {:else if $error}
    <p class="text-red-500">{$error}</p>
  {:else}
    <table class="table table-hover table-compact table-auto w-full">
      <thead>
        <tr>
          <th>IP</th>
          <th>Port</th>
          <th>Combined Score</th>
        </tr>
      </thead>
      <tbody>
        {#each $rows as row, index (row.ip + '-' + row.port + '-' + index)}
          <tr>
            <td>{row.ip || 'N/A'}</td>
            <td>{row.port || 'N/A'}</td>
            <td>{row.combined_score ?? 'N/A'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
