<script>
    import { page } from "$app/stores";
    import { buildings} from "../../../store/data.js";
    import { onMount } from 'svelte';
    import { allDesks, allMeetings, allPrinters } from "../../../store/store.js";
    import VAT83A_0 from "../../../components/Floors/VAT83A_0.svelte"
    import VAT83A_3 from "../../../components/Floors/VAT83A_3.svelte";
    import VAT83A_4 from "../../../components/Floors/VAT83A_4.svelte";
    import VAT83B_2 from "../../../components/Floors/VAT83B_2.svelte";
    import SidebarFloors from "../../../components/Sidebar_floors.svelte";

    onMount(() => {
        setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        }, 100);
    });




    let data1;
    let data2;
    let data3;

    allDesks.subscribe(value => {
        data1 = value;
    });

    allMeetings.subscribe(value => {
        data2 = value;
    });

    allPrinters.subscribe(value => {
        data3 = value;
    });


    let selectedFloor = $page.params.floor;
    let selectedBuilding;



    $: {
        buildings.forEach((item) => {
            if(item.name === $page.params.building) {
                selectedBuilding = item
            } 
        })
    }


</script>


<!-- <SidebarFloors building = {selectedBuilding} selectedFloor={selectedFloor} meetings={data2} printers={data3} desks={data1} /> -->

<div class="plan">
    
    {#if selectedBuilding.name === "VAT83A" }
        <div class="plan-VAT83A">
            {#if selectedFloor === "0" }
                    <VAT83A_0/>
            {:else if selectedFloor === "3"}
                    <VAT83A_3/>
            {:else if selectedFloor === "4"}
                    <VAT83A_4/>
            {:else}
                <div class="no-data font-digits px-4 py-2 ml-80 rounded-md text-xl font-semibold bg-gray-200 w-fit"> No data</div>
            {/if} 
        </div>     
        
    {:else if selectedBuilding.name === "VAT83B"}
        <div class="plan-VAT83B">
            {#if selectedFloor === "-1" }
                    <VAT83B_2/>
            {:else if selectedFloor === "0"}
                    <VAT83B_2/>
            {:else if selectedFloor === "1"}
                    <VAT83B_2/>
            {:else if selectedFloor === "2"}
                    <VAT83B_2/>   
        
            {:else}
                <div class="no-data font-digits px-4 py-2 ml-80 rounded-md text-xl font-semibold bg-gray-200 w-fit"> No data</div>
            {/if}  
        </div>

        
     
    {:else}    
        <div class="no-data font-digits px-6 py-1 mb-2 rounded-md text-xl font-semibold bg-gray-200 w-fit"> No floor plans for this building</div> 
    {/if}
</div>

    


<style lang="scss">

    .plan {
        zoom: 1;

        &-VAT83A {
            margin-left: 8%; 
            @media (max-width: 1600px) {
		        zoom: 0.8;
	        }
	        @media (max-width: 1200px) {
				zoom: 0.6;
	        }
        }

        &-VAT83B {
            margin-left: 15%; 
            @media (max-width: 1600px) {
		        zoom: 0.8;
	        }
	        @media (max-width: 1200px) {
				zoom: 0.6;
	        }
        }

        


    }

  .VAT83A0, .VAT83A4 {
    margin-left: 5%;   
  }

  .VAT83Bm1, .VAT83B0, .VAT83B1, .VAT83B2 {
    margin-left: 15%;   
  }

  
  
  .no-data {
    margin-left: 20%;
    margin-top: 20%
  }

  
 
</style>