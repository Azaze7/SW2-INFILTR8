<script lang="ts">
    import { page } from '$app/stores';
    import Authenticate from '$lib/components/AuthLayout/Authenticate.svelte';
    import { AppShell } from '@skeletonlabs/skeleton';
    import { user } from '$lib/stores/user';

    // Reactive value for authentication status
    $: isAuthenticated = !!$user;
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
