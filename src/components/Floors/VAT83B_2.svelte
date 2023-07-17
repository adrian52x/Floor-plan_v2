<script>

export let searchData;
export let floorData;
export let modalItemUpdate;

import { afterUpdate, onMount } from "svelte";
import SiderbarRight from "../Siderbar_right.svelte";
import { baseURL } from "../../store/store.js"
import Spinner from "../Spinner.svelte";



// const buildingName = "VAT83B";
// const floor = 2;


// Data needed in each Floor plan (e.g VAT83A/B...)
let rooms = [];
let departments = [];
let hoveredRooms = [];

let roomData = null;
let dataRecieved = false;
let errorMessage;
//

console.log(modalItemUpdate);
let demoModeOn = {
	checked: false
}


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
  // modalItemUpdate?.position
	if(modalItemUpdate?.position){
		demoModeOn.checked = true
	}
}

// USED BEFORE
//onMount(() => {
	
// 	// Get all Departments and Rooms by building Name and Floor
//     fetch(`http://localhost:3000/api/floor?buildingName=${buildingName}&level=${floor}`)
// 	.then(response => response.json())
// 	.then(data => {
// 		rooms = data.rooms;
// 		departments = data.departments;
// 		currentFloorId.set(data._id) // save floorID
//         console.log("rooms",rooms);
//         console.log("departments",departments);

		

// 		console.log(hoveredRooms);

// 	})
// 	.catch(error => {
// 		console.error(error);
		
// 	});   
//});


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

	fetch(`${baseURL}/api/1room-instruments?roomName=${roomName}`)
	.then(response => {
		console.log(response.status);
		if (response.status === 200) {
			dataRecieved = true;
			console.log("Found", dataRecieved);
			return response.json();
		}
			dataRecieved = false;
			console.log("NOT FOUND", dataRecieved);
  	})
	.then(data => {
		roomData = data;
	})
	.catch(error => {
		console.log(error.message);
		errorMessage = error.message + " data";
	});
}






let lines = Array.from({ length: 149 }, (_, i) => i + 1);    
let stairs = Array.from({ length: 7 }, (_, i) => i + 1);    
let elevators = Array.from({ length: 3 }, (_, i) => i + 1);


</script>


