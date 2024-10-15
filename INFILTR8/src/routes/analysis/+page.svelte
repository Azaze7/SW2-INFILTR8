<script lang="ts">
  import { FileDropzone, LightSwitch, Table } from "@skeletonlabs/skeleton";
  import type { TableSource } from '@skeletonlabs/skeleton';
  import { onMount, onDestroy } from 'svelte';
  


  // Define the tableMapperValues function
  function tableMapperValues(data: any[], keys: string[]): any[][] {
      return data.map(item => keys.map(key => item[key]));
  }

  // Source data for the table
  const sourceData = [
      { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
      { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
      { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
      { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
      { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  ];


  const tableSimple: TableSource = {
      // A list of heading labels.
      head: ['Name', 'Symbol', 'Weight'],

      body: tableMapperValues(sourceData, ['name', 'symbol', 'weight']),
 
      meta: tableMapperValues(sourceData, ['position', 'name', 'symbol', 'weight']),

      foot: ['Total', '', '<code class="code">5</code>']
  };



</script>

<!-- Render the Table component -->
<Table source={tableSimple} />
