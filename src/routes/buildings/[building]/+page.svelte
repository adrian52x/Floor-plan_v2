<script>
    import { page } from "$app/stores";
    import Map from "../../../components/Map.svelte";
    import SidebarBuildingInfo from "../../../components/Sidebar_buildingInfo.svelte";

    console.log($page.params.building);

    let selectedBuilding = {};
    let selectedBuildingZoom = 16;

    // let defaultView = {
    //     lng: 12,
    //     lat: 40,
    //     zoom: 1.5
    // }


    const buildings = [
        {
            name: "VAT83A",
            lng: 12.479901795222497,
            lat: 55.73510758176267,
            floors: [0,3,4]
        },
        {
            name: "KH7",
            lng: 12.474698336540886,
            lat: 55.731868790571276,
            floors: [0,1,2]
        },
        {
            name: "Japan",
            lng: 140.10951294244973,
            lat: 35.53848158582272
        }
        ,
        {
            name: "Milan",
            lng: 9.188459141002138,
            lat: 45.53172243209325
        },
        {
            name: "Seattle",
            lng: -122.20083465937067,
            lat: 47.802990703043676
        }
    ]

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