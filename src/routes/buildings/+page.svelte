<script>
    import Map from "../../components/Map.svelte";
    import SidebarBuildings from "../../components/Sidebar_buildings.svelte";

   
    let defaultLng = 12;
    let defaultLat = 40;
    let defaultZoom = 1.5;
    
//test v2
</script>


<div class="grid">

    <SidebarBuildings/>

    <Map centerLng={defaultLng} centerLat={defaultLat} zoom={defaultZoom}/>
</div>



<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr;
        height: 100vh;
    }
</style>