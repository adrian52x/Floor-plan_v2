<script>

import { page } from "$app/stores";
import { buildingsGrid } from "../../store/data";
import SidebarRight from "../Sidebar_right.svelte";
import { baseURL } from "../../store/store.js"
import Spinner from "../Spinner.svelte";
import { onMount } from "svelte";



// Data needed in each Floor plan
export let searchData;
export let floorData;
export let instruments;
export let PCs;
export let netWorkPorts;
export let modalItemUpdate;

onMount(() => {
    modalItemUpdate = null;
});

// Data needed in each Floor plan (e.g VAT83A/B...)
let rooms = [];
let departments = [];
let hoveredRooms = [];

let roomData = null;
let dataReceived = false;
let errorMessage;
//


let demoModeOn = {
	checked: false
}
// floor plan grid on demo mode on
let [buildingGrid] = buildingsGrid.filter(item => item.building === $page.params.building);

// Whenever floorData is available
$ : {
	if (floorData ){
		rooms = floorData.rooms;
		departments = floorData.departments;

		hoveredRooms = rooms?.reduce((acc, room) => {
			acc[room.name] = { hovered: false };
			return acc;
		}, {});

		 

	}

	if(modalItemUpdate?.action){
		demoModeOn.checked = true
	}

  if(searchData[0]?.isSearchItemClicked && searchData[0]?.buildingName == $page.params.building && searchData[0]?.floorLevel == $page.params.floor){
    openRightSideBar(searchData[0].roomName);
  }

}

departments = departments.map(depart => {
    return { name: depart, checked: false };
});


function hoverRoom(room) {
	hoveredRooms[room].hovered = !hoveredRooms[room]?.hovered
}

function toggleDepartment(event, department) {
    department.checked = event.target.checked;	
}



function toggleDemoMode(demoModeOn) {
    demoModeOn.checked = false;	
	modalItemUpdate = null;
}


let isRightSideBarActive = false;


function closeRightSideBar() {
    isRightSideBarActive = false;
}

function openRightSideBar(roomName){
	isRightSideBarActive = true;
	fetch1RoomItems(roomName);
}

const fetch1RoomItems = async (roomName) => {
	try {
		const response = await fetch(`${baseURL}/api/1room-items?roomName=${roomName}`);

		if (response.status === 200) {
			dataReceived = true;
			roomData = await response.json();
		} else {
			dataReceived = false;
		}
	} catch (error) {
		console.log(error.message);
		errorMessage = error.message + " data";
	}
};



let lines = Array.from({ length: 155 }, (_, i) => i + 1);    
let stairs = Array.from({ length: 7 }, (_, i) => i + 1);    
let elevators = Array.from({ length: 3 }, (_, i) => i + 1);


</script>


