<script lang="ts">
  
    import AppRailMenu from '$lib/components/AppRailMenu.svelte'; // Import the new AppRailMenu component
    import '/src/app.postcss';
    import { goto } from '$app/navigation'; // Import goto for programmatic navigation
    import { AppShell, AppBar } from '@skeletonlabs/skeleton';

    let greeting = "";
    let currentHour = new Date().getHours();

    // Determine the greeting based on the time of day
    if (currentHour < 12) {
        greeting = "Good morning!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon!";
    } else {
        greeting = "Good evening!";
    }

    // Function to navigate to analysis page
    const navigateToAnalysis = () => {
        goto('/analysis');
    };
</script>

<!-- AuthLayout Wrapper -->

    <!-- App Shell -->
    <AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
        <!-- Header -->
        <svelte:fragment slot="header">
            <!-- App Bar -->
            <AppBar>
                <svelte:fragment slot="lead">
                    <strong class="text-xl uppercase"><p>{greeting}</p></strong>
                </svelte:fragment>
                <svelte:fragment slot="trail">
                    <a class="btn btn-sm variant-ghost-surface" href="https://discord.gg/EXqV7W8MtY" target="_blank" rel="noreferrer">
                        Discord
                    </a>
                    <a class="btn btn-sm variant-ghost-surface" href="https://twitter.com/SkeletonUI" target="_blank" rel="noreferrer">
                        Twitter
                    </a>
                    <a class="btn btn-sm variant-ghost-surface" href="https://github.com/skeletonlabs/skeleton" target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                </svelte:fragment>
            </AppBar>
        </svelte:fragment>

        <!-- Sidebar Left -->
        <svelte:fragment slot="sidebarLeft">
            <AppRailMenu /> <!-- Use the new AppRailMenu component here -->
        </svelte:fragment>

        <!-- Page Route Content -->
        <slot />
    </AppShell>

