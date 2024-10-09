<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { ProgressRadial, FileDropzone, FileButton } from "@skeletonlabs/skeleton";

  let button: HTMLButtonElement | null = null;
  let dropdownMenu: HTMLDivElement | null = null;
  let isProjectFormOpen = false;
  let isDropdownVisible = false;

  let projectName = ''; // Name of the project (folder)
  let projectFolders: string[] = []; // List of project folders
  let selectedProject = ''; // Currently selected project

  let files: FileList | undefined; // Fix: use undefined instead of null
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

  async function uploadFile() {
    if (!files || files.length === 0) {  // Fix: Check if files is undefined or empty
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
          <!-- File Dropzone Component -->
          <FileDropzone bind:files={files} name="files">
              <svelte:fragment slot="lead">(icon)</svelte:fragment>
              <svelte:fragment slot="message">Drag & Drop files here or click to upload</svelte:fragment>
              <svelte:fragment slot="meta">(meta information)</svelte:fragment>
          </FileDropzone>

          <!-- Alternative File Button Component -->
          <FileButton bind:files={files} name="files" button="btn variant-soft-primary">Upload</FileButton>

          <!-- Display Selected Files and Progress -->
          <footer class="card-footer">
              {#if files?.length > 0}
                <button on:click={uploadFile} class="btn variant-filled">Upload Selected File</button>
              {/if}
              <ProgressRadial value={$uploadProgress} stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" />
          </footer>
      </figure>

      <!-- Export and Delete Project -->
      <div class="flex space-x-4 justify-center">
          <button class="btn variant-filled" on:click={deleteProjectFolder}>Delete Project</button>

          <!-- Export Button with Dropdown -->
          <div class="relative flex">
              <button class="btn variant-filled" bind:this={button}>Export Options</button>
              {#if isDropdownVisible}
                  <div class="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg dropdown-menu" bind:this={dropdownMenu}>
                      <button class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Export Project</button>
                      <button class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Export as PDF</button>
                      <button class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Export as Excel</button>
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
