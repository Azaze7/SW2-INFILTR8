<script lang="ts">
    import { getDrawerStore } from "@skeletonlabs/skeleton";

    const drawerStore = getDrawerStore();

    function drawerClose(): void {
     drawerStore.close();
}
</script>

<nav class="list-nav p-4">
    <ul>
        <li><a href="/dashboard" on:click={drawerClose}>Homepage</a></li>
        <li><a href="/ProjectManager" on:click={drawerClose}>Project Manager</a></li>
        <li><a href="/analysis"on:click={drawerClose}>Blog</a></li>
        <li><a href="/Testing"  on:click={drawerClose}>Contact</a></li>
    </ul>
</nav>
