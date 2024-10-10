<script lang="ts">
    import Modal from './Modal.svelte';

    let isModalOpen = false; // Set to false by default

    const openModal = () => {
      isModalOpen = true;
    };

    const closeModal = () => {
      isModalOpen = false;
      resetForm(); // Clear the form fields if needed
    };

    const handleSubmit = (event: SubmitEvent) => {
      event.preventDefault();

      // Ensure event.target is an HTMLFormElement
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);

      // Collecting form data
      const projectData = {
          name: formData.get('projectName'),
          date: formData.get('projectDate'),
          description: formData.get('projectDescription'),
          file: formData.get('projectFile'),
          selectedAttacks: [] as string[] // Initialize an array to hold selected checkbox values
      };

      // Collect selected checkbox values
      const checkboxes = form.querySelectorAll('input[name="options"]:checked') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach((checkbox) => {
          projectData.selectedAttacks.push(checkbox.value); // Safely access 'value' after casting
      });

      console.log('Project Created:', projectData);

      closeModal(); // Close the modal
    };

    const resetForm = () => {
      // Resetting form fields programmatically
      const projectNameInput = document.getElementById('projectName') as HTMLInputElement;
      const projectDescriptionTextarea = document.getElementById('projectDescription') as HTMLTextAreaElement;
      if (projectNameInput) projectNameInput.value = '';
      if (projectDescriptionTextarea) projectDescriptionTextarea.value = '';
    };
</script>

<div class="container">
    <!-- Button to open the Create Project modal -->
    <button on:click={openModal} class="btn variant-filled">Create Project</button>
</div>

<Modal isOpen={isModalOpen} onClose={closeModal}>
  <h2 class="text-xl font-semibold mb-4 text-gray-700 bg-white">Create New Project</h2>
  <form on:submit={handleSubmit} class="space-y-4">
    
    <div>
      <label for="projectName" class="block text-sm font-medium text-gray-700">Project Name</label>
      <input
        type="text"
        id="projectName"
        name="projectName"
        required
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
      />
    </div>

    <div>
      <label for="projectDate" class="block text-sm font-medium text-gray-700">Project Date</label>
      <input 
        type="date"
        id="projectDate"  
        name="projectDate"
        required
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
      />
    </div>

    <div>
      <label for="projectFile" class="block text-sm font-medium text-gray-700">Nessus File</label>
      <input 
        type="file"
        id="projectFile" 
        name="projectFile"
        required
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
      />
    </div>
    
    <div>
      <label for="projectAttack" class="block text-sm font-medium text-gray-700">Select Attacks</label>
      <div class="mt-2 space-y-2">
          <div class="flex items-center">
              <input 
                  type="checkbox" 
                  id="option1" 
                  name="options" 
                  value="Option 1"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="option1" class="ml-2 text-sm text-gray-700">Option 1</label>
          </div>
          <div class="flex items-center">
              <input 
                  type="checkbox" 
                  id="option2" 
                  name="options" 
                  value="Option 2"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="option2" class="ml-2 text-sm text-gray-700">Option 2</label>
          </div>
          <div class="flex items-center">
              <input 
                  type="checkbox" 
                  id="option3" 
                  name="options" 
                  value="Option 3"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="option3" class="ml-2 text-sm text-gray-700">Option 3</label>
          </div>
          <div class="flex items-center">
              <input 
                  type="checkbox" 
                  id="option4" 
                  name="options" 
                  value="Option 4"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="option4" class="ml-2 text-sm text-gray-700">Option 4</label>
          </div>
          <div class="flex items-center">
              <input 
                  type="checkbox" 
                  id="option5" 
                  name="options" 
                  value="Option 5"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="option5" class="ml-2 text-sm text-gray-700">Option 5</label>
          </div>
      </div>
    </div>
    
    <div>
      <label for="projectDescription" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        id="projectDescription"
        name="projectDescription"
        rows="4"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
      ></textarea>
    </div>

    <div class="flex justify-end space-x-2">
      <button
        type="button"
        on:click={closeModal}
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
      >
        Create
      </button>
    </div>
  </form>
</Modal>
