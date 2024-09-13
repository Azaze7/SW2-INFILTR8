<script>
    import ChartBox from "./ChartBox.svelte";
import TopBox from "./TopBox.svelte";

</script>
<div class="grids">
    <div class="box box1"><TopBox/></div>
    <div class="box box2"><ChartBox/></div>
    <div class="box box3"><ChartBox/></div>
    <div class="box box4">
        Box4
    </div>
    <div class="box box5"><ChartBox/></div>
    <div class="box box6"><ChartBox/></div>
    <div class="box box7">
        Box7
    </div>
    <div class="box box8">
        Box8
    </div>
    <div class="box box9">
        Box9
    </div>
</div>

<style>
    .grids {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: minmax(180px, auto);
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