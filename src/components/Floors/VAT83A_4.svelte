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

		console.log(response.status);

		if (response.status === 200) {
			dataReceived = true;
			console.log("Found", dataReceived);
			roomData = await response.json();
		} else {
			dataReceived = false;
			console.log("NOT FOUND", dataReceived);
		}
	} catch (error) {
		console.log(error.message);
		errorMessage = error.message + " data";
	}
};


// before update last line 127    
let lines = Array.from({ length: 133 }, (_, i) => i + 1);    
let stairs = Array.from({ length: 8 }, (_, i) => i + 1);    
let elevators = Array.from({ length: 4 }, (_, i) => i + 1);
let meetingIcons = Array.from({ length: 16 }, (_, i) => i + 1);
let printerRooms = Array.from({ length: 4 }, (_, i) => i + 1);
//let desks = Array.from({ length: 197 }, (_, i) => i + 1);

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
		<SidebarRight roomData = {roomData} {instruments} {PCs} {netWorkPorts} onClose={closeRightSideBar} isLoading={!dataReceived} errorMessage={errorMessage}/>
	{/if}


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
			<div style={`position: absolute; background: #f3e8e0; left: -75px; top: ${gridLine.top}px; width: 1300px; height: 1px;`} class="text-left text-xs"> {gridLine.top} </div>
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

	
    {#each lines as wall}
        <div class="z-10" id="line{wall}"/>
    {/each}

    {#each stairs as stair}
        <div id="stairsIcon{stair}"/>
    {/each}

    {#each elevators as elevator}
        <div id="elevator{elevator}"/>
    {/each}

</div>




<style>
.floor-plan {
    position: relative;
    top: 50px;
    text-align: center;
    width: 1500px;
    height: 1250px;
      /* border: 1px solid black; */
}

.departments {
	position: relative;
	display: flex;
    flex-direction: column;
    gap: 15px;
    width: 200px;
    text-align: left;
}

.hoveredRoom {
  background: rgba(87, 87, 87, 0.19);
}


#line124 {
  position: absolute;
  left: 550px;
  top: 1061px;
  width: 2px;
  height: 38px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#meetingRoom49 {
  position: absolute;
  left: 189.3px;
  top: 600.3px;
  width: 37px;
  height: 65.2px;
  background-blend-mode: normal;
}

#meetingRoom47 {
  position: absolute;
  left: 150.8px;
  top: 666.1px;
  width: 75px;
  height: 134.2px;
  background-blend-mode: normal;
}

#printerRoom2 {
  position: absolute;
  left: 364.5px;
  top: 112px;
  width: 35px;
  height: 37.2px;
  background-blend-mode: normal;
}

#meetingRoom38 {
  position: absolute;
  left: 189.3px;
  top: 600.3px;
  width: 37px;
  height: 65.2px;
  background-blend-mode: normal;
}

#printerRoom4 {
  position: absolute;
  left: 150.8px;
  top: 1063px;
  width: 114.5px;
  height: 36.2px;
  background-blend-mode: normal;
}

#meetingRoom48 {
  position: absolute;
  left: 151px;
  top: 600px;
  width: 37.5px;
  height: 65.2px;
  background-blend-mode: normal;
}

#printerRoom1 {
  position: absolute;
  left: 262px;
  top: 454.5px;
  width: 37.5px;
  height: 45.2px;
  background-blend-mode: normal;
}

#printerRoom3 {
  position: absolute;
  left: 800.5px;
  top: 700px;
  width: 39.5px;
  height: 44.2px;
  background-blend-mode: normal;
}

