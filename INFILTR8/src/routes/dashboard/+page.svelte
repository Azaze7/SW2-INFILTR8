<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { ProgressRadial, FileDropzone, FileButton, popup } from "@skeletonlabs/skeleton";
  import type { PopupSettings } from "@skeletonlabs/skeleton";
  import { projectFolders } from '$lib/stores/projectFoldersStore'; 
  import { createLogEntry } from '../../routes/Logs/logservice';

  let button: HTMLButtonElement | null = null;
  let dropdownMenu: HTMLDivElement | null = null;
  let isDropdownVisible = false;
  let projectName = ''; 
  let selectedProject = ''; 
  let files: FileList | undefined; 
  let uploadProgress = writable<number>(0); 
  let isDragOver = false; 

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

  onMount(() => {
    fetchProjectFolders();
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
  <!-- Notifications Section -->
  <div class="notifications-container">
    <h2 class="notifications-header">📧 Notifications</h2>
    <div class="notification unread">
      <div class="notification-title">Notification error!</div>
      <div class="notification-details">A target IP "10.0.0.2" was not found!</div>
      <div class="notification-status">Unread</div>
      <div class="notification-date">4.6.2019 | 13:44</div>
    </div>
    <div class="notification">
      <div class="notification-title">File updated</div>
      <div class="notification-details">cyber..Dependencies.pcap</div>
      <div class="notification-date">4.6.2019 | 13:44</div>
    </div>
    <div class="notification">
      <div class="notification-title">Error message!</div>
      <div class="notification-details">Target Files are missing!</div>
      <div class="notification-date">4.6.2019 | 13:44</div>
    </div>
  </div>

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

    <!-- Select Project Folder -->
    <div class="w-full">
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
  body {
    font-family: Arial, sans-serif;
    background-color: #1b1f3a;  
    color: #f5f5f5;  
    margin: 0;
    padding: 20px;
  }

  .container {
    display: flex;
    flex-direction: row;
    align-items: center; /* Center vertically */
    justify-content: center;
    gap: 30px; /* Increased gap for more spacing */
    height: 100vh; /* Full viewport height to help with vertical centering */
  }

  .notifications-container {
    max-width: 350px; /* Increased width for more space */
    background-color: #2c2f48;  
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);  
    padding: 20px;
    color: #ffffff;  
  }

  .notifications-header {
    font-size: 20px;
    font-weight: bold;
    color: #d1d5db;  
    margin-bottom: 20px;
  }

  .notification {
    padding: 15px;
    border-bottom: 1px solid #3c3f5c;  
    display: flex;
    flex-direction: column;
  }

  .notification:last-child {
    border-bottom: none;
  }

  .notification-title {
    font-size: 16px;
    font-weight: bold;
    color: #f1f5f9; 
  }

  .notification-details {
    font-size: 14px;
    color: #cbd5e1; 
    margin: 5px 0;
  }

  .notification-status {
    color: #ff4d6d; 
    font-weight: bold;
    margin-top: 5px;
  }

  .notification-date {
    font-size: 12px;
    color: #a1a1aa; 
    margin-top: 5px;
  }

  .unread {
    background-color: #374151; 
    border-left: 4px solid #ff4d6d; 
  }

  .upload-section {
    max-width: 500px;
    width: 100%;
    color: #ffffff; 
  }

  .text-white-800 {
    color: #e5e7eb; 
  }

  button {
    background-color: #4f46e5; 
    color: #ffffff; 
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #4338ca; 
  }

  .bg-primary-500 {
    background-color: #3b82f6; 
  }

  .bg-primary-600 {
    background-color: #2563eb; 
  }

  .bg-red-500 {
    background-color: #ef4444; 
  }

  .bg-red-600 {
    background-color: #dc2626; 
  }
</style>