<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { ProgressRadial, FileDropzone, FileButton, popup } from "@skeletonlabs/skeleton";
  import type { PopupSettings } from "@skeletonlabs/skeleton";
  import { projectFolders } from '$lib/stores/projectFoldersStore'; // Correct import

  let button: HTMLButtonElement | null = null;
  let dropdownMenu: HTMLDivElement | null = null;
  let isProjectFormOpen = false;
  let isDropdownVisible = false;
  let projectName = ''; // Name of the project (folder)
  let selectedProject = ''; // Currently selected project
  let files: FileList | undefined; // Fix: use undefined instead of null
  let uploadProgress = writable<number>(0); // Store to track upload progress
  let isDragOver = false; // State for drag-over detection

  // Define popup settings for the create project dropdown
  const popupSettings: PopupSettings = {
    event: 'click',
    target: 'createProjectPopup',
    placement: 'bottom',
  };

  // Fetch project folders on mount
  async function fetchProjectFolders() {
    try {
      const response = await fetch('http://localhost:3000/projects');
      if (response.ok) {
        const folders = await response.json();
        projectFolders.set(folders); // Update the store with fetched project folders
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

  // Function to trigger CSV upload to Neo4j
  async function uploadToNeo4j() {
    if (!selectedProject) {
      alert('Please select a project to upload CSVs to Neo4j.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/process-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: selectedProject }),
      });
      if (response.ok) {
        console.log('CSV data uploaded to Neo4j successfully');
        uploadProgress.set(100); // Set progress to 100% after successful upload
      } else {
        console.error('Failed to upload CSV data to Neo4j');
      }
    } catch (error) {
      console.error('Error uploading CSV data to Neo4j:', error);
    }
  }

  async function uploadFile() {
    if (!files || files.length === 0) {
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
        uploadProgress.set(100); // Set progress to 100% after successful upload
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
        projectName = ''; // Clear input
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

  function handleDragOver(event: DragEvent) { 
    event.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave(event: DragEvent) { 
    isDragOver = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragOver = false;
  }
</script>

<div class="container h-full mx-auto flex justify-center items-center py-10">
  <div class="space-y-8 w-full max-w-md text-center flex flex-col items-center  rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-white-800">Welcome to INFILTR8</h2>

      <!-- Project Name Input -->
      <div class="flex flex-col space-y-2 w-full">
          <button 
            class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors" 
            use:popup={popupSettings}
          >
            Create Project
          </button>

          <!-- Dropdown Menu for Project Creation -->
          <div 
            class="card p-4 w-72 shadow-xl" 
            data-popup="createProjectPopup"
          >
              <input 
                type="text" 
                class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-700" 
                placeholder="Enter project name" 
                bind:value={projectName} 
              />
              <button 
                class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors mt-2" 
                on:click={createProjectFolder}
              >
                Create
              </button>
          </div>
      </div>

      <!-- Select Project Folder -->
      <div class="w-full">
        <select 
        class="w-full p-3 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-700" 
        bind:value={selectedProject}
        >
        <option value="" disabled>Select Project Folder</option>
        {#each $projectFolders as folder}
        <option value={folder}>{folder}</option>
        {/each}
      </select>
    </div>
    
      <!-- File Upload Section -->
      <figure class="w-full bg-white border border-gray-200 p-4 rounded-md shadow-sm">
          <FileDropzone bind:files={files} name="files">
              <svelte:fragment slot="lead"></svelte:fragment>
              <svelte:fragment slot="message">Drag & Drop files here or click to upload</svelte:fragment>
              <svelte:fragment slot="meta"></svelte:fragment>
          </FileDropzone>

          <FileButton 
            bind:files={files} 
            name="files" 
            button="w-full p-3 bg-primary-100 text-primary-600 rounded-md hover:bg-primary-200 transition-colors text-gray-700"
          >
            Upload
          </FileButton>

          <footer class="mt-4 flex flex-col items-center space-y-2">
              {#if files && files.length > 0}
                  <button 
                    on:click={uploadFile} 
                    class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    Upload Selected File
                  </button>
              {/if}
              <ProgressRadial 
                value={$uploadProgress} 
                stroke={100} 
                meter="stroke-primary-500" 
                track="stroke-primary-500/30" 
              />
          </footer>
      </figure>

      <!-- Button to trigger CSV Upload to Neo4j -->
      <div class="w-full">
          <button 
            class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors" 
            on:click={uploadToNeo4j}
          >
            Upload CSV to Neo4j
          </button>
      </div>

      <!-- Export and Delete Project -->
      <div class="flex space-x-4 justify-center w-full">
          <button 
            class="w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" 
            on:click={deleteProjectFolder}
          >
            Delete Project
          </button>

          <!-- Export Button with Dropdown -->
          <div class="relative w-full">
              <button 
                class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors" 
                bind:this={button}
              >
                Export Options
              </button>
              {#if isDropdownVisible}
                  <div 
                    class="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10"
                    bind:this={dropdownMenu} 
                    role="menu" 
                    aria-label="Export Options"
                  >
                      <button class="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Export Project</button>
                      <button class="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Export as PDF</button>
                      <button class="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Export as Excel</button>
                  </div>
              {/if}
          </div>
      </div>
  </div>
</div>
