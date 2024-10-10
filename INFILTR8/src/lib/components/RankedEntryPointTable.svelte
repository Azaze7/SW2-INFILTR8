<script lang="ts">
  import { DataHandler } from '@vincjo/datatables/remote';
  import type { Row, State } from '@vincjo/datatables/remote';
  import { fetchRankedEntryPoints } from '$lib/api';  // Assuming this is your API function

  let rows: Row[] = [];
  const handler = new DataHandler<Row>([], { rowsPerPage: 10 });

  // Use the handler's onChange to fetch data when the state changes.
  handler.onChange(async (state: State): Promise<Row[]> => {
    try {
      const data: Row[] = await fetchRankedEntryPoints(state);  // Ensure it returns Row[]
      if (data) {
        rows = data;
        return data;
      } else {
        return [];  // Ensure that it always returns a Row[] array
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return [];  // Return an empty array in case of an error
    }
  });

  handler.invalidate();  // Trigger the first data fetching
</script>

<!-- Table to display the ranked entry points -->
<div class="table-container space-y-4">
  <table class="table table-hover table-compact table-auto w-full">
    <thead>
      <tr>
        <th>ID</th>
        <th>IP</th>
        <th>Port</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row (row.id)}
        <tr>
          <td>{row.id}</td>
          <td>{row.ip}</td>
          <td>{row.port}</td>
          <td>{row.combined_score}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
