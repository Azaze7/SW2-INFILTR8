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
