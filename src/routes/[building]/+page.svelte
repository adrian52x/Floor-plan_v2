<script>
    import { page } from "$app/stores";
    import { buildings } from "../../store/data.js"
    import Map from "../../components/Map.svelte"
    import SidebarBuildingInfo from "../../components/Sidebar_buildingInfo.svelte"

    console.log($page.params.building);

    let selectedBuilding = {};
    let selectedBuildingZoom = 16;

    // let defaultView = {
    //     lng: 12,
    //     lat: 40,
    //     zoom: 1.5
    // }




    $: {
        buildings.forEach((item) => {
            if(item.name === $page.params.building) {
                selectedBuilding = item
            } 
        })
    }


</script>

<SidebarBuildingInfo building={selectedBuilding}/>

<Map centerLng={selectedBuilding.lng} centerLat={selectedBuilding.lat} zoom={selectedBuildingZoom}/>