<div class="floor-plan">

	{#if rooms?.length == 0}
		<div class="absolute right-0 h-8 mr-16">
			<Spinner isLoading = {rooms?.length == 0} />
			<div class="font-digits">Loading</div>
		</div>
	{/if}
	

	<!-- Change color for departments in database
	HTML COLORS: lightsalmon lightpink lavender seagreen teal darkseagreen skyblue-->
    {#each departments as department} 
        {#each department.position as d}
            {#if department.checked === true}
                <div class={`z-10 `} style={`background-color: ${department.color}; position: absolute; left: ${d.left}px; top: ${d.top}px; width: ${d.width}px; height: ${d.height}px;`}></div>
            {/if}
        {/each}    
	{/each}

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

    {#if isRightSideBarActive }
      <SiderbarRight roomData = {roomData} onClose={closeRightSideBar} isLoading={!dataRecieved} errorMessage={errorMessage}/>
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


	{#if rooms != undefined}
		{#each rooms as room}
			{#each room.position as r, index}
				<div 
					on:click={() => openRightSideBar(room.name)} on:keydown 
					on:mouseover={hoverRoom(room.name)} on:mouseout={hoverRoom(room.name)} on:blur on:focus
					id={room.name} 
					class={`
                        flex items-center justify-center text-xs
						${hoveredRooms[room.name]?.hovered ? 'hoveredRoom' : 'bg-blue-100'}
						${searchData?.find(data => data.roomName === room.name) ? 'bg-red-200' : ''}
					`}
					style={`position: absolute; left: ${r.left}px; top: ${r.top}px; width: ${r.width}px; height: ${r.height}px;`}> 
					{#if index == 0}
                    <div class="z-10 mb-4 cursor-pointer font-defaultText">{room.name} </div>
          
					{/if}
					
				</div>
			{/each}
		{/each}
    {/if} 	
    

	<!--  modalItemUPDATE Demo Mode (for rooms & departments) -->
	{#if demoModeOn.checked === true && modalItemUpdate?.activeTab !== 'Instruments'}
		<div class="fixed left-10 bottom-0 mb-10 ml-20">
			<input  type="checkbox" bind:checked={demoModeOn.checked} on:change={() => toggleDemoMode(demoModeOn)} />
			<span class="font-digits">Turn Off - Preview Mode</span>
		</div>

		<style>
			body {
				background-color: Gainsboro;
			}
	  	</style>	
    {/if}

    {#if modalItemUpdate != undefined && modalItemUpdate.activeTab !== 'Instruments'}
		{#each modalItemUpdate.position as r, index}
					<div 
						class={`flex items-center justify-center text-xs`}
						style={`background-color: CadetBlue; position: absolute; left: ${r.left}px; top: ${r.top}px; width: ${r.width}px; height: ${r.height}px;`}> 
						<!-- {#if index == 0}
							<div class="z-10 mb-4 cursor-pointer font-defaultText">{modalItemUpdate.name} </div>
						{/if} -->
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
    right: 20%;
    max-width: 300px;
    text-align: left;
}

.hoveredRoom {
    background: rgba(132,75,75,0.19);
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
  top: 268.5px;
  width: 63.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line39 {
  position: absolute;
  left: 419.5px;
  top: 1083.5px;
  width: 80.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line31 {
  position: absolute;
  left: 307.5px;
  top: 1083.5px;
  width: 97.5px;
  height: 2px;
  background: #000000;
  
  

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
  left: -1px;
  top: 1px;
  width: 2px;
  height: 1200px;
  
  background: #000000;
  
  

}

#line3 {
  position: absolute;
  left: 0px;
  top: 1199px;
  width: 650.2px;
  height: 2px;
  
  background: #000000;
  
}

#line116 {
  position: absolute;
  left: 317.7px;
  top: 464.5px;
  width: 82.3px;
  height: 2px;
  
  background: #000000;
  
  

}

#line115 {
  position: absolute;
  left: 296.7px;
  top: 447.5px;
  width: 22px;
  height: 2px;
  
  background: #000000;
  
  

}

#line113 {
  position: absolute;
  left: 229.2px;
  top: 447.5px;
  width: 53.3px;
  height: 2px;
  
  background: #000000;
  
  

}

#line111 {
  position: absolute;
  left: 229.2px;
  top: 499px;
  width: 99.2px;
  height: 2px;
  
  background: #000000;
  
  

}

#line7 {
  position: absolute;
  left: 228px;
  top: 553.5px;
  width: 173px;
  height: 2px;
  
  background: #000000;
  
  

}

#line14 {
  position: absolute;
  left: 387.5px;
  top: 554.5px;
  width: 2px;
  height: 94px;
  
  background: #000000;
  
  

}

#line13 {
  position: absolute;
  left: 299px;
  top: 554.5px;
  width: 2px;
  height: 94.3px;
  
  background: #000000;
  
  

}

#line44 {
  position: absolute;
  left: 371.5px;
  top: 978.5px;
  width: 53px;
  height: 2px;
  
  background: #000000;
  
  

}

#line27 {
  position: absolute;
  left: 229.5px;
  top: 978.5px;
  width: 127px;
  height: 2px;
  
  background: #000000;
  
  

}

#line35 {
  position: absolute;
  left: 355.5px;
  top: 1000px;
  width: 2px;
  height: 84.5px;
  
  background: #000000;
  
  

}

#line42 {
  position: absolute;
  left: 399px;
  top: 1117.5px;
  width: 2px;
  height: 82.5px;
  
  background: #000000;
  
  

}

#line34 {
  position: absolute;
  left: 399px;
  top: 1000px;
  width: 2px;
  height: 100px;
  
  background: #000000;
  
  

}

#line32 {
  position: absolute;
  left: 306.5px;
  top: 995.5px;
  width: 2px;
  height: 89px;
  
  background: #000000;
  
  

}

