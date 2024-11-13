<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { ProgressRadial, FileDropzone, FileButton, popup } from "@skeletonlabs/skeleton";
  import type { PopupSettings } from "@skeletonlabs/skeleton";
  import { projectFolders } from '$lib/stores/projectFoldersStore'; 
  import { createLogEntry, fetchLogs } from '../../routes/Logs/logservice';

  let button: HTMLButtonElement | null = null;
  let dropdownMenu: HTMLDivElement | null = null;
  let isDropdownVisible = false;
  let projectName = ''; 
  let selectedProject = ''; 
  let files: FileList | undefined; 
  let uploadProgress = writable<number>(0); 
  let isDragOver = false;

  let logs: any[] = [];
  let filteredLogs: any[] = [];

  const popupSettings: PopupSettings = {
    event: 'click',
    target: 'createProjectPopup',
    placement: 'bottom',
  };

  async function fetchProjectFolders() {
    try {
      const response = await fetch('http://localhost:3000/projects');
      if (response.ok) {
        const folders = await response.json();
        projectFolders.set(folders); 
      } else {
        console.error('Failed to fetch project folders');
      }
    } catch (error) {
      console.error('Error fetching project folders:', error);
    }
  }

  async function fetchUserLogs() {
    const fetchedLogs = await fetchLogs();

    if (fetchedLogs !== undefined && fetchedLogs !== null) {
      logs = fetchedLogs;
    } else {
      logs = [];
    }

    // Sort logs by date, newest first
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    filteredLogs = logs.slice(0, 5);
    console.log(filteredLogs);
  }

  onMount(() => {
    fetchProjectFolders();
    fetchUserLogs();
  });

  /* Luis' Section: 
   * 
   * WILL IMPLEMENT THIS AS SOON AS WE GET THE FRONT END FIGURED OUT. 
   * WE NEED TO ASK THE CUSTOMER HOW THEY WANT THIS TO WORK. 
   * 
   * SRS ONLY SAYS "Shows a list of notifications" which is very vague 
   * Will have to figure out what exactly these types of notifications are so 
   * we can implement the functions below. 
   */
  async function uploadToNeo4j() {} // COMPLETE THIS LATER
  async function uploadFile() {} // COMPLETE THIS LATER
  async function createProjectFolder() {} // COMPLETE THIS LATER
  async function deleteProjectFolder() {} // COMPLETE THIS LATER
</script>

<div class="container h-full mx-auto flex justify-center items-start py-10 space-x-10">
  <!-- Removed Notifications Section -->

  <!-- Upload Section -->
  <div class="space-y-8 w-full max-w-md text-center flex flex-col items-center rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-white-800">Welcome to INFILTR8</h2>

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
        bind:value={selectedProject}>
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
        button="w-full p-3 bg-primary-100 text-primary-600 rounded-md hover:bg-primary-200 transition-colors text-gray-700">
        Upload
      </FileButton>

      <footer class="mt-4 flex flex-col items-center space-y-2">
        {#if files && files.length > 0}
          <button 
            on:click={uploadFile} 
            class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
            Upload Selected File
          </button>
        {/if}
        <ProgressRadial 
          value={$uploadProgress} 
          stroke={100} 
          meter="stroke-primary-500" 
          track="stroke-primary-500/30" />
      </footer>
    </figure>

    <!-- Button to trigger CSV Upload to Neo4j -->
    <div class="w-full">
      <button 
        class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors" 
        on:click={uploadToNeo4j}>
        Upload CSV to Neo4j
      </button>
    </div>

    <!-- Export and Delete Project -->
    <div class="flex space-x-4 justify-center w-full">
      <button 
        class="w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors" 
        on:click={deleteProjectFolder}>
        Delete Project
      </button>

      <!-- Export Button with Dropdown -->
      <div class="relative w-full">
        <button 
          class="w-full p-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors" 
          bind:this={button}>
          Export Options
        </button>
        {#if isDropdownVisible}
          <div 
            class="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10"
            bind:this={dropdownMenu} 
            role="menu" 
            aria-label="Export Options">
            <button class="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Export Project</button>
            <button class="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Export as PDF</button>
            <button class="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100">Export as Excel</button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  /* Add your styles here */
</style>