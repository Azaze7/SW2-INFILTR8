<script>
    let projects = ["Project A", "Project B", "Project C"];
    let selectedProject = projects[0];
  
    let entryPointTypes = ["Type 1", "Type 2", "Type 3"];
    let selectedEntryPoint = entryPointTypes[0];
  
    let startTimes = ["Now", "In 1 hour", "Tomorrow"];
    let selectedStartTime = startTimes[0];
  
    let analysisData = [
      { name: "Analysis 1", progress: 50 },
      { name: "Analysis 2", progress: 80 }
    ];
  
    let overallProgress = 60;
  </script>
  
  <div class="analysis-screen">
    <h1>Analysis</h1>
  
    <label for="project-select">Select Project:</label>
    <select bind:value={selectedProject} id="project-select">
      {#each projects as project}
        <option>{project}</option>
      {/each}
    </select>
  
    <div class="summary-section">
      <h2>Summary</h2>
      <div class="scrollable">
        {#each analysisData as analysis}
          <div class="analysis-progress">
            <label>{analysis.name}</label>
            <progress value={analysis.progress} max="100"></progress>
          </div>
        {/each}
      </div>
      <label>Overall Progress</label>
      <progress value={overallProgress} max="100"></progress>
      <p>{overallProgress}% Completed</p>
    </div>
  
    <div class="schedule-analysis">
      <h2>Schedule Analysis</h2>
  
      <label for="entry-point">Entry Points:</label>
      <select bind:value={selectedEntryPoint} id="entry-point">
        {#each entryPointTypes as type}
          <option>{type}</option>
        {/each}
      </select>
  
      <label for="start-time">Start-Time:</label>
      <select bind:value={selectedStartTime} id="start-time">
        {#each startTimes as time}
          <option>{time}</option>
        {/each}
      </select>
  
      <button on:click={() => console.log("View Result")}>View Result</button>
    </div>
  </div>
  
  <style>
    .analysis-screen {
      padding: 20px;
    }
  
    .summary-section {
      margin-top: 20px;
      border: 1px solid #ccc;
      padding: 10px;
    }
  
    .scrollable {
      max-height: 200px;
      overflow-y: auto;
    }
  
    .analysis-progress {
      margin-bottom: 10px;
    }
  
    progress {
      width: 100%;
    }
  </style>
  