#line30 {
  position: absolute;
  left: 499px;
  top: 1000px;
  width: 2px;
  height: 84.5px;
  
  background: #000000;
  
  

}

#line33 {
  position: absolute;
  left: 307.5px;
  top: 1051.5px;
  width: 49px;
  height: 2px;
  
  background: #000000;
  
  

}

#line46 {
  position: absolute;
  left: 500px;
  top: 1050.5px;
  width: 100px;
  height: 2px;
  
  background: #000000;
  
  

}

#line41 {
  position: absolute;
  left: 424.5px;
  top: 1039.5px;
  width: 75.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line40 {
  position: absolute;
  left: 454.5px;
  top: 1040.5px;
  width: 2px;
  height: 44px;
  
  background: #000000;
  
  

}

#line38 {
  position: absolute;
  left: 423.5px;
  top: 995.5px;
  width: 2px;
  height: 89px;
  
  background: #000000;
  
  

}

#line45 {
  position: absolute;
  left: 423.5px;
  top: 979.5px;
  width: 2px;
  height: 5px;
  
  background: #000000;
  
  

}

#line51 {
  position: absolute;
  left: 199px;
  top: 1000px;
  width: 2px;
  height: 150.5px;
  
  background: #000000;
  
  

}

#line50 {
  position: absolute;
  left: 185.5px;
  top: 999px;
  width: 26px;
  height: 2px;
  
  background: #000000;
  
  

}

#line60 {
  position: absolute;
  left: 138.5px;
  top: 1000px;
  width: 2px;
  height: 81.5px;
  
  background: #000000;
  
  

}

#line58 {
  position: absolute;
  left: 148.5px;
  top: 1081.5px;
  width: 2px;
  height: 18.5px;
  
  background: #000000;
  
  

}

#line56 {
  position: absolute;
  left: 148.5px;
  top: 1114.5px;
  width: 2px;
  height: 44.3px;
  
  background: #000000;
  
  

}

#line64 {
  position: absolute;
  left: 106.5px;
  top: 1095.5px;
  width: 2px;
  height: 23.5px;
  
  background: #000000;
  
  

}

#line104 {
  position: absolute;
  left: 50.5px;
  top: 747.3px;
  width: 2px;
  height: 42.7px;
  
  background: #000000;
  
  

}

#line73 {
  position: absolute;
  left: 138.5px;
  top: 747.4px;
  width: 2px;
  height: 119.6px;
  
  background: #000000;
  
  

}

#line70 {
  position: absolute;
  left: 199px;
  top: 788.5px;
  width: 2px;
  height: 88px;
  
  background: #000000;
  
  

}

#line67 {
  position: absolute;
  left: 199px;
  top: 894.5px;
  width: 2px;
  height: 85px;
  
  background: #000000;
  
  

}

#line72 {
  position: absolute;
  left: 139.5px;
  top: 866px;
  width: 60.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line126 {
  position: absolute;
  left: 307.5px;
  top: 120.5px;
  width: 223px;
  height: 2px;
  
  background: #000000;
  
  

}

#line148 {
  position: absolute;
  left: 104.5px;
  top: 116.5px;
  width: 2px;
  height: 83.5px;
  
  background: #000000;
  
  

}

#line147 {
  position: absolute;
  left: 105.5px;
  top: 174px;
  width: 94.3px;
  height: 2px;
  
  background: #000000;
  
  

}

#line103 {
  position: absolute;
  left: -0.2px;
  top: 199px;
  width: 282.7px;
  height: 2px;
  
  background: #000000;
  
  

}

#line146 {
  position: absolute;
  left: -0.79px;
  top: 115.93px;
  width: 200.57px;
  height: 2px;
  
  background: #000000;
  
  

}

