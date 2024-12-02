<!-- The UserActionLog Component displays a log of user actions in a table format. 
   It imports the user store to access the logged actions and updates the log data 
   using the `onMount` lifecycle function. Each user action includes a description 
   of the action and a timestamp, which are displayed in a structured table with 
   headers for clarity. If no actions are logged, a message indicating the absence 
   of logs is shown. This component offers a clear and accessible method for 
   tracking and reviewing user activity, making it valuable for monitoring and audit tasks. -->

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
  