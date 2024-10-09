<script lang="ts">
  import { FileDropzone, LightSwitch, ProgressRadial } from "@skeletonlabs/skeleton";
  import { onMount, onDestroy } from 'svelte';
  import CreateProject from "$lib/components/dashboardUI/CreateProject.svelte"; // Import the CreateProject component
  import { writable } from 'svelte/store';

  let button: HTMLButtonElement | null = null;
  let dropdownMenu: HTMLDivElement | null = null;
  let isProjectFormOpen = false; // Boolean to toggle CreateProject modal visibility
  let isDropdownVisible = false; // Boolean to toggle dropdown visibility

  // File drop and input logic
  let files: File[] = [];
  let isDragOver = false;
  let fileInput: HTMLInputElement;
  let uploadProgress = writable<number>(0); // Store to track upload progress

  // Function to handle file selection
  function handleFiles(selectedFiles: FileList) {
    files = [...files, ...Array.from(selectedFiles)];
  }

  // Event handlers for drag & drop
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

  // Trigger file input click
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

  // Dropdown handling
  const toggleDropdown = () => {
    isDropdownVisible = !isDropdownVisible;
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (button && dropdownMenu && !button.contains(target) && !dropdownMenu.contains(target)) {
      isDropdownVisible = false;
    }
  };

  onMount(() => {
    if (button) {
      button.addEventListener('click', toggleDropdown);
    }
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    if (button) {
      button.removeEventListener('click', toggleDropdown);
    }
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-10 text-center flex flex-col items-center">
      <h2 class="h2">Welcome to INFILTR8.</h2>

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
                    on:click={handleDropAreaClick} 
                    on:dragover={handleDragOver} 
                    on:dragleave={handleDragLeave} 
                    on:drop={handleDrop}
                    class:is-drag-over={isDragOver}>
                      <span class="file-message">Drag & Drop files here or click to upload</span>
                      <input type="file" bind:this={fileInput} on:change={handleFileInputChange} accept=".nessus" style="display: none;">
                  </div>
                  <!-- Visible file input as alternative -->
                  <div>
                      <p>Or use the button below to upload a file:</p>
                      <input type="file" on:change={handleFileInputChange} accept=".nessus">
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

          <!-- Export Button with Dropdown -->
          <div class="relative flex">
              <button class="btn variant-filled" bind:this={button}>Export Options</button>
              {#if isDropdownVisible}
                  <!-- Dropdown menu -->
                  <div class="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg dropdown-menu" bind:this={dropdownMenu}>
                      <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="https://skeleton.dev/" target="_blank" rel="noreferrer">
                          Export Project
                      </a>
                      <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="#option2">Export as PDF</a>
                      <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="#option3">Export as Excel</a>
                  </div>
              {/if}
          </div>
      </div>
  </div>
</div>

<!-- Render the CreateProject component conditionally -->
{#if isProjectFormOpen}
  <CreateProject on:close={closeProjectForm} />
{/if}

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
