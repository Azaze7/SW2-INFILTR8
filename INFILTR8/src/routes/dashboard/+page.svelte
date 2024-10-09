<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { ProgressRadial } from "@skeletonlabs/skeleton";

  let button: HTMLButtonElement | null = null;
  let dropdownMenu: HTMLDivElement | null = null;
  let isProjectFormOpen = false;
  let isDropdownVisible = false;

  let projectName = ''; // Name of the project (folder)
  let projectFolders: string[] = []; // List of project folders, now typed as string[]
  let selectedProject = ''; // Currently selected project

  let files: File[] = [];
  let isDragOver = false;
  let fileInput: HTMLInputElement;
  let uploadProgress = writable<number>(0); // Store to track upload progress

  // Fetch project folders on mount
  async function fetchProjectFolders() {
    try {
      const response = await fetch('http://localhost:3000/projects');
      if (response.ok) {
        projectFolders = await response.json();
      } else {
        console.error('Failed to fetch project folders');
      }
    } catch (error) {
      console.error('Error fetching project folders:', error);
    }
  }

  onMount(() => {
    fetchProjectFolders();
  });

  function handleFiles(selectedFiles: FileList) {
    files = [...files, ...Array.from(selectedFiles)];
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      handleFiles(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
  }

  function handleDropAreaClick() {
    if (fileInput) {
      fileInput.click();
    }
  }

  function handleFileInputChange(event: Event) {
    if (event.target instanceof HTMLInputElement && event.target.files) {
      handleFiles(event.target.files);
    }
  }

  async function uploadFile() {
    if (files.length === 0) {
        console.error("No file selected");
        return;
    }

    if (!selectedProject) {
        alert("Please select a project folder.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append('nessusFile', files[0]);  // Add the Nessus file
        formData.append('projectName', selectedProject);  // Add the selected project name

        const response = await fetch('http://localhost:3000/upload-nessus', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('File uploaded and processed successfully');
        } else {
            const errorText = await response.text();
            console.error('Failed to upload file:', errorText);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}


  async function createProjectFolder() {
    if (!projectName) {
      alert("Please enter a project name.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/create-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName }),
      });

      if (response.ok) {
        console.log('Project folder created successfully');
        fetchProjectFolders(); // Refresh project list
      } else {
        console.error('Failed to create project folder');
      }
    } catch (error) {
      console.error('Error creating project folder:', error);
    }
  }

  async function deleteProjectFolder() {
    if (!selectedProject) {
      alert("Please select a project to delete.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/delete-project', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: selectedProject }),
      });

      if (response.ok) {
        console.log('Project folder deleted successfully');
        fetchProjectFolders(); // Refresh project list
      } else {
        console.error('Failed to delete project folder');
      }
    } catch (error) {
      console.error('Error deleting project folder:', error);
    }
  }
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-10 text-center flex flex-col items-center">
      <h2 class="h2">Welcome to INFILTR8.</h2>

      <!-- Project Name Input -->
      <div>
          <input type="text" placeholder="Enter project name" bind:value={projectName} />
          <button class="btn variant-filled" on:click={createProjectFolder}>Create Project</button>
      </div>

      <!-- Select Project Folder -->
      <div>
          <select bind:value={selectedProject}>
              <option value="" disabled>Select Project Folder</option>
              {#each projectFolders as folder}
                  <option value={folder}>{folder}</option>
              {/each}
          </select>
      </div>

      <!-- File Upload Section -->
      <figure>
          <div role="button" tabindex="0" class="card file-drop-area" on:click={handleDropAreaClick} on:dragover={handleDragOver} on:dragleave={handleDragLeave} on:drop={handleDrop} class:is-drag-over={isDragOver}>
              <span class="file-message">Drag & Drop files here or click to upload</span>
              <input type="file" bind:this={fileInput} on:change={handleFileInputChange} accept=".nessus" style="display: none;">
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
      </figure>

      <!-- Export and other buttons -->
      <div class="flex space-x-4 justify-center">
          <button class="btn variant-filled" on:click={deleteProjectFolder}>Delete Project</button>

          <!-- Export Button with Dropdown -->
          <div class="relative flex">
              <button class="btn variant-filled" bind:this={button}>Export Options</button>
              {#if isDropdownVisible}
                  <div class="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg dropdown-menu" bind:this={dropdownMenu}>
                      <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="#">Export Project</a>
                      <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="#">Export as PDF</a>
                      <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="#">Export as Excel</a>
                  </div>
              {/if}
          </div>
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
