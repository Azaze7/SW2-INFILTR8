<script lang="ts">
    import '/src/app.postcss';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { user } from "$lib/components/loginUI/userStore"; 
    import Authenticate from "$lib/components/loginUI/Authenticate.svelte";
    import { AppShell } from '@skeletonlabs/skeleton';
    // Highlight JS imports
    import hljs from 'highlight.js/lib/core';
    import 'highlight.js/styles/github-dark.css';
    import { storeHighlightJs } from '@skeletonlabs/skeleton';
    import xml from 'highlight.js/lib/languages/xml'; 
    import css from 'highlight.js/lib/languages/css';
    import javascript from 'highlight.js/lib/languages/javascript';
    import typescript from 'highlight.js/lib/languages/typescript';
    import { onMount } from 'svelte';
    
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    storeHighlightJs.set(hljs);

    $: isAuthenticated = !!$user;

  onMount(() => {
    const savedFilter = localStorage.getItem('filter');
    if (savedFilter) {
      document.documentElement.style.filter = savedFilter;
    }});
  

</script>

{#if isAuthenticated}
    <AppShell>
        <!-- Render the main application layout when authenticated -->
        <slot />

    </AppShell>
{:else}
    <!-- Render the login UI when not authenticated -->
    <Authenticate />
{/if}

<!-- Define the color filters globally -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <filter id="protanopia">
        <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/>
    </filter>
    <filter id="deuteranopia">
        <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/>
    </filter>
    <filter id="tritanopia">
        <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/>
    </filter>
</svg>