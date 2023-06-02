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
    import Input from "../../../components/Input.svelte";

    // onMount(() => {
    //     setTimeout(() => {
    //     window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    //     }, 100);
    // });


    let search = '';


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
    <div class="header">

        <!-- <div class="header-levels font-digits">
            <input type="radio" id="floorm1" bind:group={selectedFloor} value="-1">
            <label for="floor1">Floor -1</label><br>

            <input type="radio" id="floor0" bind:group={selectedFloor} value="0">
            <label for="floor1">Floor 0</label><br>

            <input type="radio" id="floor1" bind:group={selectedFloor} value="1">
            <label for="floor1">Floor 1</label><br>

            <input type="radio" id="floor2" bind:group={selectedFloor} value="2">
            <label for="floor2">Floor 2</label><br>

            <input type="radio" id="floor4" bind:group={selectedFloor} value="4">
            <label for="floor3">Floor 4</label>
        </div> -->

        <div class="header-back">
            <a href="/">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45">
                    <path fill="currentColor" d="M21.41,11H7.83l4.88-4.88A1,1,0,0,0,10.29,4.29L2.29,12.29a1,1,0,0,0,0,1.42L10.29,19.71a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L7.83,13h13.58a1,1,0,0,0,0-2Z"/>
                </svg>
                <span class = "font-digits">Back</span>
            </a>
        </div>

        <div class="header-search">
                <Input bind:value={search} placeholder="Enter keywords..." />
        </div>
    </div>

                
    
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
            margin-left: 15%; 
            @media (max-width: 1600px) {
		        zoom: 0.8;
	        }
	        @media (max-width: 1200px) {
				zoom: 0.6;
	        }
        }

        &-VAT83B {
            margin-left: 25%; 
            @media (max-width: 1600px) {
		        zoom: 0.8;
	        }
	        @media (max-width: 1200px) {
				zoom: 0.6;
	        }
        }

        


    }

    

    
    .header{
        display: grid;
        grid-template-columns: 25% 1fr;

        &-back {
            
            padding: 10px 20px;
           
        }

        &-search {
            margin-top: 15px;
            display: flex;
			width: 50%;
            height: 100px;
			padding: 10px;
            // border: 2px solid black;
        }
    }

  
    .no-data {
        margin-left: 20%;
        margin-top: 20%
    }

  
 
</style>