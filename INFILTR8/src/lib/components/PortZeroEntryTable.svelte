<!-- The PortZeroEntryTable Component presents a comprehensive table showcasing detailed information about network services 
   and associated vulnerabilities. It takes an array of entry objects as input, where each object contains fields such as 
   file name, service name, IP address, port, protocol, severity, and exploit details. The `#each` directive iterates through 
   the entries array to generate a table row for every item, ensuring the data is systematically displayed. This component 
   is designed to offer clear and thorough insights into network services and their vulnerabilities, making it a useful 
   tool for security evaluation and monitoring. -->

<script lang="ts">
  export let entries: Array<{
      file: string;
      name: string;
      ip: string;
      port: number;
      viable_exploit: string;
      archetype: string;
      svc_name: string;
      protocol: string;
      severity: number;
      pluginID: number;
      pluginName: string;
      pluginFamily: string;
  }> = [];
</script>
<table>
  <thead>
      <tr>
          <th>File</th>
          <th>Name</th>
          <th>IP</th>
          <th>Port</th>
          <th>Viable Exploit</th>
          <th>Archetype</th>
          <th>Service Name</th>
          <th>Protocol</th>
          <th>Severity</th>
          <th>Plugin ID</th>
          <th>Plugin Name</th>
          <th>Plugin Family</th>
      </tr>
  </thead>
  <tbody>
      {#each entries as entry}
          <tr>
              <td>{entry.file}</td>
              <td>{entry.name}</td>
              <td>{entry.ip}</td>
              <td>{entry.port}</td>
              <td>{entry.viable_exploit}</td>
              <td>{entry.archetype}</td>
              <td>{entry.svc_name}</td>
              <td>{entry.protocol}</td>
              <td>{entry.severity}</td>
              <td>{entry.pluginID}</td>
              <td>{entry.pluginName}</td>
              <td>{entry.pluginFamily}</td>
          </tr>
      {/each}
  </tbody>
</table>
