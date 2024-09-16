<script>
    import BarChartBox from "./BarChartBox.svelte";
    import BottomBox from "./BottomBox.svelte";
    import ChartBox from "./ChartBox.svelte";
    import PieChartBox from "./PieChartBox.svelte";
    import TopBox from "./TopBox.svelte";

</script>
<div class="grids">
    <div class="box box1"><TopBox/></div>
    <div class="box box2"><ChartBox/></div>
    <div class="box box4"><PieChartBox/></div>
    <div class="box box5"><ChartBox/></div>
    <div class="box box7"><BottomBox/></div>

</div>

<style>
    .grids {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: minmax(160px, auto);
        margin-top: -1.5rem;
        
        
    }

    .box {
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #384256;

    }

    .box1{
        grid-column: span 1;
        grid-row: span 3;
        
    }

    .box4 {
        grid-column: span 1;
        grid-row: span 3;
    }

    .box7 {
        grid-column: span 2;
        grid-row: span 2;
    }
</style>