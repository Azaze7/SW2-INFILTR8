<script lang="ts">
    import { FileDropzone, LightSwitch } from "@skeletonlabs/skeleton";
    import { onMount } from 'svelte';
  
    let button: HTMLButtonElement | null = null;
    let dropdownMenu: HTMLDivElement | null = null;
  
    onMount(() => {
      if (button && dropdownMenu) {
        button.addEventListener('click', () => {
          dropdownMenu?.classList.toggle('hidden');
        });
  
        document.addEventListener('click', (e) => {
          const target = e.target as Node;
  
          if (button && dropdownMenu && !button.contains(target) && !dropdownMenu.contains(target)) {
            dropdownMenu.classList.add('hidden');
          }
        });
      }
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
        <footer class="card-footer">(footer)</footer>
      </div>
      <div class="card">
        <header class="card-header">
          <h1 class="card-title">File Upload</h1>
          <p class="card-subtitle">Dark Mode</p>
        </header>
        <section class="p-4">
          <LightSwitch />
        </section>
        <footer class="card-footer">(footer)</footer>
      </div>
      <section class="img-bg" />
    </figure>
    
    <!-- Buttons for Create, Sync, Delete, and Export -->
    <div class="flex space-x-4 justify-center">
      <button class="btn variant-filled">Create Project</button>
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
