<script>
import { page } from "$app/stores";
import { buildingsGrid } from "../../store/data";
import SidebarRight from "../Sidebar_right.svelte";
import { baseURL } from "../../store/store.js"
import Spinner from "../Spinner.svelte";


// Data needed in each Floor plan
export let searchData;
export let floorData;
export let instruments;
export let PCs;
export let netWorkPorts;
export let modalItemUpdate;


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

    let lines = Array.from({ length: 125 }, (_, i) => i + 1);     
    let stairs = Array.from({ length: 6 }, (_, i) => i + 1);   
    let rectangles = Array.from({ length: 2 }, (_, i) => i + 1);   
    let elevators = Array.from({ length: 4 }, (_, i) => i + 1);
    let meetingIcons = Array.from({ length: 4 }, (_, i) => i + 1);


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
						${searchData?.find(data => data.roomName === room.name) ? 'bg-red-300' : ''}
					`}
					style={`position: absolute; left: ${r.left}px; top: ${r.top}px; width: ${r.width}px; height: ${r.height}px;`}
					> 
					{#if index == 0}
						<div class="flex flex-col">
							<div class="z-10 cursor-pointer font-defaultText">{room.name} </div>
								{#if room.type === "Meeting room"}
									<iconify-icon class="text-xl mx-2" icon="guidance:meeting-room" ></iconify-icon>
								{:else if room.type === "Printer room"}
									<iconify-icon class="mx-4 text-lg" icon="uiw:printer" ></iconify-icon>
								{/if}
							
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

    {#each rectangles as rectangle}
        <div id="rectangle{rectangle}"/>
    {/each}

    {#each elevators as elevator}
        <div id="elevator{elevator}"/>
    {/each}

    <!-- {#each meetingIcons as meetingicon}
        <div id="meetingIcon{meetingicon}"/> 
    {/each} -->

        
        <!-- <div id="printIcon1"/>
        <div id="printIcon2"/> -->

	<div id="triangle"> <h1 class="font-digits ml-6">EXIT</h1> </div>
    <div id="triangle2"> <h1 class="font-digits">EXIT</h1> </div>
        
        
    <div id="KANTINE"> <h1 class="font-digits" >Canteen</h1> </div>
    <div id="BUFFET"> <h1 class="font-digits" >Buffet</h1> </div>
    <div id="KITCHEN1"> <h1 class="font-digits" >Kitchen</h1> </div>
	<div id="KITCHEN2"> <h1 class="font-digits" >Kitchen</h1> </div>

            
    <div id="kitchenIco1"> <iconify-icon class="mx-4 text-xl" icon="ph:cooking-pot-bold" ></iconify-icon> </div>
	<div id="kitchenIco2"> <iconify-icon class="mx-4 text-xl" icon="ph:cooking-pot-bold" ></iconify-icon> </div>  
		
	<div id="reception"> <h1 class="font-digits mt-20 text-xs" >Reception</h1> </div>
    <div id="receptioni"/> 

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
    background: rgba(132,75,75,0.19);
}


#triangle {
  position: absolute;
  left: 182.84px;
  top: 300.75px;
  width: 14.99px;
  height: 99.92px;
  border-top: 50px solid transparent;
  border-right: 20px solid rgb(0, 0, 0);
  border-bottom: 50px solid transparent;
  background-blend-mode: normal;
}

#triangle2 {
  position: absolute;
  left: 900.24px;
  top: 800.33px;
  width: 14.99px;
  height: 99.92px;
  border-top: 50px solid transparent;
  border-left: 20px solid rgb(0, 0, 0);
  border-bottom: 50px solid transparent;
  background-blend-mode: normal;
}

#rectangle1 {
  position: absolute;
  left: 832.8px;
  top: 412.86px;
  width: 19.98px;
  height: 59.95px;
  border-radius: 8px;
  border: 1px dashed #000000;
  background: rgba(211,211,211,0.1);
  background-blend-mode: normal;
}

#rectangle2 {
  position: absolute;
  left: 832.8px;
  top: 513.37px;
  width: 19.98px;
  height: 59.95px;
  border-radius: 8px;
  border: 1px dashed #000000;
  background: rgba(211,211,211,0.1);
  background-blend-mode: normal;
}


#KANTINE {
  position: absolute;
  left: 622.47px;
  top: 493.59px;
  width: 51.96px;
  height: 14.99px;
  color: #000000;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
}

#reception {
  position: absolute;
  left: 412.15px;
  top: 358.7px;
  width: 42.96px;
  height: 71.94px;
  border-radius: 8px;
  border: 1px solid #000000;
  background: rgba(187, 136, 136, 0.19);
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px #000000;
}

#receptioni {
  position: absolute;
  left: 414.45px;
  top: 375.19px;
  width: 39.97px;
  height: 39.97px;
  background:  url("/floorPlan-icons/reception.png")  no-repeat;
  background-size: cover;
}

#kitchenIco1 {
  position: absolute;
  left: 917.23px;
  top: 450.65px;
  width: 65.95px;
  height: 65.95px;
  background-size: cover;
}

#kitchenIco2 {
  position: absolute;
  left: 970.22px;
  top: 675.67px;
  width: 65.95px;
  height: 65.95px;
  background-size: cover;
}

#KITCHEN1 {
  position: absolute;
  left: 921.22px;
  top: 425.67px;
  width: 52.96px;
  height: 14.99px;
  color: #000000;
  font-size: 12px;
  font-weight: 400;
}

#KITCHEN2 {
  position: absolute;
  left: 975.22px;
  top: 650.67px;
  width: 52.96px;
  height: 14.99px;
  color: #000000;
  font-size: 12px;
  font-weight: 400;
}

#BUFFET {
  position: absolute;
  left: 819.31px;
  top: 485.6px;
  width: 45.96px;
  height: 14.99px;
  color: #000000;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
}

#elevator1 {
  position: absolute;
  left: 799.3px;
  top: 742.88px;
  width: 35.97px;
  height: 35.97px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90deg);
}

#elevator2 {
  position: absolute;
  left: 259.74px;
  top: 395.67px;
  width: 39.97px;
  height: 39.97px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90deg);
}

#elevator3 {
  position: absolute;
  left: 259.74px;
  top: 425.15px;
  width: 39.97px;
  height: 39.97px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90deg);
}

#elevator4 {
  position: absolute;
  left: 799.3px;
  top: 768.86px;
  width: 35.97px;
  height: 35.97px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90deg);
}

#stairsIcon5 {
  position: absolute;
  left: 187.63px;
  top: 1017.15px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon6 {
  position: absolute;
  left: 915.23px;
  top: 757.17px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  /* transform: scaleX(-1) scaleY(-1); */
}

#stairsIcon1 {
  position: absolute;
  left: 150.37px;
  top: 419.15px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#stairsIcon2 {
  position: absolute;
  left: 165.85px;
  top: 444.63px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  /* transform: scaleX(-1) scaleY(-1); */
}

#stairsIcon3 {
  position: absolute;
  left: 905px;
  top: 725px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#stairsIcon4 {
  position: absolute;
  left: 164.84px;
  top: 1000.37px;
  width: 29.98px;
  height: 29.98px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}



#printIcon1 {
  position: absolute;
  left: 219.8px;
  top: 918.24px;
  width: 14.99px;
  height: 14.99px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}

#printIcon2 {
  position: absolute;
  left: 219.82px;
  top: 953.92px;
  width: 14.99px;
  height: 14.99px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}



#meetingIcon1 {
  position: absolute;
  left: 436.43px;
  top: 920.63px;
  width: 29px;
  height: 29px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon2 {
  position: absolute;
  left: 179.34px;
  top: 1157.84px;
  width: 29.98px;
  height: 29.98px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon3 {
  position: absolute;
  left: 131.58px;
  top: 1160.03px;
  width: 29.98px;
  height: 29.98px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon4 {
  position: absolute;
  left: 234.8px;
  top: 1157.84px;
  width: 29.98px;
  height: 29.98px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#line117 {
  position: absolute;
  left: 200.82px;
  top: 1px;
  width: 2px;
  height: 299.75px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line1 {
  position: absolute;
  left: 200.82px;
  top: 0px;
  width: 899.25px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line2 {
  position: absolute;
  left: 900.24px;
  top: 799.33px;
  width: 199.83px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line3 {
  position: absolute;
  left: 899.24px;
  top: 900.25px;
  width: 2px;
  height: 299.75px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line4 {
  position: absolute;
  left: 0.99px;
  top: 399.67px;
  width: 200.33px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line5 {
  position: absolute;
  left: 0;
  top: 400.67px;
  width: 2px;
  height: 799.33px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line6 {
  position: absolute;
  left: 0.99px;
  top: 1199px;
  width: 899.25px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line7 {
  position: absolute;
  left: 1099.08px;
  top: 0px;
  width: 2px;
  height: 800.33px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line8 {
  position: absolute;
  left: 300.74px;
  top: 899.25px;
  width: 599.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line9 {
  position: absolute;
  left: 299.74px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line10 {
  position: absolute;
  left: 300.74px;
  top: 969.69px;
  width: 75.44px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line11 {
  position: absolute;
  left: 375.18px;
  top: 970.69px;
  width: 2px;
  height: 79.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line12 {
  position: absolute;
  left: 376.18px;
  top: 1049.13px;
  width: 124.4px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line13 {
  position: absolute;
  left: 499.57px;
  top: 900.25px;
  width: 2px;
  height: 149.88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line14 {
  position: absolute;
  left: 401.66px;
  top: 970.19px;
  width: 99.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line15 {
  position: absolute;
  left: 399.66px;
  top: 970.69px;
  width: 2px;
  height: 79.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line16 {
  position: absolute;
  left: 375.18px;
  top: 1050.13px;
  width: 2px;
  height: 149.88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}


#line17 {
  position: absolute;
  left: 399.66px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}


#line18 {
  position: absolute;
  left: 155.36px;
  top: 899.25px;
  width: 145.38px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line19 {
  position: absolute;
  left: 154.36px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line20 {
  position: absolute;
  left: 0.99px;
  top: 969.69px;
  width: 250.29px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line21 {
  position: absolute;
  left: 199.82px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line22 {
  position: absolute;
  left: 250.28px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line23 {
  position: absolute;
  left: 200.82px;
  top: 934.42px;
  width: 50.46px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line24 {
  position: absolute;
  left: 87.42px;
  top: 999.17px;
  width: 163.86px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line25 {
  position: absolute;
  left: 86.42px;
  top: 1000.17px;
  width: 2px;
  height: 15.49px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line26 {
  position: absolute;
  left: 0.99px;
  top: 1014.66px;
  width: 86.43px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line27 {
  position: absolute;
  left: 154.36px;
  top: 1000.17px;
  width: 2px;
  height: 49.96px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line28 {
  position: absolute;
  left: 155.36px;
  top: 1049.13px;
  width: 72.64px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line29 {
  position: absolute;
  left: 227px;
  top: 1000.17px;
  width: 2px;
  height: 49.96px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line30 {
  position: absolute;
  left: 184.34px;
  top: 970.69px;
  width: 2px;
  height: 29.48px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line31 {
  position: absolute;
  left: 214.31px;
  top: 970.69px;
  width: 2px;
  height: 29.48px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line32 {
  position: absolute;
  left: 250.28px;
  top: 970.69px;
  width: 2px;
  height: 29.48px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}


#line33 {
  position: absolute;
  left: 125.09px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line34 {
  position: absolute;
  left: 277.26px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line35 {
  position: absolute;
  left: 126.09px;
  top: 1114.57px;
  width: 152.17px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line36 {
  position: absolute;
  left: 220.31px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line37 {
  position: absolute;
  left: 167.35px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line38 {
  position: absolute;
  left: 299.74px;
  top: 400.67px;
  width: 2px;
  height: 499.58px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line39 {
  position: absolute;
  left: 201.82px;
  top: 399.67px;
  width: 98.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line40 {
  position: absolute;
  left: 200.82px;
  top: 299.75px;
  width: 170px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line122 {
  position: absolute;
  left: 390.82px;
  top: 299.75px;
  width: 70px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line123 {
  position: absolute;
  left: 480.82px;
  top: 299.75px;
  width: 85px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line124 {
  position: absolute;
  left: 585.82px;
  top: 299.75px;
  width: 85px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line125 {
  position: absolute;
  left: 690.82px;
  top: 299.75px;
  width: 110px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line41 {
  position: absolute;
  left: 299.74px;
  top: 150.87px;
  width: 2px;
  height: 149.88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line42 {
  position: absolute;
  left: 300.74px;
  top: 149.88px;
  width: 99.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line43 {
  position: absolute;
  left: 300.74px;
  top: 199.83px;
  width: 99.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line44 {
  position: absolute;
  left: 399.66px;
  top: 150.87px;
  width: 2px;
  height: 49.96px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line119 {
  position: absolute;
  left: 500px;
  top: 150.87px;
  width: 2px;
  height: 150px;
  border-left: 2px dashed #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line120 {
  position: absolute;
  left: 600px;
  top: 150.87px;
  width: 2px;
  height: 150px;
  border-left: 2px dashed #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line121 {
  position: absolute;
  left: 700px;
  top: 150.87px;
  width: 2px;
  height: 150px;
  border-left: 2px dashed #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line45 {
  position: absolute;
  left: 399.66px;
  top: 200.83px;
  width: 2px;
  height: 99.92px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line46 {
  position: absolute;
  left: 400.66px;
  top: 149.88px;
  width: 399.67px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line47 {
  position: absolute;
  left: 799.33px;
  top: 150.87px;
  width: 2px;
  height: 56px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line118 {
  position: absolute;
  left: 799.33px;
  top: 218px;
  width: 2px;
  height: 84px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line48 {
  position: absolute;
  left: 800.32px;
  top: 199.83px;
  width: 299.75px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line49 {
  position: absolute;
  left: 800.32px;
  top: 223.81px;
  width: 299.75px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line50 {
  position: absolute;
  left: 800.32px;
  top: 346.21px;
  width: 99.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line51 {
  position: absolute;
  left: 899.24px;
  top: 224.81px;
  width: 2px;
  height: 122.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line52 {
  position: absolute;
  left: 800.32px;
  top: 284.96px;
  width: 99.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line53 {
  position: absolute;
  left: 900.24px;
  top: 346.21px;
  width: 99.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line59 {
  position: absolute;
  left: 900.24px;
  top: 551.04px;
  width: 99.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line54 {
  position: absolute;
  left: 999.16px;
  top: 224.81px;
  width: 2px;
  height: 122.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line55 {
  position: absolute;
  left: 949.2px;
  top: 224.81px;
  width: 2px;
  height: 122.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line56 {
  position: absolute;
  left: 900.24px;
  top: 318.24px;
  width: 49.96px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line57 {
  position: absolute;
  left: 899.24px;
  top: 347.21px;
  width: 2px;
  height: 205.83px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line58 {
  position: absolute;
  left: 999.16px;
  top: 347.21px;
  width: 2px;
  height: 204.83px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line60 {
  position: absolute;
  left: 799.33px;
  top: 71.44px;
  width: 2px;
  height: 79.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line61 {
  position: absolute;
  left: 800.32px;
  top: 70.44px;
  width: 299.75px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line62 {
  position: absolute;
  left: 949.2px;
  top: 1px;
  width: 2px;
  height: 70.44px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line63 {
  position: absolute;
  left: 800.32px;
  top: 136.39px;
  width: 149.88px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line64 {
  position: absolute;
  left: 949.2px;
  top: 106.41px;
  width: 2px;
  height: 94.42px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line65 {
  position: absolute;
  left: 950.2px;
  top: 105.41px;
  width: 149.88px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line66 {
  position: absolute;
  left: 1057.61px;
  top: 106.41px;
  width: 2px;
  height: 94.42px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line67 {
  position: absolute;
  left: 899.24px;
  top: 577.02px;
  width: 2px;
  height: 223.31px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line68 {
  position: absolute;
  left: 900.24px;
  top: 577.02px;
  width: 199.83px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line69 {
  position: absolute;
  left: 900.24px;
  top: 713.91px;
  width: 49.96px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line70 {
  position: absolute;
  left: 949.2px;
  top: 714.9px;
  width: 2px;
  height: 85.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line71 {
  position: absolute;
  left: 800.32px;
  top: 713.91px;
  width: 99.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line74 {
  position: absolute;
  left: 800.32px;
  top: 798.34px;
  width: 99.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line75 {
  position: absolute;
  left: 800.32px;
  top: 771.86px;
  width: 32.47px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line76 {
  position: absolute;
  left: 800.32px;
  top: 747.88px;
  width: 32.47px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line72 {
  position: absolute;
  left: 799.33px;
  top: 714.9px;
  width: 2px;
  height: 84.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line73 {
  position: absolute;
  left: 831.8px;
  top: 714.9px;
  width: 2px;
  height: 84.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line77 {
  position: absolute;
  left: 148.37px;
  top: 400.67px;
  width: 2px;
  height: 99.92px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line78 {
  position: absolute;
  left: 149.37px;
  top: 499.58px;
  width: 151.37px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line79 {
  position: absolute;
  left: 201.32px;
  top: 400.67px;
  width: 2px;
  height: 99.92px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}


#line80 {
  position: absolute;
  left: 262.27px;
  top: 459.12px;
  width: 38.47px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line81 {
  position: absolute;
  left: 262.27px;
  top: 430.14px;
  width: 38.47px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line82 {
  position: absolute;
  left: 799.33px;
  top: 325.23px;
  width: 2px;
  height: 21.98px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}


#line83 {
  position: absolute;
  left: 623.97px;
  top: 423.15px;
  width: 154.87px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line84 {
  position: absolute;
  left: 743.87px;
  top: 599.5px;
  width: 34.97px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line85 {
  position: absolute;
  left: 622.97px;
  top: 383.18px;
  width: 2px;
  height: 40.97px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line86 {
  position: absolute;
  left: 486.09px;
  top: 382.18px;
  width: 137.89px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line87 {
  position: absolute;
  left: 485.09px;
  top: 383.18px;
  width: 2px;
  height: 168.86px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line88 {
  position: absolute;
  left: 486.09px;
  top: 551.04px;
  width: 106.91px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line89 {
  position: absolute;
  left: 592px;
  top: 552.04px;
  width: 2px;
  height: 104.91px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line90 {
  position: absolute;
  left: 593px;
  top: 655.95px;
  width: 150.87px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line91 {
  position: absolute;
  left: 742.87px;
  top: 600.5px;
  width: 2px;
  height: 56.45px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}


#line92 {
  position: absolute;
  left: 726.89px;
  top: 1114.57px;
  width: 173.36px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line93 {
  position: absolute;
  left: 725.89px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line94 {
  position: absolute;
  left: 600.49px;
  top: 999.17px;
  width: 89.43px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line95 {
  position: absolute;
  left: 599.49px;
  top: 1000.17px;
  width: 2px;
  height: 90.92px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line96 {
  position: absolute;
  left: 600.49px;
  top: 1090.09px;
  width: 89.43px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line97 {
  position: absolute;
  left: 688.92px;
  top: 1000.17px;
  width: 2px;
  height: 90.92px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line101 {
  position: absolute;
  left: 799.33px;
  top: 1000.17px;
  width: 2px;
  height: 75.44px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line98 {
  position: absolute;
  left: 689.92px;
  top: 1074.61px;
  width: 110.41px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line100 {
  position: absolute;
  left: 690.42px;
  top: 1050.63px;
  width: 109.91px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line99 {
  position: absolute;
  left: 689.92px;
  top: 999.17px;
  width: 110.41px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line102 {
  position: absolute;
  left: 117.39px;
  top: 599.5px;
  width: 183.35px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line103 {
  position: absolute;
  left: 116.39px;
  top: 600.5px;
  width: 2px;
  height: 99.92px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line104 {
  position: absolute;
  left: 117.39px;
  top: 699.42px;
  width: 68.44px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line105 {
  position: absolute;
  left: 184.84px;
  top: 600.5px;
  width: 2px;
  height: 99.92px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line106 {
  position: absolute;
  left: 116.39px;
  top: 541.05px;
  width: 2px;
  height: 59.45px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line107 {
  position: absolute;
  left: 117.39px;
  top: 540.05px;
  width: 101.42px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line108 {
  position: absolute;
  left: 217.81px;
  top: 541.05px;
  width: 2px;
  height: 59.45px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);

}

#line109 {
  position: absolute;
  left: 0.99px;
  top: 627.48px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line111 {
  position: absolute;
  left: 0.99px;
  top: 677.94px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line110 {
  position: absolute;
  left: 74.43px;
  top: 628.98px;
  width: 2px;
  height: 134.89px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line112 {
  position: absolute;
  left: 0.99px;
  top: 720.4px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line113 {
  position: absolute;
  left: 0.99px;
  top: 720.4px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line114 {
  position: absolute;
  left: 0.99px;
  top: 762.86px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line115 {
  position: absolute;
  left: 1051.62px;
  top: 577.32px;
  width: 2px;
  height: 50.66px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line116 {
  position: absolute;
  left: 1052.61px;
  top: 626.98px;
  width: 47.46px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}




</style>