<script>
    let currentTime = new Date();
    let greeting = "";
  
    if (currentTime.getHours() < 12) {
      greeting = "Good Morning";
    } else if (currentTime.getHours() < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }
  
    let notifications = [
      "Project Alpha: Vulnerability detected.",
      "Project Beta: Analysis complete.",
      "Project Gamma: Scheduled for analysis."
    ];
  
    let selectedFiles = [];
    let uploadProgress = [];
  
    function handleFiles(event) {
      selectedFiles = Array.from(event.target.files);
      uploadProgress = selectedFiles.map(() => 0);
    }
  
    function discardAll() {
      selectedFiles = [];
      uploadProgress = [];
    }
  
    function simulateUpload() {
      selectedFiles.forEach((file, index) => {
        let interval = setInterval(() => {
          if (uploadProgress[index] < 100) {
            uploadProgress[index] += 10;
          } else {
            clearInterval(interval);
          }
        }, 300);
      });
    }
  </script>
  
  <div class="dashboard">
    <h1>{greeting}, Analyst</h1>
  
    <section class="notifications">
      <h2>Notifications</h2>
      <ul>
        {#each notifications as notification}
          <li>{notification}</li>
        {/each}
      </ul>
    </section>
  
    <section class="create-project">
      <h2>Create New Project</h2>
  
      <div class="file-upload">
        <label for="file-upload" class="file-upload-label">
          Drag & Drop your files here or
          <input type="file" id="file-upload" multiple on:change={handleFiles} />
          <button>Select Files</button>
        </label>
      </div>
  
      {#if selectedFiles.length > 0}
        <div class="file-list">
          <h3>Files Being Uploaded</h3>
          {#each selectedFiles as file, index}
            <div class="file-progress">
              <span>{file.name}</span>
              <progress value={uploadProgress[index]} max="100"></progress>
              <span>{uploadProgress[index]}%</span>
            </div>
          {/each}
        </div>
      {/if}
  
      <div class="buttons">
        <button on:click={simulateUpload}>Create Project</button>
        <button on:click={discardAll}>Discard All</button>
      </div>
    </section>
  </div>
  
  <style>
    .dashboard {
      padding: 20px;
      background-color: #2c3e50;
      color: white;
      font-family: Arial, sans-serif;
    }
  
    h1, h2 {
      margin-bottom: 20px;
    }
  
    .notifications ul {
      list-style: none;
      padding: 0;
    }
  
    .notifications li {
      background-color: #34495e;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 5px;
    }
  
    .create-project {
      margin-top: 40px;
    }
  
    .file-upload-label {
      display: inline-block;
      margin-bottom: 10px;
    }
  
    input[type="file"] {
      display: none;
    }
  
    button {
      display: inline-block;
      padding: 10px 20px;
      margin: 10px 0;
      background-color: #1abc9c;
      color: white;
      border: none;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #16a085;
    }
  
    .file-list {
      margin-top: 20px;
    }
  
    .file-progress {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  
    progress {
      width: 100%;
      margin-left: 10px;
    }
  </style>
  