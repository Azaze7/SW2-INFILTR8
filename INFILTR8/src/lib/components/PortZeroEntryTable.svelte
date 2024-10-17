<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { fetchPort0Entries } from '$lib/api';
  import type { PortZeroEntryRow } from '$lib/types';

  let rows = writable<PortZeroEntryRow[]>([]);
  let loading = writable(true);
  let error = writable<string | null>(null);

  onMount(async () => {
    try {
      const data: PortZeroEntryRow[] = await fetchPort0Entries();
      rows.set(data);
      loading.set(false);
    } catch (err) {
      console.error("Error fetching Port0 entries:", err);
      error.set('Failed to load data. Please try again later.');
      loading.set(false);
    }
  });
</script>


<div class="table-container space-y-4">
  {#if $loading}
    <p>Loading...</p>
  {:else if $error}
    <p class="text-red-500">{$error}</p>
  {:else}
    <table class="table table-hover table-compact table-auto w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>IP</th>
          <th>Port</th>
        </tr>
      </thead>
      <tbody>
        
        {#each $rows as row, index (row.id)}
          <tr>
            <td>{row.id}</td>
            <td>{row.ip || 'N/A'}</td>
            <td>{row.port || 'N/A'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
