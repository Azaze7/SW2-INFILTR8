<script lang="ts">
  import { FileDropzone, LightSwitch } from "@skeletonlabs/skeleton";
  import { onMount, onDestroy } from 'svelte';
  import CreateProject from "$lib/components/dashboardUI/CreateProject.svelte"; // Import the CreateProject component

  let button: HTMLButtonElement | null = null;
  let dropdownMenu: HTMLDivElement | null = null;
  let isProjectFormOpen = false; // Boolean to toggle CreateProject modal visibility

  // Function to open the modal
  const openProjectForm = () => {
      console.log("Clicked Create Project");
      isProjectFormOpen = true;
  };

  // Function to close the modal
  const closeProjectForm = () => {
      console.log("Closing Create Project");
      isProjectFormOpen = false;
  };

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => {
      if (dropdownMenu) {
          dropdownMenu.classList.toggle('hidden');
      }
  };

  // Event listener for closing the dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (button && dropdownMenu && !button.contains(target) && !dropdownMenu.contains(target)) {
          dropdownMenu.classList.add('hidden');
      }
  };

  // Setup event listeners when the component is mounted
  onMount(() => {
      if (button) {
          button.addEventListener('click', toggleDropdown);
      }
      document.addEventListener('click', handleClickOutside);

      // Cleanup event listeners when the component is destroyed
      onDestroy(() => {
          if (button) {
              button.removeEventListener('click', toggleDropdown);
          }
          document.removeEventListener('click', handleClickOutside);
      });
  });
</script>

<div class="container h-full mx-auto flex justify-center items-center">
<div class="space-y-10 text-center flex flex-col items-center">
  <h2 class="h2">Welcome to INFILTR8.</h2>
  <figure>
    <div class="card">
      <header class="card-header">
        <h1 class="card-title">File Upload</h1>
        <p class="card-subtitle">Drag and drop files here or click to select files.</p>
      </header>
      <section class="p-4">
        <FileDropzone name="files" />
      </section>
      <footer class="card-footer">(Current File Here)</footer>
    </div>
  </figure>
  
  <!-- Buttons for Create, Sync, Delete, and Export -->
  <div class="flex space-x-4 justify-center">
    <!-- Create Project Button -->
    <button class="btn variant-filled" on:click={openProjectForm}>Create Project</button>
    <button class="btn variant-filled">Sync Project</button>
    <button class="btn variant-filled">Delete Project</button>

    <!-- Export Button with Dropdown -->
    <div class="relative flex">
      <button class="btn variant-filled" bind:this={button}>Export Options</button>
      <!-- Dropdown menu -->
      <div class="absolute mt-2 hidden w-48 bg-white border border-gray-200 rounded-md shadow-lg dropdown-menu" bind:this={dropdownMenu}>
        <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="https://skeleton.dev/" target="_blank" rel="noreferrer">
          Export Project
        </a>
        <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="#option2">Export as PDF</a>
        <a class="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="#option3">Export as Excel</a>
      </div>
    </div>
  </div>
</div>
</div>

<!-- Render the CreateProject component conditionally -->
{#if isProjectFormOpen}
<CreateProject on:close={closeProjectForm} /> <!-- Pass closeProjectForm to handle closing -->
{/if}
