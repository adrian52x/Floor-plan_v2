<script>
    import { page } from "$app/stores";
    import { buildings} from "../../../store/data.js";
    import { onMount } from 'svelte';
    import { baseURL } from "../../../store/store.js";
    import { user } from "../../../security/auth.js";
    import VAT83A_0 from "../../../components/Floors/VAT83A_0.svelte"
    import VAT83A_3 from "../../../components/Floors/VAT83A_3.svelte";
    import VAT83A_4 from "../../../components/Floors/VAT83A_4.svelte";
    import VAT83B_m1 from "../../../components/Floors/VAT83B_m1.svelte";
    import VAT83B_0 from "../../../components/Floors/VAT83B_0.svelte";
    import VAT83B_1 from "../../../components/Floors/VAT83B_1.svelte";
    import VAT83B_2 from "../../../components/Floors/VAT83B_2.svelte";
    import Input from "../../../components/Input.svelte";
    import SidebarAdmin from "../../../components/Sidebar_admin.svelte";


    let modalItemUpdate = null;

    $: if(modalItemUpdate)
     {
        console.log(modalItemUpdate);
    }

    let pagePath = {
        selectedFloor: $page.params.floor,
        selectedBuilding: $page.params.building
    }

    const [buildingFloors] = buildings.filter(building => building.name === pagePath.selectedBuilding);


    let assignedItems = [];
    let assignedItemsFiltered = [];
    let instruments = [];
    let PCs = [];
    let netWorkPorts = [];
    let floorData = null;
    let currentFloorId;

    let errorMessage = '';

    onMount(async () => {
        fetchData();
    });

    let shouldFetchData = true;

    async function fetchData() {
        shouldFetchData = false; // Reset the flag
        await getAllDepartsAndRooms();
        await fetchAssignedItems();
        await fetchInstruments();
        await fetchPCs();
        await fetchNetWorkPorts();
    }

    
    $: {
        // if(assignedItems){                                                      // !!! (12/09/2023 removed filter by floorId)
        //     assignedItemsFiltered = assignedItems.filter(item => {
        //         return item.floor_id === currentFloorId;
        //     });
        // }

        if($page.params.floor && shouldFetchData){
            fetchData();
        }

    }


    const fetchAssignedItems = async () => {
        const url = `${baseURL}/api/assigned-items`;
        const response = await fetch(url);
        assignedItems = await response.json();
    };

    const fetchInstruments = async () => {
        const url = `${baseURL}/api/instruments`;
        const response = await fetch(url);
        instruments = await response.json();
    };

    const fetchPCs = async () => {
        const url = `${baseURL}/api/pcs`;
        const response = await fetch(url);
        PCs = await response.json();
    };

    const fetchNetWorkPorts = async () => {
        const url = `${baseURL}/api/netports`;
        const response = await fetch(url);
        netWorkPorts = await response.json();
    };

    const getAllDepartsAndRooms = async () => {
        // Get all Departments and Rooms by building Name and Floor
        fetch(`${baseURL}/api/floor?buildingName=${pagePath.selectedBuilding}&level=${pagePath.selectedFloor}`)
        .then(response => response.json())
        .then(data => {
            floorData = data;
            currentFloorId = data._id;
            
            console.log("data in floor page", data);
            if(data.error){
                errorMessage = data.error;
            }

        })
        .catch(error => {
            console.error(error);
            
        });
    }


    
let search = '';
let searchData = [];
let suggestions = [];


$: {
  // This reactive statement will be triggered whenever assignedItemsFiltered or search changes !!! (12/09/2023 removed filter by floorId)
  if (currentFloorId && assignedItems.length > 0) {
        if (search && search.length >= 1) {
        searchData = assignedItems.filter(item => {
            const instrumentName = item.name.toLowerCase();
            const searchValue = search.toLowerCase();
            return instrumentName.includes(searchValue); // removed  item.floorId === currentFloorId &&
        });
        
            //suggestions = [...new Set(searchData.map(item => item.name))];
            suggestions = [...new Set(searchData.map(item => ({ name: item.name, type: item.type, floorLevel: item.floorLevel, buildingName: item.buildingName })))];



        } else {      
        searchData = [];
        suggestions = [];
        }
        
        console.log("currentFloorId", currentFloorId);
        console.log("searchData after filter", searchData);
        console.log("uniqueSuggestions", suggestions);
    }
}


let isAdminViewOpen = true;
function openAdminView() {
    isAdminViewOpen = !isAdminViewOpen;
}

</script>
<svelte:head>
	<title>Floor Plan {pagePath.selectedBuilding}/{pagePath.selectedFloor}</title>
</svelte:head>


