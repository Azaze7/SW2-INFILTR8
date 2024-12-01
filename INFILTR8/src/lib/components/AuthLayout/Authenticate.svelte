<script lang="ts">
    import { page } from '$app/stores'; 
    import Authenticate from '$lib/components/AuthLayout/Authenticate.svelte';
    import { AppShell } from '@skeletonlabs/skeleton'; 
    import { user } from '$lib/stores/user';

    
    $: isAuthenticated = !!$user;

 
    console.log('isAuthenticated:', isAuthenticated);
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