#line94 {
  position: absolute;
  left: 0px;
  top: 299px;
  width: 123px;
  height: 2px;
  
  background: #000000;
  
  

}

#line108 {
  position: absolute;
  left: 144.5px;
  top: 339.6px;
  width: 55.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line109 {
  position: absolute;
  left: 144.5px;
  top: 340.6px;
  width: 2px;
  height: 59.4px;
  
  background: #000000;
  
  

}

#line107 {
  position: absolute;
  left: 144.5px;
  top: 382.8px;
  width: 55.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line110 {
  position: absolute;
  left: 134.5px;
  top: 399px;
  width: 12px;
  height: 2px;
  
  background: #000000;
  
  

}

#line85 {
  position: absolute;
  left: 93.5px;
  top: 399px;
  width: 27px;
  height: 2px;
  
  background: #000000;
  
  

}

#line86 {
  position: absolute;
  left: 112.5px;
  top: 400px;
  width: 2px;
  height: 154.5px;
  
  background: #000000;
  
  

}

#line106 {
  position: absolute;
  left: 0px;
  top: 399px;
  width: 81.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line105 {
  position: absolute;
  left: 0px;
  top: 553.5px;
  width: 81.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line84 {
  position: absolute;
  left: 94.5px;
  top: 553.5px;
  width: 34px;
  height: 2px;
  
  background: #000000;
  
  

}

#line87 {
  position: absolute;
  left: 199px;
  top: 290.5px;
  width: 2px;
  height: 186.7px;
  
  background: #000000;
  
  

}

#line75 {
  position: absolute;
  left: 199px;
  top: 491.5px;
  width: 2px;
  height: 164px;
  
  background: #000000;
  
  

}

#line74 {
  position: absolute;
  left: 199px;
  top: 675.5px;
  width: 2px;
  height: 96.2px;
  
  background: #000000;
  
  

}

#line71 {
  position: absolute;
  left: 139.5px;
  top: 820.5px;
  width: 60.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line69 {
  position: absolute;
  left: 156.5px;
  top: 899px;
  width: 43.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line80 {
  position: absolute;
  left: 121px;
  top: 805.5px;
  width: 18.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line79 {
  position: absolute;
  left: 91px;
  top: 805.5px;
  width: 18.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line78 {
  position: absolute;
  left: 89.5px;
  top: 789.5px;
  width: 2px;
  height: 18px;
  
  background: #000000;
  
  

}

#line93 {
  position: absolute;
  left: 145.7px;
  top: 571px;
  width: 54.3px;
  height: 2px;
  
  background: #000000;
  
  

}

#line92 {
  position: absolute;
  left: 144.7px;
  top: 537.5px;
  width: 55px;
  height: 2px;
  
  background: #000000;
  
  

}

#line91 {
  position: absolute;
  left: 144.7px;
  top: 538.5px;
  width: 2px;
  height: 67px;
  
  background: #000000;
  
  

}

#line83 {
  position: absolute;
  left: 158.5px;
  top: 678.5px;
  width: 41.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line82 {
  position: absolute;
  left: 121px;
  top: 747.3px;
  width: 79px;
  height: 2px;
  
  background: #000000;
  
  

}

#line81 {
  position: absolute;
  left: 0.4px;
  top: 747.3px;
  width: 109.1px;
  height: 2px;
  
  background: #000000;
  
  

}

