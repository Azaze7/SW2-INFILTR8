<script lang="ts">
    import '/src/app.postcss';
    import { user } from "$lib/components/loginUI/userStore"; // Correctly import the user store from the separate store file
    import Authenticate from "$lib/components/loginUI/Authenticate.svelte"; // Import the Authenticate component
    import { AppShell } from '@skeletonlabs/skeleton';

    // Highlight JS imports
    import hljs from 'highlight.js/lib/core';
    import 'highlight.js/styles/github-dark.css';
    import { storeHighlightJs } from '@skeletonlabs/skeleton';
    import xml from 'highlight.js/lib/languages/xml'; 
    import css from 'highlight.js/lib/languages/css';
    import javascript from 'highlight.js/lib/languages/javascript';
    import typescript from 'highlight.js/lib/languages/typescript';

    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    storeHighlightJs.set(hljs);

    // Reactive value for authentication status
    $: isAuthenticated = !!$user;
</script>

{#if isAuthenticated}
    <AppShell>
        <!-- Render the main application layout when authenticated -->
        <slot />
        <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
    </AppShell>
{:else}
    <!-- Render the login UI when not authenticated -->
    <Authenticate />
{/if}
