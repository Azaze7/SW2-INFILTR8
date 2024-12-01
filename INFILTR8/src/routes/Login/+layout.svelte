<script lang="ts">
    import '/src/app.postcss';
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

    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    storeHighlightJs.set(hljs);

    $: isAuthenticated = !!$user;
</script>

{#if isAuthenticated}
    <AppShell>
        <slot />
    </AppShell>
{:else}
    <Authenticate />
{/if}
