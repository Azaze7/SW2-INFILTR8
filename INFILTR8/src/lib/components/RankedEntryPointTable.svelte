<!-- The RankedEntryPointTable Component provides a table to display ranked network entry points based on multiple 
   security metrics. It takes a list of ranked entry objects as input, where each object includes details such 
   as IP address, port number, severity score, exploit score, distinct vulnerabilities, and a combined score. Using 
   the `#each` directive, the table efficiently populates rows for each entry, ensuring the data is presented in an 
   organized and easily interpretable manner. This component is designed to assist in prioritizing and evaluating 
   entry points based on their security risk, making it ideal for vulnerability assessment and mitigation strategies. -->

<script lang="ts">
  export let rankedEntries: Array<{
      ip: string;
      port: number;
      severity_score: number;
      exploit_score: number;
      distinct_vulnerabilities: number;
      combined_score: number;
  }> = [];
</script>

<table>
  <thead>
      <tr>
          <th>IP</th>
          <th>Port</th>
          <th>Severity Score</th>
          <th>Exploit Score</th>
          <th>Distinct Vulnerabilities</th>
          <th>Combined Score</th>
      </tr>
  </thead>
  <tbody>
      {#each rankedEntries as { ip, port, severity_score, exploit_score, distinct_vulnerabilities, combined_score }}
          <tr>
              <td>{ip}</td>
              <td>{port}</td>
              <td>{severity_score}</td>
              <td>{exploit_score}</td>
              <td>{distinct_vulnerabilities}</td>
              <td>{combined_score}</td>
          </tr>
      {/each}
  </tbody>
</table>
