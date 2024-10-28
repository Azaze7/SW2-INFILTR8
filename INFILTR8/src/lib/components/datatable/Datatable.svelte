<script>
	//Import local datatable components
	import ThSort from '$lib/components/datatable/ThSort.svelte';
	import ThFilter from '$lib/components/datatable/ThFilter.svelte';
	import Search from '$lib/components/datatable/Search.svelte';
	import RowsPerPage from '$lib/components/datatable/RowsPerPage.svelte';
	import RowCount from '$lib/components/datatable/RowCount.svelte';
	import Pagination from '$lib/components/datatable/Pagination.svelte';

	//Load local data
	import localData from '$lib/data/data';


	//Import handler from SSD
	import { DataHandler } from '@vincjo/datatables';

	 /** @type {Array<Record<string, any>>} */
	export let data = [];  // Data passed in from parent component

	/** @type {Array<{ key: string; label: string }>} */
	export let columns = [];

	//Init data handler - CLIENT
	const handler = new DataHandler(data, { rowsPerPage: 5 });
	const rows = handler.getRows();
</script>

<div class=" overflow-x-auto space-y-4">
	<!-- Header -->
	<header class="flex justify-between gap-4">
		<Search {handler} />
		<RowsPerPage {handler} />
	</header>
	<!-- Table -->
	<table class="table table-hover table-compact w-full table-auto">
		<thead>
			<tr>
				{#each columns as column}
					<ThSort {handler} orderBy={column.key}>{column.label}</ThSort>
				{/each}
			</tr>
			<tr>
				{#each columns as column}
					<ThFilter {handler} filterBy={column.key} />
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					{#each columns as column}
						<td>{row[column.key]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<!-- Footer -->
	<footer class="flex justify-between">
		<RowCount {handler} />
		<Pagination {handler} />
	</footer>
</div>