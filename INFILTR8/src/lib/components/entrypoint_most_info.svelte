<!-- The EntryPointMostInfo Component generates a table to display key details about network entry points. 
   It takes an array of entry objects as a prop, where each object includes the IP address, port number, 
   and the count of vulnerabilities associated with that entry point. The `#each` directive is used to 
   automatically populate the table, adding a new row for each entry. This component offers a clear and 
   efficient method for showcasing entry point information, making it well-suited for tasks like security 
   analysis or auditing. -->

<script lang="ts">
    export let entries: Array<{
        ip: string;
        port: number;
        vulnerability_count: number;
    }> = [];
</script>

<table>
    <thead>
        <tr>
            <th>IP</th>
            <th>Port</th>
            <th>Vulnerability Count</th>
        </tr>
    </thead>
    <tbody>
        {#each entries as { ip, port, vulnerability_count }}
            <tr>
                <td>{ip}</td>
                <td>{port}</td>
                <td>{vulnerability_count}</td>
            </tr>
        {/each}
    </tbody>
</table>