#line77 {
  position: absolute;
  left: 0px;
  top: 789.8px;
  width: 90.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line76 {
  position: absolute;
  left: 0px;
  top: 849.3px;
  width: 139.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line68 {
  position: absolute;
  left: 0px;
  top: 899px;
  width: 123.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line66 {
  position: absolute;
  left: 0.5px;
  top: 948.5px;
  width: 199.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line65 {
  position: absolute;
  left: 0px;
  top: 1094.5px;
  width: 107.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line63 {
  position: absolute;
  left: 107.5px;
  top: 1118.5px;
  width: 19.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line62 {
  position: absolute;
  left: 139.5px;
  top: 1118.5px;
  width: 10px;
  height: 2px;
  
  background: #000000;
  
  

}

#line57 {
  position: absolute;
  left: 148.5px;
  top: 1171.5px;
  width: 2px;
  height: 28.5px;
  
  background: #000000;
  
  

}

#line55 {
  position: absolute;
  left: 245.5px;
  top: 1171.5px;
  width: 2px;
  height: 28.5px;
  
  background: #000000;
  
  

}

#line53 {
  position: absolute;
  left: 245.5px;
  top: 1075.7px;
  width: 2px;
  height: 83.1px;
  
  background: #000000;
  
  

}

#line49 {
  position: absolute;
  left: 288.5px;
  top: 1039.5px;
  width: 2px;
  height: 35.7px;
  
  background: #000000;
  
  

}

#line48 {
  position: absolute;
  left: 288.5px;
  top: 1000px;
  width: 2px;
  height: 26.5px;
  
  background: #000000;
  
  

}

#line43 {
  position: absolute;
  left: 306.5px;
  top: 979.5px;
  width: 2px;
  height: 5px;
  
  background: #000000;
  
  

}

#line37 {
  position: absolute;
  left: 400px;
  top: 999px;
  width: 5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line61 {
  position: absolute;
  left: 139.5px;
  top: 1039.8px;
  width: 60.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line59 {
  position: absolute;
  left: 139.5px;
  top: 1080.5px;
  width: 60.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line54 {
  position: absolute;
  left: 149.5px;
  top: 1149.5px;
  width: 97px;
  height: 2px;
  
  background: #000000;
  
  

}

#line52 {
  position: absolute;
  left: 200px;
  top: 1075.2px;
  width: 89.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line47 {
  position: absolute;
  left: 229.5px;
  top: 999px;
  width: 63.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line36 {
  position: absolute;
  left: 307.5px;
  top: 999px;
  width: 49px;
  height: 2px;
  
  background: #000000;
  
  

}

#line29 {
  position: absolute;
  left: 419.5px;
  top: 999px;
  width: 80.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line28 {
  position: absolute;
  left: 243.5px;
  top: 900px;
  width: 2px;
  height: 79.5px;
  
  background: #000000;
  
  

}

#line26 {
  position: absolute;
  left: 229.5px;
  top: 899px;
  width: 70.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line25 {
  position: absolute;
  left: 228.5px;
  top: 800px;
  width: 2px;
  height: 179.5px;
  
  background: #000000;
  
  

}

#line24 {
  position: absolute;
  left: 228.5px;
  top: 648.9px;
  width: 2px;
  height: 125.3px;
  
  background: #000000;
  
  

}

#line12 {
  position: absolute;
  left: 228.5px;
  top: 648.5px;
  width: 161px;
  height: 2px;
  
  background: #000000;
  
  

}

#line11 {
  position: absolute;
  left: 254.8px;
  top: 609.5px;
  width: 2px;
  height: 39px;
  
  background: #000000;
  
  

}

#line88 {
  position: absolute;
  left: 228.2px;
  top: 524.5px;
  width: 2px;
  height: 30px;
  
  background: #000000;
  
  

}

#line10 {
  position: absolute;
  left: 254.8px;
  top: 556.5px;
  width: 2px;
  height: 33px;
  
  background: #000000;
  
  

}

#line15 {
  position: absolute;
  left: 299px;
  top: 648.5px;
  width: 2px;
  height: 251.5px;
  
  background: #000000;
  
  

}

#line90 {
  position: absolute;
  left: 229px;
  top: 292.8px;
  width: 2px;
  height: 97.7px;
  
  background: #000000;
  
  

}

#line89 {
  position: absolute;
  left: 228.2px;
  top: 403.5px;
  width: 2px;
  height: 73.7px;
  
  background: #000000;
  
  

}

