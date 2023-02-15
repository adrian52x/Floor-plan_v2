<script>
    import { page } from "$app/stores";
    
    import VAT83A_0 from "../../../../components/Floors/VAT83A_0.svelte";
    import VAT83A_3 from "../../../../components/Floors/VAT83A_3.svelte";
    import VAT83A_4 from "../../../../components/Floors/VAT83A_4.svelte";

    import SidebarFloors from "../../../../components/Sidebar_floors.svelte";



    console.log($page.params);

    let selectedFloor = $page.params.floor;
    let selectedBuilding;

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


<SidebarFloors building = {selectedBuilding}/>

<div class="plan">
    
    {#if selectedBuilding.name === "VAT83A" }
            {#if selectedFloor === "0" }
                <VAT83A_0/>
                    
            {:else if selectedFloor === "3"}
                <VAT83A_3/>

            {:else if selectedFloor === "4"}
                <VAT83A_4/>    
            {:else}
                <div class="px-4 py-2 ml-80 bg-pink-700 rounded-md font-semibold text-gray-50 w-fit"> No data</div>
            {/if} 
        
        {:else}
        <div class="px-4 py-2 ml-80 bg-pink-700 rounded-md font-semibold text-gray-50 w-fit"> No floor plans for this building</div>  
    {/if}
</div>

    


<style>

  .plan {
    margin-left: 30%;
    
  }
 
</style>