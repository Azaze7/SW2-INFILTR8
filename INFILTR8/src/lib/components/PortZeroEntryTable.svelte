<script lang="ts">
    import { DataHandler } from '@vincjo/datatables/remote';
    import type { Row, State } from '@vincjo/datatables/remote';
    import { fetchPortZeroEntries } from '$lib/api';  // Ensure this is the correct API call
  
    let rows: Row[] = [];
    const handler = new DataHandler<Row>([], { rowsPerPage: 10 });
  
    // Use the handler's onChange to fetch data when the state changes.
    handler.onChange(async (state: State): Promise<Row[]> => {
      const data = await fetchPortZeroEntries(state);
      if (data && Array.isArray(data)) {
        rows = data;
        return data;
      } else {
        return [];  // Ensure that it always returns a Row[] array
      }
    });
  
    // Correct invalidate() usage
    handler.invalidate();  // Call invalidate without arguments
  </script>
  
  <!-- Table to display the Port Zero Entries -->
  <div class="table-container space-y-4">
    <table class="table table-hover table-compact table-auto w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>IP</th>
          <th>Port</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr>
            <td>{row.id}</td>
            <td>{row.ip}</td>
            <td>{row.port}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  