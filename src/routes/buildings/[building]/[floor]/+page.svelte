<script>
    import { page } from "$app/stores";
    import { rooms, buildings} from "../../../../store/data.js";
    
    import VAT83A_0 from "../../../../components/Floors/VAT83A_0.svelte";
    import VAT83A_3 from "../../../../components/Floors/VAT83A_3.svelte";
    import VAT83A_4 from "../../../../components/Floors/VAT83A_4.svelte";

    import SidebarFloors from "../../../../components/Sidebar_floors.svelte";



    console.log($page.params);

    let selectedFloor = $page.params.floor;
    let selectedBuilding;



    $: {
        buildings.forEach((item) => {
            if(item.name === $page.params.building) {
                selectedBuilding = item
            } 
        })
    }

    let meetings = rooms?.filter(object => object.type === 'meetingRoom')
    let printers = rooms?.filter(object => object.type === 'printerRoom')
    let desks = rooms?.filter(object => object.type === 'desk')

</script>


<SidebarFloors building = {selectedBuilding} selectedFloor={selectedFloor} meetings={meetings} printers={printers} desks={desks} />

<div class="plan">
    
    {#if selectedBuilding.name === "VAT83A" }
            {#if selectedFloor === "0" }
                <VAT83A_0/>
                    
            {:else if selectedFloor === "3"}
                <VAT83A_3/>

            {:else if selectedFloor === "4"}
                <VAT83A_4/>    
            {:else}
                <div class="no-data font-digits px-4 py-2 ml-80 rounded-md text-xl font-semibold bg-gray-200 w-fit"> No data</div>
            {/if} 
        
        {:else}
        <div class="no-data font-digits px-6 py-1 mb-2 rounded-md text-xl font-semibold bg-gray-200 w-fit"> No floor plans for this building</div>  
    {/if}
</div>

    


<style>

  .plan {
    margin-left: 30%;
    
  }
  
  .no-data {
    margin-left: 20%;
    margin-top: 20%
  }
 
</style>