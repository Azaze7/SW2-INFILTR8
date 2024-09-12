<script>
    import Footer from "$lib/components/dashboardUI/Footer.svelte";
    import Navbar from "$lib/components/dashboardUI/Navbar.svelte";
    import Sidebar from "$lib/components/dashboardUI/Sidebar.svelte";

</script>

<Navbar/>
<div class="test">
    <Sidebar/>
    home
</div>

<Footer/>
<style>
    .test {
        display: flex;
    }
</style>