#line97 {
  position: absolute;
  left: 135.5px;
  top: 285px;
  width: 2px;
  height: 11.5px;
  
  background: #000000;
  
  

}

#line98 {
  position: absolute;
  left: 136.5px;
  top: 294.8px;
  width: 63.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line96 {
  position: absolute;
  left: 122.2px;
  top: 284.5px;
  width: 15.3px;
  height: 2px;
  
  background: #000000;
  
  

}

#line101 {
  position: absolute;
  left: 135.5px;
  top: 200px;
  width: 2px;
  height: 72.5px;
  
  background: #000000;
  
  

}

#line143 {
  position: absolute;
  left: 552.5px;
  top: 139.5px;
  width: 47.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line142 {
  position: absolute;
  left: 552px;
  top: 76px;
  width: 47.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line140 {
  position: absolute;
  left: 481px;
  top: 57px;
  width: 49.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line141 {
  position: absolute;
  left: 551px;
  top: 58px;
  width: 2px;
  height: 83.5px;
  
  background: #000000;
  
  

}

#line139 {
  position: absolute;
  left: 528.5px;
  top: 58.04px;
  width: 2px;
  height: 63.48px;
  
  background: #000000;
  
  

}

#line144 {
  position: absolute;
  left: 481px;
  top: 0px;
  width: 2px;
  height: 35.8px;
  
  background: #000000;
  
  

}

#line138 {
  position: absolute;
  left: 481px;
  top: 58.06px;
  width: 2px;
  height: 63.44px;
  
  background: #000000;
  
  

}

#line137 {
  position: absolute;
  left: 346px;
  top: 0px;
  width: 2px;
  height: 71.5px;
  
  background: #000000;
  
  

}

#line127 {
  position: absolute;
  left: 346px;
  top: 89.13px;
  width: 2px;
  height: 109.87px;
  
  background: #000000;
  
  

}

#line125 {
  position: absolute;
  left: 399px;
  top: 122.5px;
  width: 2px;
  height: 77.5px;
  
  background: #000000;
  
  

}

#line145 {
  position: absolute;
  left: 148.98px;
  top: 0.45px;
  width: 2px;
  height: 65.54px;
  
  background: #000000;
  
}

#line132 {
  position: absolute;
  left: 199px;
  top: 96px;
  width: 2px;
  height: 103px;
  
  background: #000000;
  
  

}

#line129 {
  position: absolute;
  left: 260.98px;
  top: 110.5px;
  width: 2px;
  height: 89.5px;
  
  background: #000000;
  
  

}

#line124 {
  position: absolute;
  left: 306.5px;
  top: 121.5px;
  width: 2px;
  height: 82px;
  
  background: #000000;
  
  

}

#line123 {
  position: absolute;
  left: 273.5px;
  top: 231.5px;
  width: 2px;
  height: 68.5px;
  
  background: #000000;
  
  

}

#line122 {
  position: absolute;
  left: 229px;
  top: 231.5px;
  width: 2px;
  height: 48px;
  
  background: #000000;
  
  

}

#line100 {
  position: absolute;
  left: 199px;
  top: 227.5px;
  width: 2px;
  height: 52px;
  
  background: #000000;
  
  

}

#line118 {
  position: absolute;
  left: 299px;
  top: 231.5px;
  width: 2px;
  height: 35.5px;
  
  background: #000000;
  
  

}

#line136 {
  position: absolute;
  left: 499px;
  top: 121.5px;
  width: 2px;
  height: 78.5px;
  
  background: #000000;
  
  

}

#line120 {
  position: absolute;
  left: 428.5px;
  top: 199px;
  width: 2px;
  height: 32.5px;
  
  background: #000000;
  
  

}

#line117 {
  position: absolute;
  left: 299px;
  top: 281.5px;
  width: 2px;
  height: 18.5px;
  
  background: #000000;
  
  

}