#meetingIcon16 {
  position: absolute;
  left: 193.8px;
  top: 632.8px;
  width: 26px;
  height: 26px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon15 {
  position: absolute;
  left: 87px;
  top: 1168.8px;
  width: 26px;
  height: 26px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon14 {
  position: absolute;
  left: 506px;
  top: 1077px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon13 {
  position: absolute;
  left: 556px;
  top: 1077px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon12 {
  position: absolute;
  left: 912px;
  top: 475px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon11 {
  position: absolute;
  left: 959.5px;
  top: 475px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon10 {
  position: absolute;
  left: 965.3px;
  top: 430.7px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon9 {
  position: absolute;
  left: 919.2px;
  top: 427.6px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon8 {
  position: absolute;
  left: 157px;
  top: 632.8px;
  width: 26px;
  height: 26px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon7 {
  position: absolute;
  left: 171.8px;
  top: 728.5px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon6 {
  position: absolute;
  left: 536.1px;
  top: 1027.8px;
  width: 30px;
  height: 30px;
  background: url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon5 {
  position: absolute;
  left: 450.2px;
  top: 1049.5px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon4 {
  position: absolute;
  left: 316.5px;
  top: 1055px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon3 {
  position: absolute;
  left: 1031.4px;
  top: 736px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon2 {
  position: absolute;
  left: 933.1px;
  top: 633.6px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon1 {
  position: absolute;
  left: 933.1px;
  top: 564.6px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#printIcon3 {
  position: absolute;
  left: 273px;
  top: 478.3px;
  width: 15px;
  height: 15px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}

#printIcon2 {
  position: absolute;
  left: 812px;
  top: 727px;
  width: 15px;
  height: 15px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}

#printIcon1 {
  position: absolute;
  left: 170.8px;
  top: 1070.2px;
  width: 15px;
  height: 15px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}

#stairsIcon8 {
  position: absolute;
  left: 914.8px;
  top: 753.2px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon7 {
  position: absolute;
  left: 903.8px;
  top: 720.2px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#stairsIcon6 {
  position: absolute;
  left: 865.5px;
  top: 152px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(-0.00013022845deg);
}

#stairsIcon5 {
  position: absolute;
  left: 905.5px;
  top: 165px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon4 {
  position: absolute;
  left: 158px;
  top: 1001px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(0.00013022845deg);
}

#stairsIcon3 {
  position: absolute;
  left: 190.2px;
  top: 1015px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon2 {
  position: absolute;
  left: 164.6px;
  top: 440px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon1 {
  position: absolute;
  left: 155px;
  top: 407px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#elevator4 {
  position: absolute;
  left: 800.5px;
  top: 738.4px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90.00008deg);
}

#elevator3 {
  position: absolute;
  left: 800.5px;
  top: 765.8px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90.00008deg);
}

#elevator2 {
  position: absolute;
  left: 260px;
  top: 420.8px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00008deg);
}

#elevator1 {
  position: absolute;
  left: 260px;
  top: 394px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00008deg);
}

#line120 {
  position: absolute;
  left: 260.5px;
  top: 400px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line123 {
  position: absolute;
  left: 151.6px;
  top: 400px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line119 {
  position: absolute;
  left: 201px;
  top: 420px;
  width: 2px;
  height: 80px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line122 {
  position: absolute;
  left: 800.5px;
  top: 742.5px;
  width: 39px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line121 {
  position: absolute;
  left: 261.5px;
  top: 453.5px;
  width: 38.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line118 {
  position: absolute;
  left: 75.5px;
  top: 499px;
  width: 143px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line131 {
  position: absolute;
  left: 240px;
  top: 499px;
  width: 60px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line117 {
  position: absolute;
  left: 240px;
  top: 399.3px;
  width: 59px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line130 {
  position: absolute;
  left: 200px;
  top: 399.3px;
  width: 20px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line113 {
  position: absolute;
  left: 188px;
  top: 600px;
  width: 2px;
  height: 65.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line112 {
  position: absolute;
  left: 225.3px;
  top: 600px;
  width: 2px;
  height: 65.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line115 {
  position: absolute;
  left: 208px;
  top: 528.5px;
  width: 2px;
  height: 71.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line114 {
  position: absolute;
  left: 149.5px;
  top: 528.5px;
  width: 2px;
  height: 71.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line111 {
  position: absolute;
  left: 149.5px;
  top: 600px;
  width: 2px;
  height: 65.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line109 {
  position: absolute;
  left: 225.3px;
  top: 665.5px;
  width: 2px;
  height: 134.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line108 {
  position: absolute;
  left: 149.5px;
  top: 665.5px;
  width: 2px;
  height: 134.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line101 {
  position: absolute;
  left: 200px;
  top: 935.8px;
  width: 50.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line94 {
  position: absolute;
  left: 1px;
  top: 1017.5px;
  width: 86px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line93 {
  position: absolute;
  left: 226.5px;
  top: 1000px;
  width: 2px;
  height: 63px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line116 {
  position: absolute;
  left: 151.6px;
  top: 527.5px;
  width: 57.4px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line110 {
  position: absolute;
  left: 151.6px;
  top: 599px;
  width: 74.7px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line107 {
  position: absolute;
  left: 150.5px;
  top: 664.5px;
  width: 74.7px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line106 {
  position: absolute;
  left: 150.5px;
  top: 799px;
  width: 74.7px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line99 {
  position: absolute;
  left: 149.5px;
  top: 972.5px;
  width: 102px;      
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line96 {
  position: absolute;
  left: 149.5px;
  top: 899px;
  width: 115px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line89 {
  position: absolute;
  left: 149.5px;
  top: 999px;
  width: 117px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line92 {
  position: absolute;
  left: 150.5px;
  top: 1062px;
  width: 115px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line88 {
  position: absolute;
  left: 150.5px;
  top: 1098.5px;
  width: 115px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line87 {
  position: absolute;
  left: 73.5px;
  top: 1142px;
  width: 52px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line86 {
  position: absolute;
  left: 124.5px;
  top: 1143px;
  width: 2px;
  height: 56px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line85 {
  position: absolute;
  left: 72.5px;
  top: 1143px;
  width: 2px;
  height: 56px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#meetingRoom22 {
  position: absolute;
  left: 946.4px;
  top: 450px;
  width: 44px;
  height: 50px;
  background-blend-mode: normal;
}

#meetingRoom25 {
  position: absolute;
  left: 990.5px;
  top: 689.5px;
  width: 108px;
  height: 110px;
  background-blend-mode: normal;
}

#meetingRoom24 {
  position: absolute;
  left: 900px;
  top: 600.4px;
  width: 90px;
  height: 66px;
  background-blend-mode: normal;
}

#meetingRoom23 {
  position: absolute;
  left: 900px;
  top: 527px;
  width: 90px;
  height: 73px;
  background-blend-mode: normal;
}

#meetingRoom21 {
  position: absolute;
  left: 900px;
  top: 450px;
  width: 46px;
  height: 50px;
  background-blend-mode: normal;
}

#meetingRoom20 {
  position: absolute;
  left: 957.5px;
  top: 400px;
  width: 33px;
  height: 50px;
  background-blend-mode: normal;
}

#meetingRoom19 {
  position: absolute;
  left: 900px;
  top: 400px;
  width: 57px;
  height: 50px;
  background-blend-mode: normal;
}

#meetingRoom31 {
  position: absolute;
  left: 500px;
  top: 1000px;
  width: 100px;
  height: 61px;
  background-blend-mode: normal;
}

#meetingRoom32 {
  position: absolute;
  left: 551px;
  top: 1061px;
  width: 49px;
  height: 38px;
  background-blend-mode: normal;
}

#meetingRoom34 {
  position: absolute;
  left: 500px;
  top: 1061px;
  width: 51px;
  height: 38px;
  background-blend-mode: normal;
}

#meetingRoom33 {
  position: absolute;
  left: 433px;
  top: 1000px;
  width: 67px;
  height: 99px;
  background-blend-mode: normal;
}

#meetingRoom35 {
  position: absolute;
  left: 300.5px;
  top: 1000px;
  width: 62px;
  height: 99px;
  background-blend-mode: normal;
}

#meetingRoom38 {
  position: absolute;
  left: 73.5px;
  top: 1143px;
  width: 52px;
  height: 56px;
  background-blend-mode: normal;
}

#line84 {
  position: absolute;
  left: 300.5px;
  top: 999px;
  width: 62px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line81 {
  position: absolute;
  left: 300.5px;
  top: 1098.5px;
  width: 62px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line80 {
  position: absolute;
  left: 377px;
  top: 1137.5px;
  width: 34.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line79 {
  position: absolute;
  left: 376px;
  top: 1138.5px;
  width: 2px;
  height: 60.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line78 {
  position: absolute;
  left: 410.5px;
  top: 1138.5px;
  width: 2px;
  height: 60.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line77 {
  position: absolute;
  left: 500px;
  top: 1059px;
  width: 100px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line71 {
  position: absolute;
  left: 731.5px;
  top: 1055.5px;
  width: 2px;
  height: 43.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line70 {
  position: absolute;
  left: 700px;
  top: 1054.5px;
  width: 100.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line69 {
  position: absolute;
  left: 699.5px;
  top: 1000px;
  width: 2px;
  height: 99px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line83 {
  position: absolute;
  left: 361.5px;
  top: 1000px;
  width: 2px;
  height: 99px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line100 {
  position: absolute;
  left: 199px;
  top: 900px;
  width: 2px;
  height: 73.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line102 {
  position: absolute;
  left: 114.5px;
  top: 887.5px;
  width: 2px;
  height: 131px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line104 {
  position: absolute;
  left: 230.5px;
  top: 832.5px;
  width: 2px;
  height: 67.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line105 {
  position: absolute;
  left: 114.5px;
  top: 803px;
  width: 2px;
  height: 63.2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line103 {
  position: absolute;
  left: 150px;
  top: 832.5px;
  width: 2px;
  height: 67.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line98 {
  position: absolute;
  left: 149.5px;
  top: 900px;
  width: 2px;
  height: 73.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line97 {
  position: absolute;
  left: 249.5px;
  top: 900px;
  width: 2px;
  height: 73.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line91 {
  position: absolute;
  left: 264.5px;
  top: 1000px;
  width: 2px;
  height: 99.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line90 {
  position: absolute;
  left: 149.5px;
  top: 1000px;
  width: 2px;
  height: 99.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line82 {
  position: absolute;
  left: 299.5px;
  top: 1000px;
  width: 2px;
  height: 99px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line76 {
  position: absolute;
  left: 431.5px;
  top: 1000px;
  width: 2px;
  height: 99px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line75 {
  position: absolute;
  left: 499px;
  top: 1000px;
  width: 2px;
  height: 99px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line74 {
  position: absolute;
  left: 599.5px;
  top: 1000px;
  width: 2px;
  height: 99px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line68 {
  position: absolute;
  left: 800px;
  top: 999px;
  width: 2px;
  height: 101px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line62 {
  position: absolute;
  left: 900px;
  top: 713.5px;
  width: 51.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line59 {
  position: absolute;
  left: 966.5px;
  top: 775.5px;
  width: 24px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line34 {
  position: absolute;
  left: 909px;
  top: 112px;
  width: 2px;
  height: 38.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line33 {
  position: absolute;
  left: 870.5px;
  top: 112px;
  width: 2px;
  height: 38.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line16 {
  position: absolute;
  left: 363.5px;
  top: 112.5px;
  width: 2px;
  height: 36.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line18 {
  position: absolute;
  left: 507px;
  top: 111.5px;
  width: 2px;
  height: 88.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line14 {
  position: absolute;
  left: 299px;
  top: 111.5px;
  width: 2px;
  height: 88.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line30 {
  position: absolute;
  left: 759px;
  top: 110.5px;
  width: 193.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line31 {
  position: absolute;
  left: 844px;
  top: 150px;
  width: 108.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line39 {
  position: absolute;
  left: 844px;
  top: 222.5px;
  width: 108.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line40 {
  position: absolute;
  left: 844px;
  top: 261.2px;
  width: 56px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line47 {
  position: absolute;
  left: 900px;
  top: 499.8px;
  width: 90.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line46 {
  position: absolute;
  left: 900px;
  top: 449.8px;
  width: 90.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line54 {
  position: absolute;
  left: 978.5px;
  top: 688.5px;
  width: 120.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line56 {
  position: absolute;
  left: 900px;
  top: 600px;
  width: 90px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line55 {
  position: absolute;
  left: 900px;
  top: 666.7px;
  width: 90px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line52 {
  position: absolute;
  left: 900px;
  top: 527px;
  width: 90.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line45 {
  position: absolute;
  left: 900px;
  top: 399.8px;
  width: 90.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line36 {
  position: absolute;
  left: 844px;
  top: 299px;
  width: 108.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line41 {
  position: absolute;
  left: 982.5px;
  top: 180.3px;
  width: 116.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line29 {
  position: absolute;
  left: 759px;
  top: 199px;
  width: 193.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line20 {
  position: absolute;
  left: 508px;
  top: 199px;
  width: 223.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line19 {
  position: absolute;
  left: 508px;
  top: 110.5px;
  width: 224.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line17 {
  position: absolute;
  left: 300px;
  top: 110.5px;
  width: 166.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line13 {
  position: absolute;
  left: 300px;
  top: 148px;
  width: 100px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line25 {
  position: absolute;
  left: 699px;
  top: 155px;
  width: 33.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line44 {
  position: absolute;
  left: 800px;
  top: 299px;
  width: 44px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line51 {
  position: absolute;
  left: 945.4px;
  top: 450px;
  width: 2px;
  height: 50px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line50 {
  position: absolute;
  left: 956.5px;
  top: 400px;
  width: 2px;
  height: 50px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line57 {
  position: absolute;
  left: 899px;
  top: 527.2px;
  width: 2px;
  height: 139.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line61 {
  position: absolute;
  left: 950.5px;
  top: 714.5px;
  width: 2px;
  height: 85.2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line67 {
  position: absolute;
  left: 632.5px;
  top: 1098px;
  width: 167.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line73 {
  position: absolute;
  left: 432.5px;
  top: 1098px;
  width: 167.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line72 {
  position: absolute;
  left: 432.5px;
  top: 999px;
  width: 176.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line66 {
  position: absolute;
  left: 632.5px;
  top: 999px;
  width: 167.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line65 {
  position: absolute;
  left: 800.5px;
  top: 699px;
  width: 65px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line129 {
  position: absolute;
  left: 880.5px;
  top: 699px;
  width: 19px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line64 {
  position: absolute;
  left: 800.5px;
  top: 799px;
  width: 65px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line128 {
  position: absolute;
  left: 880.5px;
  top: 799px;
  width: 20px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line63 {
  position: absolute;
  left: 839px;
  top: 700.5px;
  width: 2px;
  height: 99.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line60 {
  position: absolute;
  left: 898px;
  top: 700px;
  width: 2px;
  height: 80px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}



#line58 {
  position: absolute;
  left: 989.5px;
  top: 689.5px;
  width: 2px;
  height: 87px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line53 {
  position: absolute;
  left: 989.5px;
  top: 527.3px;
  width: 2px;
  height: 139.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line49 {
  position: absolute;
  left: 989.5px;
  top: 400px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line48 {
  position: absolute;
  left: 899px;
  top: 400px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line125 {
  position: absolute;
  left: 899px;
  top: 300px;
  width: 2px;
  height: 57.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line43 {
  position: absolute;
  left: 989.5px;
  top: 262.4px;
  width: 2px;
  height: 112.1px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line42 {
  position: absolute;
  left: 989.5px;
  top: 180.3px;
  width: 2px;
  height: 61.2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line132 {
  position: absolute;
  left: 951.5px;
  top: 240.3px;
  width: 40px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line133 {
  position: absolute;
  left: 951.5px;
  top: 180px;
  width: 20px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line32 {
  position: absolute;
  left: 951.5px;
  top: 112px;
  width: 2px;
  height: 94px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line38 {
  position: absolute;
  left: 899px;
  top: 224.5px;
  width: 2px;
  height: 75.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line37 {
  position: absolute;
  left: 951.5px;
  top: 218px;
  width: 2px;
  height: 82px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line35 {
  position: absolute;
  left: 843px;
  top: 218px;
  width: 2px;
  height: 82px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line28 {
  position: absolute;
  left: 843px;
  top: 112px;
  width: 2px;
  height: 94px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line27 {
  position: absolute;
  left: 803.5px;
  top: 112px;
  width: 2px;
  height: 88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line26 {
  position: absolute;
  left: 758px;
  top: 112px;
  width: 2px;
  height: 88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line24 {
  position: absolute;
  left: 698px;
  top: 112px;
  width: 2px;
  height: 88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line23 {
  position: absolute;
  left: 731.5px;
  top: 112px;
  width: 2px;
  height: 88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line22 {
  position: absolute;
  left: 566px;
  top: 112px;
  width: 2px;
  height: 88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line21 {
  position: absolute;
  left: 600px;
  top: 112px;
  width: 2px;
  height: 88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line15 {
  position: absolute;
  left: 399px;
  top: 112px;
  width: 2px;
  height: 88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line12 {
  position: absolute;
  left: 300px;
  top: 199px;
  width: 163.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line10 {
  position: absolute;
  left: 300px;
  top: 900px;
  width: 500px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line9 {
  position: absolute;
  left: 300px;
  top: 299px;
  width: 500px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line11 {
  position: absolute;
  left: 799.5px;
  top: 301px;
  width: 2px;
  height: 600px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line8 {
  position: absolute;
  left: 299px;
  top: 300px;
  width: 2px;
  height: 600px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line7 {
  position: absolute;
  left: 1098px;
  top: 0px;
  width: 2px;
  height: 799.67px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line6 {
  position: absolute;
  left: 1px;
  top: 1198px;
  width: 898.37px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line5 {
  position: absolute;
  left: 0px;
  top: 400.33px;
  width: 2px;
  height: 798.67px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line4 {
  position: absolute;
  left: 1px;
  top: 399.33px;
  width: 200.14px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line3 {
  position: absolute;
  left: 898.37px;
  top: 789.67px;
  width: 2px;
  height: 410px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line2 {
  position: absolute;
  left: 899.36px;
  top: 798.67px;
  width: 199.64px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line127 {
  position: absolute;
  left: 201px;
  top: 0px;
  width: 898px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line126 {
  position: absolute;
  left: 201.13px;
  top: 1px;
  width: 2px;
  height: 408px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}



</style>