<div class="floor-plan">

  	<!-- Loading Spinner -->
	{#if rooms?.length == 0}
		<div class="absolute right-0 h-8 mr-16">
			<Spinner isLoading = {rooms?.length == 0} />
			<div class="font-digits">Loading</div>
		</div>
	{/if}
	

	<!-- Departments -->
    {#each departments as department} 
        {#each department.position as d}
            {#if department.checked === true}
                <div class={`z-10 `} style={`background-color: ${department.color}; position: absolute; left: ${d.left}px; top: ${d.top}px; width: ${d.width}px; height: ${d.height}px;`}></div>
            {/if}
        {/each}    
	{/each}

  	<!-- Departments checkbox List (from left side)-->
	<div class="departments text-sm font-defaultText">
		{#if departments != undefined}
			{#each departments as department}
					<label>
						<input type="checkbox" name={department.name} bind:checked={department.checked} on:change={(e) => toggleDepartment(e, department)} />
						{department.name}
							<hr class={`h-1 mt-1 w-8`} style={`background-color: ${department.color};`}>
					</label>
			{/each}
		{/if}
	</div>

    <!-- Open SidebarRight on room click-->
    {#if isRightSideBarActive }
      <SidebarRight roomData = {roomData} {instruments} {PCs} {netWorkPorts} onClose={closeRightSideBar} isLoading={!dataReceived} errorMessage={errorMessage} {searchData}/>
    {/if}


    {#each lines as wall}
        <div class="z-10" id="line{wall}"/>
    {/each}

    {#each stairs as stair}
        <div id="stairsIcon{stair}"/>
    {/each}


    {#each elevators as elevator}
        <div id="elevator{elevator}"/>
    {/each}


    <!-- Rooms -->
    {#if rooms != undefined}
        {#each rooms as room}
            {#each room.position as r, index}
                <div 
                    on:click={() => openRightSideBar(room.name)} on:keydown 
                    on:mouseover={hoverRoom(room.name)} on:mouseout={hoverRoom(room.name)} on:blur on:focus
                    class={`
                        flex items-center justify-center text-xs
                        ${room.type === 'Meeting room' ? 'bg-blue-300' : ''}
                        ${hoveredRooms[room.name]?.hovered ? 'hoveredRoom' : 'bg-blue-100'}
                        ${searchData?.find(data => data.roomName === room.name) ? 'bg-green-200' : ''}
                    `}
                    style={`position: absolute; left: ${r.left}px; top: ${r.top}px; width: ${r.width}px; height: ${r.height}px;`}
                    > 
                    {#if index == 0}
                        <div class="flex flex-col">
                            <div class="z-10 cursor-pointer font-defaultText">{room.name} </div>
                                <div class="mx-auto">
                                    {#if room.type === "Meeting room"}
                                        <iconify-icon class="text-xl" icon="guidance:meeting-room" ></iconify-icon>
                                    {:else if room.type === "Printer room"}
                                        <iconify-icon class="text-lg" icon="uiw:printer" ></iconify-icon>
                                    {/if}
                                </div>
                            <div class="z-10 text-xs cursor-pointer font-digits">{room.roomNr ? room.roomNr : ''} </div>
                        </div>  
                    {/if}
                
                </div>
            {/each}
        {/each}
    {/if} 	
    

	<!--  Enable Demo Mode (for rooms & departments) -->
	{#if demoModeOn.checked === true && (modalItemUpdate?.activeTab === 'Rooms' || modalItemUpdate?.activeTab === 'Departments')}
		<div class="fixed left-10 bottom-0 mb-10 ml-20">
			<input  type="checkbox" bind:checked={demoModeOn.checked} on:change={() => toggleDemoMode(demoModeOn)} />
			<span class="font-digits">Turn Off - Preview Mode</span> <iconify-icon class="px-2 pt-3 text-xl " icon="eos-icons:rotating-gear" ></iconify-icon>
		</div>

    <!-- Grid view -->
		{#each buildingGrid.floorGridHorizontal as gridLine }
			<div style={`position: absolute; background: #f3e8e0; left: -75px; top: ${gridLine.top}px; width: 850px; height: 1px;`} class="text-left text-xs"> {gridLine.top} </div>
		{/each}
		{#each buildingGrid.floorGridVertical as gridLine }
			<div style={`position: absolute; background: #f3e8e0; left: ${gridLine.left}px; top: -75px; width: 1px; height: 1350px;`} class="text-xs"> {gridLine.left} </div>
		{/each}
		
		<style>
			body {
				background-color: Gainsboro;
			}
		</style>	
  	{/if}

    <!--  In Demo Mode show the object that is being modified  except Instruments-->
    {#if modalItemUpdate != undefined && (modalItemUpdate?.activeTab === 'Rooms' || modalItemUpdate?.activeTab === 'Departments')}
      {#each modalItemUpdate?.position as r }
            <div 
              class={`flex items-center justify-center text-xs`}
              style={`background-color: ${modalItemUpdate.activeTab === "Rooms" ? "CadetBlue" : modalItemUpdate.color}; position: absolute; left: ${r.left}px; top: ${r.top}px; width: ${r.width}px; height: ${r.height}px;`}> 
            
            </div>
      {/each}
    {/if} 
   
     
          
</div>  


<style>

.floor-plan {
    position: relative;
    top: 50px;
    text-align: center;
    width: 1150px;
    height: 1250px;
      /* border: 1px solid black; */
}

.departments {
	position: relative;
	display: flex;
    flex-direction: column;
    gap: 15px;
    right: 15%;
    width: 200px;
    text-align: left;
}


.hoveredRoom {
 background: rgba(87, 87, 87, 0.19);
}




#stairsIcon1 {
  position: absolute;
  left: 351.45px;
  top: 142.4px;
  width: 23.05px;
  height: 23.05px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00001deg);
}

#stairsIcon2 {
  position: absolute;
  left: 371.45px;
  top: 182.4px;
  width: 23.05px;
  height: 23.05px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1) rotate(0.00013056048deg); 
}

#stairsIcon3 {
  position: absolute;
  left: 356.5px;
  top: 1018.05px;
  width: 23.05px;
  height: 23.05px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00001deg);
}

#stairsIcon4 {
  position: absolute;
  left: 376.95px;
  top: 1057.4px;
  width: 23.05px;
  height: 23.05px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1) rotate(0.00013056048deg);
}

#stairsIcon5 {
  position: absolute;
  left: 366px;
  top: 589.5px;
  width: 20px;
  height: 20px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon6 {
  position: absolute;
  left: 308px;
  top: 626px;
  width: 20px;
  height: 20px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon7 {
  position: absolute;
  left: 308.1px;
  top: 556.7px;
  width: 20px;
  height: 20px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(0.00013780547deg);
}

#line102 {
  position: absolute;
  left: 136.5px;
  top: 268px;
  width: 63.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
}

#line39 {
  position: absolute;
  left: 418px;
  top: 1083.5px;
  width: 83px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line31 {
  position: absolute;
  left: 307px;
  top: 1083.5px;
  width: 100px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#elevator1 {
  position: absolute;
  left: 310.5px;
  top: 1002px;
  width: 44px;
  height: 44px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(-3.1877273E-06deg);
}

#elevator2 {
  position: absolute;
  left: 305.7px;
  top: 155px;
  width: 45px;
  height: 45px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(5.960163E-08deg);
}

#elevator3 {
  position: absolute;
  left: 307px;
  top: 570px;
  width: 60px;
  height: 60px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00027deg);
}

#line2 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 2px;
  height: 1200px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line3 {
  position: absolute;
  left: 0px;
  top: 1199px;
  width: 650.2px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
}

#line116 {
  position: absolute;
  left: 317.7px;
  top: 464.5px;
  width: 82.3px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line115 {
  position: absolute;
  left: 296.7px;
  top: 447.5px;
  width: 22px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line113 {
  position: absolute;
  left: 229.2px;
  top: 447.5px;
  width: 53.3px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line111 {
  position: absolute;
  left: 229.2px;
  top: 499px;
  width: 99.2px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line7 {
  position: absolute;
  left: 228px;
  top: 553.5px;
  width: 173px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line14 {
  position: absolute;
  left: 387.5px;
  top: 554.5px;
  width: 2px;
  height: 94px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line13 {
  position: absolute;
  left: 299px;
  top: 554.5px;
  width: 2px;
  height: 94.3px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line44 {
  position: absolute;
  left: 371.5px;
  top: 978.5px;
  width: 90px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line27 {
  position: absolute;
  left: 228.5px;
  top: 978.5px;
  width: 35px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line152 {
  position: absolute;
  left: 285px;
  top: 978.5px;
  width: 73px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line35 {
  position: absolute;
  left: 355.5px;
  top: 1000px;
  width: 2px;
  height: 84.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line42 {
  position: absolute;
  left: 399px;
  top: 1117.5px;
  width: 2px;
  height: 82.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line34 {
  position: absolute;
  left: 399px;
  top: 1000px;
  width: 2px;
  height: 100px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line32 {
  position: absolute;
  left: 306.5px;
  top: 995.5px;
  width: 2px;
  height: 89px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line30 {
  position: absolute;
  left: 499px;
  top: 1000px;
  width: 2px;
  height: 84.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line33 {
  position: absolute;
  left: 307.5px;
  top: 1051.5px;
  width: 49px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line46 {
  position: absolute;
  left: 500px;
  top: 1050.5px;
  width: 60px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line154 {
  position: absolute;
  left: 575px;
  top: 1050.5px;
  width: 26px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line41 {
  position: absolute;
  left: 424.5px;
  top: 1039.5px;
  width: 75.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line40 {
  position: absolute;
  left: 454.5px;
  top: 1040.5px;
  width: 2px;
  height: 44px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line38 {
  position: absolute;
  left: 423.5px;
  top: 995.5px;
  width: 2px;
  height: 89px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line45 {
  position: absolute;
  left: 423.5px;
  top: 979.5px;
  width: 2px;
  height: 5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line153 {
  position: absolute;
  left: 444px;
  top: 900px;
  width: 2px;
  height: 80px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line51 {
  position: absolute;
  left: 199px;
  top: 1032.5px;
  width: 2px;
  height: 118px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
}

#line50 {
  position: absolute;
  left: 138.5px;
  top: 999px;
  width: 72px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line60 {
  position: absolute;
  left: 138.5px;
  top: 1032.5px;
  width: 2px;
  height: 50px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line58 {
  position: absolute;
  left: 148.5px;
  top: 1081.5px;
  width: 2px;
  height: 18.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line56 {
  position: absolute;
  left: 148.5px;
  top: 1114.5px;
  width: 2px;
  height: 44.3px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}


#line104 {
  position: absolute;
  left: 50.5px;
  top: 747.3px;
  width: 2px;
  height: 32px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line73 {
  position: absolute;
  left: 138.5px;
  top: 747.4px;
  width: 2px;
  height: 140px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line70 {
  position: absolute;
  left: 199px;
  top: 788.5px;
  width: 2px;
  height: 88px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line62 {
  position: absolute;
  left: 199px;
  top: 890px;
  width: 2px;
  height: 35px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line67 {
  position: absolute;
  left: 199px;
  top: 935px;
  width: 2px;
  height: 45px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line72 {
  position: absolute;
  left: 138px;
  top: 859px;
  width: 61px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line126 {
  position: absolute;
  left: 307.5px;
  top: 120.5px;
  width: 223px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line148 {
  position: absolute;
  left: 104.5px;
  top: 116.5px;
  width: 2px;
  height: 83.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line147 {
  position: absolute;
  left: 105px;
  top: 174px;
  width: 95px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line103 {
  position: absolute;
  left: 0px;
  top: 198px;
  width: 283px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line146 {
  position: absolute;
  left: 104px;
  top: 116px;
  width: 15px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line64 {
  position: absolute;
  left: 130px;
  top: 116px;
  width: 71px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line63 {
  position: absolute;
  left: 0px;
  top: 116px;
  width: 103px;
  height: 2px;
  border-top: 1.5px dashed #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line94 {
  position: absolute;
  left: 0px;
  top: 299px;
  width: 123px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line108 {
  position: absolute;
  left: 144.5px;
  top: 340px;
  width: 55.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line109 {
  position: absolute;
  left: 144.5px;
  top: 340.6px;
  width: 2px;
  height: 59.4px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line107 {
  position: absolute;
  left: 144.5px;
  top: 383px;
  width: 55.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line110 {
  position: absolute;
  left: 134.5px;
  top: 399px;
  width: 12px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line85 {
  position: absolute;
  left: 93.5px;
  top: 399px;
  width: 27px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line86 {
  position: absolute;
  left: 112px;
  top: 400px;
  width: 2px;
  height: 154.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line106 {
  position: absolute;
  left: 0px;
  top: 399px;
  width: 81.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line105 {
  position: absolute;
  left: 0px;
  top: 553.5px;
  width: 81.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line84 {
  position: absolute;
  left: 94.5px;
  top: 553.5px;
  width: 34px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line87 {
  position: absolute;
  left: 199px;
  top: 290.5px;
  width: 2px;
  height: 186.7px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line75 {
  position: absolute;
  left: 199px;
  top: 491.5px;
  width: 2px;
  height: 164px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line74 {
  position: absolute;
  left: 199px;
  top: 675.5px;
  width: 2px;
  height: 96.2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line71 {
  position: absolute;
  left: 139.5px;
  top: 820.5px;
  width: 60.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line69 {
  position: absolute;
  left: 138px;
  top: 899px;
  width: 61px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line80 {
  position: absolute;
  left: 121px;
  top: 805.5px;
  width: 18.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line79 {
  position: absolute;
  left: 91px;
  top: 805.5px;
  width: 18.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line78 {
  position: absolute;
  left: 89.5px;
  top: 789.5px;
  width: 2px;
  height: 18px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line93 {
  position: absolute;
  left: 145.7px;
  top: 571px;
  width: 54.3px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line92 {
  position: absolute;
  left: 144.7px;
  top: 537.5px;
  width: 55px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line91 {
  position: absolute;
  left: 145px;
  top: 538.5px;
  width: 2px;
  height: 67px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line83 {
  position: absolute;
  left: 158.5px;
  top: 678.5px;
  width: 41.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line82 {
  position: absolute;
  left: 121px;
  top: 747px;
  width: 79px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line81 {
  position: absolute;
  left: 0px;
  top: 747px;
  width: 109px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line77 {
  position: absolute;
  left: 0px;
  top: 789px;
  width: 90.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line76 {
  position: absolute;
  left: 0px;
  top: 849.3px;
  width: 139.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line68 {
  position: absolute;
  left: 0px;
  top: 899px;
  width: 112px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line66 {
  position: absolute;
  left: 0.5px;
  top: 948.5px;
  width: 112px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line150 {
  position: absolute;
  left: 138px;
  top: 948.5px;
  width: 61px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line151 {
  position: absolute;
  left: 140px;
  top: 950px;
  width: 2px;
  height: 50px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);

}

#line65 {
  position: absolute;
  left: 0px;
  top: 1094.5px;
  width: 112px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line57 {
  position: absolute;
  left: 148.5px;
  top: 1171.5px;
  width: 2px;
  height: 28.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line55 {
  position: absolute;
  left: 245.5px;
  top: 1171.5px;
  width: 2px;
  height: 28.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line53 {
  position: absolute;
  left: 245.5px;
  top: 1075.7px;
  width: 2px;
  height: 50px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line155 {
  position: absolute;
  left: 245.5px;
  top: 1141px;
  width: 2px;
  height: 18px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line49 {
  position: absolute;
  left: 265px;
  top: 1045px;
  width: 43px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
}

#line48 {
  position: absolute;
  left: 265px;
  top: 1000px;
  width: 2px;
  height: 46px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line43 {
  position: absolute;
  left: 306.5px;
  top: 979.5px;
  width: 2px;
  height: 5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line37 {
  position: absolute;
  left: 399px;
  top: 999px;
  width: 7px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line61 {
  position: absolute;
  left: 139.5px;
  top: 1039.8px;
  width: 60.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line59 {
  position: absolute;
  left: 139.5px;
  top: 1080.5px;
  width: 60.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line54 {
  position: absolute;
  left: 149.5px;
  top: 1149.5px;
  width: 97px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line52 {
  position: absolute;
  left: 200px;
  top: 1075.2px;
  width: 47.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line47 {
  position: absolute;
  left: 228px;
  top: 999px;
  width: 63.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line36 {
  position: absolute;
  left: 303px;
  top: 999px;
  width: 54.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
}

#line29 {
  position: absolute;
  left: 418px;
  top: 999px;
  width: 83px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line28 {
  position: absolute;
  left: 243.5px;
  top: 900px;
  width: 2px;
  height: 79.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line26 {
  position: absolute;
  left: 229.5px;
  top: 899px;
  width: 70.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line25 {
  position: absolute;
  left: 228.5px;
  top: 800px;
  width: 2px;
  height: 179.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line24 {
  position: absolute;
  left: 228.5px;
  top: 648.9px;
  width: 2px;
  height: 125.3px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line12 {
  position: absolute;
  left: 228.5px;
  top: 648.5px;
  width: 161px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line11 {
  position: absolute;
  left: 254.8px;
  top: 609.5px;
  width: 2px;
  height: 39px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line88 {
  position: absolute;
  left: 228.2px;
  top: 524.5px;
  width: 2px;
  height: 30px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line10 {
  position: absolute;
  left: 254.8px;
  top: 556.5px;
  width: 2px;
  height: 33px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line15 {
  position: absolute;
  left: 299px;
  top: 648.5px;
  width: 2px;
  height: 251.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line90 {
  position: absolute;
  left: 229px;
  top: 292.8px;
  width: 2px;
  height: 97.7px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line89 {
  position: absolute;
  left: 228.2px;
  top: 403.5px;
  width: 2px;
  height: 73.7px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line97 {
  position: absolute;
  left: 135.5px;
  top: 285px;
  width: 2px;
  height: 11.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line98 {
  position: absolute;
  left: 136.5px;
  top: 294.8px;
  width: 63.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line96 {
  position: absolute;
  left: 122.2px;
  top: 284.5px;
  width: 15.3px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line101 {
  position: absolute;
  left: 135px;
  top: 200px;
  width: 2px;
  height: 72.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line143 {
  position: absolute;
  left: 552.5px;
  top: 139.5px;
  width: 47.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line142 {
  position: absolute;
  left: 552px;
  top: 76px;
  width: 47.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line140 {
  position: absolute;
  left: 481px;
  top: 57px;
  width: 49.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line141 {
  position: absolute;
  left: 551px;
  top: 58px;
  width: 2px;
  height: 83.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line139 {
  position: absolute;
  left: 528.5px;
  top: 58.04px;
  width: 2px;
  height: 63.48px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line144 {
  position: absolute;
  left: 481px;
  top: 0px;
  width: 2px;
  height: 35.8px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line138 {
  position: absolute;
  left: 481px;
  top: 58.06px;
  width: 2px;
  height: 63.44px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line137 {
  position: absolute;
  left: 346px;
  top: 0px;
  width: 2px;
  height: 71.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line127 {
  position: absolute;
  left: 346px;
  top: 89.13px;
  width: 2px;
  height: 109.87px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line125 {
  position: absolute;
  left: 399px;
  top: 122.5px;
  width: 2px;
  height: 77.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line145 {
  position: absolute;
  left: 149px;
  top: 0px;
  width: 2px;
  height: 65px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
}

#line132 {
  position: absolute;
  left: 199px;
  top: 96px;
  width: 2px;
  height: 103px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line129 {
  position: absolute;
  left: 260.98px;
  top: 110.5px;
  width: 2px;
  height: 89.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line124 {
  position: absolute;
  left: 306.5px;
  top: 121.5px;
  width: 2px;
  height: 82px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line123 {
  position: absolute;
  left: 273.5px;
  top: 231.5px;
  width: 2px;
  height: 68.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line122 {
  position: absolute;
  left: 229px;
  top: 231.5px;
  width: 2px;
  height: 48px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line100 {
  position: absolute;
  left: 199px;
  top: 227.5px;
  width: 2px;
  height: 52px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line118 {
  position: absolute;
  left: 299px;
  top: 231.5px;
  width: 2px;
  height: 35.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line136 {
  position: absolute;
  left: 499px;
  top: 121.5px;
  width: 2px;
  height: 78.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line120 {
  position: absolute;
  left: 428.5px;
  top: 199px;
  width: 2px;
  height: 32.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line117 {
  position: absolute;
  left: 299px;
  top: 281.5px;
  width: 2px;
  height: 18.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line131 {
  position: absolute;
  left: 296.5px;
  top: 120.5px;
  width: 11px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line133 {
  position: absolute;
  left: 200px;
  top: 96.07px;
  width: 60.97px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line134 {
  position: absolute;
  left: 259.99px;
  top: 96.15px;
  width: 2px;
  height: 4.91px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line130 {
  position: absolute;
  left: 261.4px;
  top: 120.5px;
  width: 13px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line99 {
  position: absolute;
  left: 199px;
  top: 200px;
  width: 2px;
  height: 16.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line95 {
  position: absolute;
  left: 121.2px;
  top: 284.5px;
  width: 2px;
  height: 15.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line114 {
  position: absolute;
  left: 316.7px;
  top: 448.5px;
  width: 2px;
  height: 51.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line112 {
  position: absolute;
  left: 326.5px;
  top: 500px;
  width: 2px;
  height: 53.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line8 {
  position: absolute;
  left: 228.2px;
  top: 491.5px;
  width: 2px;
  height: 23px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line6 {
  position: absolute;
  left: 399px;
  top: 300px;
  width: 2px;
  height: 254.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line135 {
  position: absolute;
  left: 400px;
  top: 198px;
  width: 100.05px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line119 {
  position: absolute;
  left: 295.5px;
  top: 230.5px;
  width: 134px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line128 {
  position: absolute;
  left: 307.5px;
  top: 149.5px;
  width: 39.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line121 {
  position: absolute;
  left: 229.2px;
  top: 230.5px;
  width: 49.3px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line9 {
  position: absolute;
  left: 229px;
  top: 299px;
  width: 77.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line5 {
  position: absolute;
  left: 324.5px;
  top: 299px;
  width: 275.5px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line18 {
  position: absolute;
  left: 445.5px;
  top: 454.5px;
  width: 2px;
  height: 296px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line23 {
  position: absolute;
  left: 599px;
  top: 900px;
  width: 2px;
  height: 299.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}


#line21 {
  position: absolute;
  left: 300px;
  top: 899px;
  width: 300px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line20 {
  position: absolute;
  left: 649.2px;
  top: 750.5px;
  width: 2px;
  height: 449.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line19 {
  position: absolute;
  left: 446.5px;
  top: 749.5px;
  width: 203.7px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line17 {
  position: absolute;
  left: 446.5px;
  top: 453.5px;
  width: 203.7px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line16 {
  position: absolute;
  left: 650px;
  top: 0px;
  width: 2px;
  height: 454.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line4 {
  position: absolute;
  left: 599px;
  top: 0px;
  width: 2px;
  height: 300px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}

#line149 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 652px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
  
  

}




</style>