<div class="plan">
    <div class="header">
        
        <div class="header-floor font-digits text-lg">
            {pagePath.selectedBuilding} / {pagePath.selectedFloor}
            <div>
                
                {#each buildingFloors?.floors as floor}

                    {#if floor.level !== pagePath.selectedFloor}
                        <a href='/{pagePath.selectedBuilding}/{floor.level}' 
                            on:click={() => {pagePath.selectedFloor = floor.level; shouldFetchData = true; isAdminViewOpen = false;}} 
                            class="px-2 mx-1 text-sm bg-gray-200 rounded-md font-semibold w-full hover:bg-gray-400 hover:shadow-xl ">
                            {floor.level}
                        </a>
                    {:else}
                        <a href="/" class="pointer-events-none px-2 mx-1 text-sm bg-green-200 rounded-md font-semibold w-full ">{floor.level}</a>
                    {/if}
                {/each}

            </div>
            
        </div>


        
        <div class="header-compass">
            <img  src="/floorPlan-icons/compass.png" alt="Icon">
        </div>
        

        

        <div class="header-search">
                
            <Input bind:value={search} {suggestions}  placeholder="Search for configuration items..." />

        </div>

        <div class="header-adminBtn">   
            {#if $user?.isAdmin}
                <button class="z-50 relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none bg-green-300 ml-10 mt-1" 
                    class:switch-on={isAdminViewOpen} 
                    on:click={openAdminView} > 
                    <span class="pl-14 font-digits">Admin</span>
                    <span class="pointer-events-none absolute inset-0 h-full w-full bg-gray-300 rounded-full"></span>
                    <span class={`pointer-events-none absolute inset-y-0 ${isAdminViewOpen ? 'left-6' : 'left-0'} flex items-center justify-center h-6 w-6 bg-white rounded-full shadow-md`}>
                        <span class="h-4 w-4 bg-gray-500 rounded-full transform transition-transform ease-in-out duration-300"></span>
                    </span> 
                    <input name="adminView" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                </button> 
            {/if}        
        </div>            
       
        
    </div>

    {#if $user?.isAdmin && isAdminViewOpen && floorData !== null}
        <SidebarAdmin {currentFloorId} {pagePath} bind:floorData = {floorData} {instruments} {PCs} {netWorkPorts} bind:modalItem = {modalItemUpdate}/>
    {/if}

    
    
    {#if pagePath.selectedBuilding === "VAT83A" }
        <div class="plan-VAT83A">
            {#if pagePath.selectedFloor === "0" }
                    <VAT83A_0 {searchData} bind:floorData = {floorData} {instruments} {PCs} {netWorkPorts} {modalItemUpdate}/>
            {:else if pagePath.selectedFloor === "3"}
                    <VAT83A_3/>
            {:else if pagePath.selectedFloor === "4"}
                    <VAT83A_4 {searchData} bind:floorData = {floorData} {instruments} {PCs} {netWorkPorts} {modalItemUpdate}/>
            {:else}
                <div class="no-data font-digits px-4 py-2 ml-80 rounded-md text-xl font-semibold bg-gray-200 w-fit"> {errorMessage} </div>
            {/if} 
        </div>     
        
    {:else if pagePath.selectedBuilding === "VAT83B"}
        <div class="plan-VAT83B">
            {#if pagePath.selectedFloor === "-1" }
                    <VAT83B_m1 {searchData} bind:floorData = {floorData} {instruments} {PCs} {netWorkPorts} {modalItemUpdate}/>
            {:else if pagePath.selectedFloor === "0"}
                    <VAT83B_0 {searchData} bind:floorData = {floorData} {instruments} {PCs} {netWorkPorts} {modalItemUpdate}/>
            {:else if pagePath.selectedFloor === "1"}
                    <VAT83B_1 {searchData} bind:floorData = {floorData} {instruments} {PCs} {netWorkPorts} {modalItemUpdate}/>
            {:else if pagePath.selectedFloor === "2"}
                    <VAT83B_2 {searchData} bind:floorData = {floorData} {instruments} {PCs} {netWorkPorts} {modalItemUpdate}/>   
        
            {:else}
                <div class="no-data font-digits px-4 py-2 ml-80 rounded-md text-xl font-semibold bg-gray-200 w-fit"> {errorMessage} </div>
            {/if}  
        </div>

        
     
    {:else}    
        <div class="no-data font-digits px-6 py-1 mb-2 rounded-md text-xl font-semibold bg-gray-200 w-fit"> {errorMessage} </div> 
    {/if}


</div>

    


<style lang="scss">

    .plan {
        zoom: 1;

        &-VAT83A {
            margin-left: 7%; 
            @media (max-width: 1600px) {
		        zoom: 0.8;
	        }
	        @media (max-width: 1200px) {
				zoom: 0.6;
	        }
            @media (max-height: 1920px) and (max-width: 1080px) { // for vertical screen
				zoom: 1;
	        }
            
        }     

        &-VAT83B {
            margin-left: 20%; 
            @media (max-width: 1600px) {
		        zoom: 0.8;
	        }
	        @media (max-width: 1200px) {
				zoom: 0.6;
	        }
            @media (max-height: 1920px) and (max-width: 1080px) { // for vertical screen
				zoom: 1;
	        }
            
        }

        


    }

    

    
    .header{
        display: grid;
        align-items: center;
        justify-content: center;
        grid-template-columns: 15% 8% 35% 10% 1fr;


        &-floor {
            text-align: center;
            
           
        }

        &-search {
            margin-left: 50px;
            margin-top: 20px;
            display: flex;
			width: 500px;
            height: 80px;
			padding: 10px;
            @media (max-width: 1600px) {
				width: 450px;
	        }
            @media (max-width: 1200px) {
				width: 375px;
	        }
            @media (max-width: 1080px) {
				width: 350px;
	        }
        }

        &-adminBtn {
     
           padding-bottom: 20px;
        }

       
    }



  
    .no-data {
        margin-left: 20%;
        margin-top: 20%
    }


    .switch-on .bg-gray-500 {
        background-color: green;
    }   
  
 
</style>