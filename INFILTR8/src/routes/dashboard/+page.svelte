<script lang="ts">
  import { FileDropzone, LightSwitch, ProgressRadial } from "@skeletonlabs/skeleton";
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  let isProjectFormOpen = false;
  let projectName = ""; // Store for project name input
  let files: File[] = [];
  let uploadProgress = writable<number>(0); 

  // Function to create a project folder on the server
  async function createProjectFolder() {
    if (!projectName) {
      console.error("Project name is required");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/create-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName }),
      });

      if (response.ok) {
        console.log('Project folder created successfully');
      } else {
        console.error('Failed to create project folder:', await response.text());
      }
    } catch (error) {
      console.error('Error creating project folder:', error);
    }
  }

  // Function to handle file selection
  function handleFiles(selectedFiles: FileList) {
    files = [...files, ...Array.from(selectedFiles)];
  }

  // Event handlers for drag & drop
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      handleFiles(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
  }

  function handleFileInputChange(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files) {
      handleFiles(event.target.files);
    }
  }

  // Function to upload the selected Nessus file with progress tracking
  async function uploadFile() {
    if (files.length === 0) {
      console.error("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nessusFile', files[0]);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/upload-nessus', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          uploadProgress.set(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log('File uploaded successfully');
        } else {
          console.error('Failed to upload file:', xhr.statusText);
        }
      };

      xhr.onerror = () => {
        console.error('Error uploading file');
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  // Project form handling
  const openProjectForm = () => {
    isProjectFormOpen = true;
  };

  const closeProjectForm = () => {
    isProjectFormOpen = false;
  };
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-10 text-center flex flex-col items-center">
      <h2 class="h2">Welcome to INFILTR8.</h2>

      <!-- Project Name Input and Creation -->
      <div>
        <input type="text" placeholder="Enter project name" bind:value={projectName} class="input input-bordered w-full max-w-xs"/>
        <button class="btn variant-filled mt-4" on:click={createProjectFolder}>Create Project</button>
      </div>

      <!-- File Upload Section -->
      <figure>
          <div class="card">
              <header class="card-header">
                  <h1 class="card-title">File Upload</h1>
                  <p class="card-subtitle">Drag and drop files here or click to select files.</p>
              </header>
              <section class="p-4">
                  <!-- Drag and Drop Area -->
                  <div 
                    class="file-drop-area" 
                    on:dragover={handleDragOver} 
                    on:drop={handleDrop}>
                      <span class="file-message">Drag & Drop files here or click to upload</span>
                      <input type="file" on:change={handleFileInputChange} accept=".nessus" style="display: none;">
                  </div>
                  <!-- Display Selected Files and Progress -->
                  <footer class="card-footer">
                      <ul>
                        {#each files as file, index}
                          <li>{file.name} <button on:click={() => files.splice(index, 1)}>Remove</button></li>
                        {/each}
                      </ul>
                      {#if files.length > 0}
                        <button on:click={uploadFile}>Upload Selected File</button>
                      {/if}
                      <ProgressRadial value={$uploadProgress} stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" />
                  </footer>
              </section>
          </div>
      </figure>

      <!-- Buttons for Create, Sync, Delete, and Export -->
      <div class="flex space-x-4 justify-center">
          <button class="btn variant-filled" on:click={openProjectForm}>Create Project</button>
          <button class="btn variant-filled">Sync Project</button>
          <button class="btn variant-filled">Delete Project</button>
      </div>
  </div>
</div>

<style>
  .file-drop-area {
    border: 2px dashed #4CAF50;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 10px;
    color: #333;
  }

  .file-drop-area.is-drag-over {
    background-color: #f9f9f9;
  }
</style>
