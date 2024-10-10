<script lang="ts">
    export let isOpen = false;
    export let onClose = () => {};
  
    const handleKeydown = (/** @type {{ key: string; }} */ event: { key: string; }) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
  
    $: if (isOpen) {
      window.addEventListener('keydown', handleKeydown);
    } else {
      window.removeEventListener('keydown', handleKeydown);
    }
  </script>
  
  {#if isOpen}
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <!-- Modal Content -->
      <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
        <!-- Close Button -->
        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          on:click={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
  
        <slot></slot>
      </div>
    </div>
  {/if}
  
  <style>
    
  </style>
  