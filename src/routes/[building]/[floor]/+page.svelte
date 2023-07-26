<script>
    import { page } from "$app/stores";
    import { buildings} from "../../../store/data.js";
    import { afterUpdate, onMount } from 'svelte';
    import { allDesks, allMeetings, allPrinters, baseURL } from "../../../store/store.js";
    import { user } from "../../../security/auth.js";
    import VAT83A_0 from "../../../components/Floors/VAT83A_0.svelte"
    import VAT83A_3 from "../../../components/Floors/VAT83A_3.svelte";
    import VAT83A_4 from "../../../components/Floors/VAT83A_4.svelte";
    import VAT83B_2 from "../../../components/Floors/VAT83B_2.svelte";
    import Input from "../../../components/Input.svelte";
    import domtoimage from 'dom-to-image';
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
    

    // let selectedFloor = $page.params.floor;
    // let selectedBuilding;


    // buildings.forEach((item) => {
    //     if(item.name === $page.params.building) {
    //         selectedBuilding = item;
    //     } 
    // })


    let roomsInstruments = [];
    let roomsInstrumentsFiltered = [];
    let instruments = [];
    let floorData;
    let currentFloorId;

    let errorMessage = '';

    onMount(async () => {
        await getAllDepartsAndRooms();
        await fetchRoomInstruments();
        await fetchInstruments();
    });

    
    $: {
        if(roomsInstruments){
            roomsInstrumentsFiltered = roomsInstruments.filter(item => {
                return item.floorId === currentFloorId;
            });
        }
    }


    const fetchRoomInstruments = async () => {
        const url = `${baseURL}/api/room-instruments`;
        const response = await fetch(url);
        roomsInstruments = await response.json();
    };

    const fetchInstruments = async () => {
        const url = `${baseURL}/api/instruments`;
        const response = await fetch(url);
        instruments = await response.json();
    };

    // Added after - testing
    const getAllDepartsAndRooms = async () => {
        // Get all Departments and Rooms by building Name and Floor
        fetch(`${baseURL}/api/floor?buildingName=${pagePath.selectedBuilding}&level=${pagePath.selectedFloor}`)
        .then(response => response.json())
        .then(data => {
            floorData = data;
            currentFloorId = data._id;
            // rooms = data.rooms;
            // departments = data.departments;
            //currentFloorId.set(data._id) // save floorID
            // console.log("rooms",rooms);
            // console.log("departments",departments);

            // hoveredRooms = rooms?.reduce((acc, room) => {
            //     acc[room.name] = { hovered: false };
            //     return acc;
            // }, {});

            // console.log(hoveredRooms);
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
  // This reactive statement will be triggered whenever roomsInstrumentsFiltered or search changes
  if (currentFloorId && roomsInstrumentsFiltered.length > 0) {
    if (search && search.length >= 1) {
      searchData = roomsInstrumentsFiltered.filter(item => {
        const instrumentName = item.name.toLowerCase();
        const searchValue = search.toLowerCase();
        return instrumentName.includes(searchValue); // removed  item.floorId === currentFloorId &&
      });
      
        suggestions = [...new Set(searchData.map(item => item.name))];



    } else {      
      searchData = [];
      suggestions = [];
    }
    
    console.log("currentFloorId", currentFloorId);
    console.log("searchData after filter", searchData);
    console.log("uniqueSuggestions", suggestions);
  }
}


// let downloadPlan;
// function printAsImage() {
//     if (downloadPlan) {
// 		downloadPlan.style.backgroundColor = 'white';

// 		const options = {
// 			width: window.innerWidth/1.5,
//             height: window.innerWidth-400
//       	};

//       	domtoimage.toPng(downloadPlan, options)
//         .then(function (dataUrl) {
//           const link = document.createElement('a');
//           link.href = dataUrl;
//           link.download = `${selectedBuilding.name}_${selectedFloor}.png`; // Specify the filename for the downloaded image
//           link.click();
//         })
//         .catch(function (error) {
//           console.error('Error generating image:', error);
//         });
		
//     }
// }

let isAdminViewOpen = false;
function openAdminView() {
    isAdminViewOpen = !isAdminViewOpen;
}

</script>
<svelte:head>
	<title>Floor Plan {pagePath.selectedBuilding}/{pagePath.selectedFloor}</title>
</svelte:head>

<!-- <SidebarFloors building = {selectedBuilding} selectedFloor={selectedFloor} meetings={data2} printers={data3} desks={data1} /> -->

<!-- <button class="fixed left-10 bottom-0 mb-2 ml-10" on:click={printAsImage}>
    <img class="w-8 h-8" src="/icon_screenshot.png" alt="Icon">
</button> -->

<div class="plan">
    <div class="header">
        
        <div class="header-floor font-digits text-lg">
            {pagePath.selectedBuilding} / {pagePath.selectedFloor}
        </div>


        <!-- <div class="header-back group">
            <a href="/">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                    <path fill="currentColor" d="M21.41,11H7.83l4.88-4.88A1,1,0,0,0,10.29,4.29L2.29,12.29a1,1,0,0,0,0,1.42L10.29,19.71a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L7.83,13h13.58a1,1,0,0,0,0-2Z"/>
                </svg>
                <span class="hidden text-sm font-digits group-hover:inline absolute">Back</span>
            </a>
        </div> -->


        <div class="header-compass">
            <img  src="/floorPlan-icons/compass.png" alt="Icon">
        </div>
        

        

        <div class="header-search">
                
            <Input bind:value={search} {suggestions}  placeholder="Search instruments..." />
            
            {#if $user?.isAdmin}
                <button class="relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none bg-green-300 ml-10 mt-1" 
                    class:switch-on={isAdminViewOpen} 
                    on:click={openAdminView} > 
                    <span class="pl-14 font-digits">Admin menu</span>
                    <span class="pointer-events-none absolute inset-0 h-full w-full bg-gray-300 rounded-full"></span>
                    <span class={`pointer-events-none absolute inset-y-0 ${isAdminViewOpen ? 'left-6' : 'left-0'} flex items-center justify-center h-6 w-6 bg-white rounded-full shadow-md`}>
                        <span class="h-4 w-4 bg-gray-500 rounded-full transform transition-transform ease-in-out duration-300"></span>
                    </span> 
                    <input name="adminView" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                </button> 
            {/if}        
                    
        </div>
        
    </div>

    {#if isAdminViewOpen}
        <SidebarAdmin {currentFloorId} {pagePath} bind:floorData = {floorData} {instruments} bind:modalItem = {modalItemUpdate}/>
    {/if}

    
    
    {#if pagePath.selectedBuilding === "VAT83A" }
        <div class="plan-VAT83A">
            {#if pagePath.selectedFloor === "0" }
                    <VAT83A_0 {searchData} bind:floorData = {floorData} {instruments} {modalItemUpdate}/>
            {:else if pagePath.selectedFloor === "3"}
                    <VAT83A_3/>
            {:else if pagePath.selectedFloor === "4"}
                    <VAT83A_4/>
            {:else}
                <div class="no-data font-digits px-4 py-2 ml-80 rounded-md text-xl font-semibold bg-gray-200 w-fit"> {errorMessage} </div>
            {/if} 
        </div>     
        
    {:else if pagePath.selectedBuilding === "VAT83B"}
        <div class="plan-VAT83B">
            {#if pagePath.selectedFloor === "-1" }
                    <VAT83B_2/>
            {:else if pagePath.selectedFloor === "0"}
                    <VAT83B_2/>
            {:else if pagePath.selectedFloor === "1"}
                    <VAT83B_2/>
            {:else if pagePath.selectedFloor === "2"}
                    <VAT83B_2 {searchData} bind:floorData = {floorData} {instruments} {modalItemUpdate}/>   
        
            {:else}
                <div class="no-data font-digits px-4 py-2 ml-80 rounded-md text-xl font-semibold bg-gray-200 w-fit"> {errorMessage} </div>
            {/if}  
        </div>

        
     
    {:else}    
        <div class="no-data font-digits px-6 py-1 mb-2 rounded-md text-xl font-semibold bg-gray-200 w-fit"> {errorMessage} </div> 
    {/if}


    <!-- TESTINT modalitemUPDATE
    <div class="plan-VAT83B">
    {#if modalItemUpdate != undefined}
    {#each modalItemUpdate.position as r, index}
				<div 
					class={`flex items-center justify-center text-xs`}
					style={`background-color: teal; position: absolute; left: ${r.left}px; top: ${r.top}px; width: ${r.width}px; height: ${r.height}px;`}> 
					{#if index == 0}
                        <div class="z-10 mb-4 cursor-pointer font-defaultText">{modalItemUpdate.name} </div>
					{/if}
				</div>
	{/each}
    {/if} 
    </div> -->
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
        align-items: center;
        justify-content: center;
        grid-template-columns: 15% 8% 1fr;


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
            // border: 2px solid black;
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