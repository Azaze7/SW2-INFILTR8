<script lang="ts">
    import { onMount } from 'svelte';
    import { user } from '../stores/user'; // Correcting the import path
  
    type UserAction = {
      action: string;
      timestamp: string;
    };
  
    let logs: UserAction[] = [];
  
    // Subscribe to the user store to get user actions
    onMount(() => {
      user.subscribe((userData) => {
        logs = userData.actions || [];
      });
    });
  </script>
  
  <section>
    <h2>User Actions Log</h2>
    {#if logs.length > 0}
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {#each logs as log}
            <tr>
              <td>{log.action}</td>
              <td>{log.timestamp}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>No actions logged yet.</p>
    {/if}
  </section>
  
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background-color: #f2f2f2;
      text-align: left;
    }
  </style>
  