#line131 {
  position: absolute;
  left: 296.5px;
  top: 120.5px;
  width: 11px;
  height: 2px;
  
  background: #000000;
  
  

}

#line133 {
  position: absolute;
  left: 200px;
  top: 96.07px;
  width: 60.97px;
  height: 2px;
  
  background: #000000;
  
  

}

#line134 {
  position: absolute;
  left: 259.99px;
  top: 96.15px;
  width: 2px;
  height: 4.91px;
  
  background: #000000;
  
  

}

#line130 {
  position: absolute;
  left: 261.4px;
  top: 120.5px;
  width: 13.1px;
  height: 2px;
  
  background: #000000;
  
  

}

#line99 {
  position: absolute;
  left: 199px;
  top: 200px;
  width: 2px;
  height: 16.5px;
  
  background: #000000;
  
  

}

#line95 {
  position: absolute;
  left: 121.2px;
  top: 284px;
  width: 2px;
  height: 15px;
  
  background: #000000;
  
  

}

#line114 {
  position: absolute;
  left: 316.7px;
  top: 448.5px;
  width: 2px;
  height: 51.5px;
  
  background: #000000;
  
  

}

#line112 {
  position: absolute;
  left: 326.5px;
  top: 500px;
  width: 2px;
  height: 53.5px;
  
  background: #000000;
  
  

}

#line8 {
  position: absolute;
  left: 228.2px;
  top: 491.5px;
  width: 2px;
  height: 23px;
  
  background: #000000;
  
  

}

#line6 {
  position: absolute;
  left: 399px;
  top: 300px;
  width: 2px;
  height: 254.5px;
  
  background: #000000;
  
  

}

#line135 {
  position: absolute;
  left: 400px;
  top: 198px;
  width: 100.05px;
  height: 2px;
  
  background: #000000;
  
  

}

#line119 {
  position: absolute;
  left: 295.5px;
  top: 230.5px;
  width: 134px;
  height: 2px;
  
  background: #000000;
  
  

}

#line128 {
  position: absolute;
  left: 307.5px;
  top: 149.5px;
  width: 39.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line121 {
  position: absolute;
  left: 229.2px;
  top: 230.5px;
  width: 49.3px;
  height: 2px;
  
  background: #000000;
  
  

}

#line9 {
  position: absolute;
  left: 229px;
  top: 299px;
  width: 77.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line5 {
  position: absolute;
  left: 324.5px;
  top: 299px;
  width: 275.5px;
  height: 2px;
  
  background: #000000;
  
  

}

#line18 {
  position: absolute;
  left: 445.5px;
  top: 454.5px;
  width: 2px;
  height: 296px;
  
  background: #000000;
  
  

}

#line23 {
  position: absolute;
  left: 599px;
  top: 900px;
  width: 2px;
  height: 299.5px;
  
  background: #000000;
  
  

}


#line21 {
  position: absolute;
  left: 300px;
  top: 899px;
  width: 300px;
  height: 2px;
  
  background: #000000;
  
  

}

#line20 {
  position: absolute;
  left: 649.2px;
  top: 750.5px;
  width: 2px;
  height: 449.5px;
  
  background: #000000;
  
  

}

#line19 {
  position: absolute;
  left: 446.5px;
  top: 749.5px;
  width: 203.7px;
  height: 2px;
  
  background: #000000;
  
  

}

#line17 {
  position: absolute;
  left: 446.5px;
  top: 453.5px;
  width: 203.7px;
  height: 2px;
  
  background: #000000;
  
  

}

#line16 {
  position: absolute;
  left: 650px;
  top: 0px;
  width: 2px;
  height: 454.5px;
  
  background: #000000;
  
  

}

#line4 {
  position: absolute;
  left: 599px;
  top: 0px;
  width: 2px;
  height: 300px;
  
  background: #000000;
  
  

}

#line149 {
  position: absolute;
  left: -1px;
  top: -1px;
  width: 653px;
  height: 2px;
  
  background: #000000;
  
  

}




</style>