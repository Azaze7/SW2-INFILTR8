<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { ProgressRadial, FileDropzone, FileButton, popup } from "@skeletonlabs/skeleton";
  import type { PopupSettings } from "@skeletonlabs/skeleton";
  import { projectFolders } from '$lib/stores/projectFoldersStore'; 
  import { createLogEntry, fetchLogs } from '../../routes/Logs/logservice';
  import { user } from "$lib/components/loginUI/userStore";

  let button: HTMLButtonElement | null = null;
  let dropdownMenu: HTMLDivElement | null = null;
  let isDropdownVisible = false;
  let projectName = ''; // Name of the project (folder)
  let selectedProject = ''; // Currently selected project
  let files: FileList | undefined; // Fix: use undefined instead of null
  let uploadProgress = writable<number>(0); // Store to track upload progress
  let isDragOver = false; // State for drag-over detection
  let uploadStarted = false; // State to track if upload has started

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

  async function fetchUserLogs() {
    try {
      await fetchLogs();
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }

  onMount(() => {
    fetchProjectFolders();
    fetchUserLogs();
  });

  // Function to trigger CSV upload to Neo4j
  async function uploadToNeo4j() {
    if (!selectedProject) {
      alert('Please select a project to upload CSVs to Neo4j.');
      await createLogEntry({
        type: 'Warning',
        message: `No project folder specified while attempting to upload files to the database`
      });
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
        uploadProgress.set(100);
      } else {
        console.error('Failed to upload CSV data to Neo4j');
      }
    } catch (error) {
      console.error('Error uploading CSV data to Neo4j:', error);
    }
  }

  async function uploadFile() {
    try {
      if (!files || files.length === 0) {
        throw new Error('No file selected');
      }

      if (!selectedProject) {
        throw new Error('No project selected');
      }

      uploadStarted = true;
      uploadProgress.set(0);

      const formData = new FormData();
      formData.append('nessusFile', files[0]);
      formData.append('projectName', selectedProject);

      const response = await fetch('http://localhost:3000/upload-nessus', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      console.log('File uploaded successfully');
      uploadProgress.set(100);
      await createLogEntry({
        type: 'Information',
        message: `File uploaded successfully for project: ${selectedProject}`
      });

    } catch (error) {
      console.error('Upload failed:', error);
      await createLogEntry({
        type: 'Error',
        message: `Failed to upload file for project: ${selectedProject}`
      });
      uploadStarted = false;
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
        fetchProjectFolders();
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
      await createLogEntry({
        type: 'Warning',
        message: `No project folder was selected for deletion`
      });
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
        await createLogEntry({
          type: 'Information',
          message: `Project folder: ${selectedProject} was deleted`
        });
        fetchProjectFolders();
      } else {
        console.error('Failed to delete project folder');
        await createLogEntry({
          type: 'Error',
          message: `Failed to delete project folder: ${selectedProject}`
        });
      }
    } catch (error) {
      console.error('Error deleting project folder:', error);
    }
  }
</script>

<div class="container h-full mx-auto flex justify-center items-start py-10 space-x-10">
  <!-- Main Content -->
  <div class="space-y-8 w-full max-w-5xl text-center flex flex-wrap justify-between items-start">
    <h2 class="text-2xl font-bold text-white-800 w-full">
      Welcome {$user?.username || ''} to INFILTR8
    </h2>

    <!-- Left Side -->
    <div class="w-[45%]">
      <!-- Project Name Input -->
      <div class="flex flex-col space-y-2 w-full">
        <button 
          class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors" 
          use:popup={popupSettings}>
          Create Project
        </button>

        <!-- Dropdown Menu for Project Creation -->
        <div class="card p-4 w-72 shadow-xl" data-popup="createProjectPopup">
          <input 
            type="text" 
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-700" 
            placeholder="Enter project name" 
            bind:value={projectName} />
          <button 
            class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors mt-2" 
            on:click={createProjectFolder}>
            Create
          </button>
        </div>
      </div>

      <!-- Delete Project -->
      <button 
        class="w-full p-3 mt-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" 
        on:click={deleteProjectFolder}>
        Delete Project
      </button>
    </div>

    <!-- Right Side -->
    <div class="w-[45%]">
      <!-- Select Project Folder -->
      <div class="w-full mt-4">
        <select 
          class="w-full p-3 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-gray-700" 
          bind:value={selectedProject}>
          <option value="" disabled>Select Project Folder</option>
          {#each $projectFolders as folder}
            <option value={folder}>{folder}</option>
          {/each}
        </select>
      </div>

      <!-- File Upload Section -->
      <figure class="w-full bg-white border border-gray-200 p-4 rounded-md shadow-sm mt-4">
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
            {#if uploadStarted}
              <ProgressRadial 
                value={$uploadProgress} 
                stroke={100} 
                meter="stroke-primary-500" 
                track="stroke-primary-500/30" 
              />
            {/if}
          {/if}
        </footer>
      </figure>
    </div>
  </div>
</div>
