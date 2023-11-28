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
  
  
  // before update last line 127    
  let lines = Array.from({ length: 141 }, (_, i) => i + 1);    
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
      <SidebarRight roomData = {roomData} {instruments} {PCs} {netWorkPorts} onClose={closeRightSideBar} isLoading={!dataReceived} errorMessage={errorMessage} {searchData}/>
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

#stairsIcon1 {
  position: absolute;
  left: 164.6px;
  top: 440px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon2 {
  position: absolute;
  left: 155px;
  top: 407px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#stairsIcon3 {
  position: absolute;
  left: 914.8px;
  top: 753.2px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon4 {
  position: absolute;
  left: 903.8px;
  top: 720.2px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#stairsIcon5 {
  position: absolute;
  left: 158px;
  top: 1001px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(0.00013022845deg);
}

#stairsIcon6 {
  position: absolute;
  left: 190.2px;
  top: 1015px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon7 {
  position: absolute;
  left: 865.5px;
  top: 152px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(-0.00013022845deg);
}

#stairsIcon8 {
  position: absolute;
  left: 905.5px;
  top: 165px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#elevator1 {
  position: absolute;
  left: 800.5px;
  top: 738.4px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90.00008deg);
}

#elevator2 {
  position: absolute;
  left: 800.5px;
  top: 765.8px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90.00008deg);
}

#elevator3 {
  position: absolute;
  left: 260px;
  top: 420.8px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00008deg);
}

#elevator4 {
  position: absolute;
  left: 260px;
  top: 394px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00008deg);
}

#line1 {
  position: absolute;
  left: 201px;
  top: 0px;
  width: 898px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line2 {
  position: absolute;
  left: 201.13px;
  top: 1px;
  width: 2px;
  height: 408px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line3 {
  position: absolute;
  left: 1098px;
  top: 0px;
  width: 2px;
  height: 799.67px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line4 {
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

#line6 {
  position: absolute;
  left: 1px;
  top: 399.33px;
  width: 200.14px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line7 {
  position: absolute;
  left: 898.37px;
  top: 789.67px;
  width: 2px;
  height: 410px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line8 {
  position: absolute;
  left: 899.36px;
  top: 798.67px;
  width: 199.64px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line9 {
  position: absolute;
  left: 151.6px;
  top: 400px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line10 {
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

#line12 {
  position: absolute;
  left: 299px;
  top: 300px;
  width: 2px;
  height: 600px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line13 {
  position: absolute;
  left: 300px;
  top: 900px;
  width: 500px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line14 {
  position: absolute;
  left: 201px;
  top: 420px;
  width: 2px;
  height: 80px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line15 {
  position: absolute;
  left: 151.5px;
  top: 499px;
  width: 68px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line16 {
  position: absolute;
  left: 200px;
  top: 399.3px;
  width: 20px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line17 {
  position: absolute;
  left: 240px;
  top: 399.3px;
  width: 59px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line18 {
  position: absolute;
  left: 240px;
  top: 499px;
  width: 60px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line19 {
  position: absolute;
  left: 260.5px;
  top: 400px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line20 {
  position: absolute;
  left: 898px;
  top: 700px;
  width: 2px;
  height: 80px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line21 {
  position: absolute;
  left: 880.5px;
  top: 699px;
  width: 19px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line22 {
  position: absolute;
  left: 800.5px;
  top: 699px;
  width: 65px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line23 {
  position: absolute;
  left: 800.5px;
  top: 799px;
  width: 65px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line24 {
  position: absolute;
  left: 839px;
  top: 700.5px;
  width: 2px;
  height: 99.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line25 {
  position: absolute;
  left: 261.5px;
  top: 453.5px;
  width: 38.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line26 {
  position: absolute;
  left: 800.5px;
  top: 742.5px;
  width: 39px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line27 {
  position: absolute;
  left: 900px;
  top: 713.5px;
  width: 51.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line28 {
  position: absolute;
  left: 950.5px;
  top: 685px;
  width: 2px;
  height: 115px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}
 /* all default until here */

#line29 {
  position: absolute;
  left: 632.5px;
  top: 999px;
  width: 167.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line30 {
  position: absolute;
  left: 800px;
  top: 999px;
  width: 2px;
  height: 70px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line31 {
  position: absolute;
  left: 632.5px;
  top: 1098px;
  width: 167.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line32 {
  position: absolute;
  left: 699.5px;
  top: 1000px;
  width: 2px;
  height: 99px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line33 {
  position: absolute;
  left: 700px;
  top: 1054.5px;
  width: 100.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line34 {
  position: absolute;
  left: 800px;
  top: 1085px;
  width: 2px;
  height: 15px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line35 {
  position: absolute;
  left: 264.5px;
  top: 1000px;
  width: 2px;
  height: 99.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line36 {
  position: absolute;
  left: 150.5px;
  top: 1098.5px;
  width: 115px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line37 {
  position: absolute;
  left: 149.5px;
  top: 1000px;
  width: 2px;
  height: 99.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line38 {
  position: absolute;
  left: 149.5px;
  top: 999px;
  width: 117px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line39 {
  position: absolute;
  left: 150.5px;
  top: 1062px;
  width: 115px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line40 {
  position: absolute;
  left: 226.5px;
  top: 1000px;
  width: 2px;
  height: 63px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line41 {
  position: absolute;
  left: 149.5px;
  top: 899px;
  width: 103px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line42 {
  position: absolute;
  left: 249.5px;
  top: 900px;
  width: 2px;
  height: 73.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line43 {
  position: absolute;
  left: 149.5px;
  top: 972.5px;
  width: 102px;      
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line44 {
  position: absolute;
  left: 149.5px;
  top: 900px;
  width: 2px;
  height: 73.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line45 {
  position: absolute;
  left: 199px;
  top: 900px;
  width: 2px;
  height: 73.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line46 {
  position: absolute;
  left: 200px;
  top: 935.8px;
  width: 50.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line47 {
  position: absolute;
  left: 843px;
  top: 112px;
  width: 2px;
  height: 94px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line48 {
  position: absolute;
  left: 951.5px;
  top: 112px;
  width: 2px;
  height: 94px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line49 {
  position: absolute;
  left: 843px;
  top: 110.5px;
  width: 110px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line50 {
  position: absolute;
  left: 844px;
  top: 150px;
  width: 108.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line51 {
  position: absolute;
  left: 843px;
  top: 199px;
  width: 110px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line52 {
  position: absolute;
  left: 844px;
  top: 222.5px;
  width: 108.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line53 {
  position: absolute;
  left: 843px;
  top: 218px;
  width: 2px;
  height: 82px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line54 {
  position: absolute;
  left: 844px;
  top: 299px;
  width: 108.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line55 {
  position: absolute;
  left: 951.5px;
  top: 218px;
  width: 2px;
  height: 82px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line56 {
  position: absolute;
  left: 899px;
  top: 224.5px;
  width: 2px;
  height: 75.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line57 {
  position: absolute;
  left: 844px;
  top: 261.2px;
  width: 56px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line58 {
  position: absolute;
  left: 300px;
  top: 148px;
  width: 160px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line59 {
  position: absolute;
  left: 300px;
  top: 199px;
  width: 100px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line60 {
  position: absolute;
  left: 299px;
  top: 148px;
  width: 2px;
  height: 88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line61 {
  position: absolute;
  left: 399px;
  top: 148px;
  width: 2px;
  height: 88px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line62 {
  position: absolute;
  left: 338px;
  top: 199px;
  width: 2px;
  height: 36.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line63 {
  position: absolute;
  left: 300px;
  top: 235px;
  width: 60px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line64 {
  position: absolute;
  left: 380px;
  top: 235px;
  width: 115px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

/* defaults until here floor 3 vs 4 */

#line65 {
  position: absolute;
  left: 987px;
  top: 52.98px;
  width: 39.97px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line66 {
  position: absolute;
  left: 1026px;
  top: 1.63px;
  width: 2px;
  height: 52.37px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line67 {
  position: absolute;
  left: 986px;
  top: 1.63px;
  width: 2px;
  height: 52.37px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line68 {
  position: absolute;
  left: 749px;
  top: 153px;
  width: 49.52px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line69 {
  position: absolute;
  left: 748px;
  top: 112px;
  width: 2px;
  height: 88.94px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line70 {
  position: absolute;
  left: 699px;
  top: 169px;
  width: 49.52px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line71 {
  position: absolute;
  left: 699px;
  top: 111px;
  width: 100.08px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line72 {
  position: absolute;
  left: 699px;
  top: 200px;
  width: 100.08px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line73 {
  position: absolute;
  left: 798px;
  top: 112px;
  width: 2px;
  height: 88.84px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line74 {
  position: absolute;
  left: 698px;
  top: 112px;
  width: 2px;
  height: 89.02px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line75 {
  position: absolute;
  left: 727px;
  top: 76.64px;
  width: 49.93px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line76 {
  position: absolute;
  left: 776px;
  top: 1.46px;
  width: 2px;
  height: 76.18px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line77 {
  position: absolute;
  left: 726px;
  top: 1px;
  width: 2px;
  height: 76.54px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line78 {
  position: absolute;
  left: 549.09px;
  top: 111px;
  width: 2px;
  height: 35.87px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line79 {
  position: absolute;
  left: 500px;
  top: 146px;
  width: 100.08px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line80 {
  position: absolute;
  left: 500px;
  top: 110px;
  width: 100.08px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line81 {
  position: absolute;
  left: 500px;
  top: 199px;
  width: 100.08px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line82 {
  position: absolute;
  left: 599px;
  top: 111.16px;
  width: 2px;
  height: 88.84px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line83 {
  position: absolute;
  left: 499px;
  top: 110.98px;
  width: 2px;
  height: 89.02px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line84 {
  position: absolute;
  left: 471px;
  top: 1px;
  width: 2px;
  height: 76.54px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line85 {
  position: absolute;
  left: 421px;
  top: 1.46px;
  width: 2px;
  height: 95px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line96 {
  position: absolute;
  left: 421px;
  top: 115px;
  width: 2px;
  height: 35px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line86 {
  position: absolute;
  left: 374px;
  top: 1px;
  width: 2px;
  height: 76.54px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line87 {
  position: absolute;
  left: 330px;
  top: 1.46px;
  width: 2px;
  height: 76.06px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line88 {
  position: absolute;
  left: 287px;
  top: 1px;
  width: 2px;
  height: 75.86px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line89 {
  position: absolute;
  left: 200px;
  top: 128px;
  width: 62.82px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line90 {
  position: absolute;
  left: 200px;
  top: 228px;
  width: 62.82px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line91 {
  position: absolute;
  left: 200px;
  top: 180px;
  width: 62.82px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line92 {
  position: absolute;
  left: 520.41px;
  top: 1px;
  width: 2px;
  height: 76.54px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line93 {
  position: absolute;
  left: 200px;
  top: 76.59px;
  width: 321.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line94 {
  position: absolute;
  left: 262.81px;
  top: 78.39px;
  width: 2px;
  height: 267.24px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line95 {
  position: absolute;
  left: 200px;
  top: 311.35px;
  width: 62.82px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}


/* all north meetings rooms until here*/

#line96 {
  position: absolute;
  left: 143px;
  top: 600px;
  width: 2px;
  height: 55.55px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line97 {
  position: absolute;
  left: 154.12px;
  top: 549px;
  width: 2px;
  height: 50.69px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line98 {
  position: absolute;
  left: 199px;
  top: 549px;
  width: 2px;
  height: 107.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line99 {
  position: absolute;
  left: 109.18px;
  top: 549px;
  width: 2px;
  height: 107.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line100 {
  position: absolute;
  left: 110px;
  top: 548px;
  width: 90.04px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line101 {
  position: absolute;
  left: 110px;
  top: 655px;
  width: 90.04px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line102 {
  position: absolute;
  left: 109.96px;
  top: 599px;
  width: 90.04px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line103 {
  position: absolute;
  left: 0px;
  top: 722px;
  width: 67.19px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line104 {
  position: absolute;
  left: 0px;
  top: 775px;
  width: 67.19px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line105 {
  position: absolute;
  left: 66px;
  top: 722.93px;
  width: 2px;
  height: 53.07px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line106 {
  position: absolute;
  left: 199px;
  top: 733px;
  width: 2px;
  height: 67.19px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line107 {
  position: absolute;
  left: 109.14px;
  top: 733px;
  width: 2px;
  height: 67.19px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line108 {
  position: absolute;
  left: 110px;
  top: 732px;
  width: 90.05px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line109 {
  position: absolute;
  left: 109.95px;
  top: 799.14px;
  width: 90.05px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line110 {
  position: absolute;
  left: 223px;
  top: 1129.86px;
  width: 49.25px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line111 {
  position: absolute;
  left: 271px;
  top: 1131px;
  width: 2px;
  height: 68.06px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line112 {
  position: absolute;
  left: 221.57px;
  top: 1130.95px;
  width: 2px;
  height: 68.06px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line113 {
  position: absolute;
  left: 550.04px;
  top: 1049px;
  width: 49.96px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line114 {
  position: absolute;
  left: 500px;
  top: 1038px;
  width: 49.96px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line115 {
  position: absolute;
  left: 548.88px;
  top: 1000.24px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line116 {
  position: absolute;
  left: 500px;
  top: 999px;
  width: 99.88px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line117 {
  position: absolute;
  left: 500px;
  top: 1098px;
  width: 99.88px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line118 {
  position: absolute;
  left: 400px;
  top: 1098px;
  width: 64px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line119 {
  position: absolute;
  left: 400px;
  top: 999.15px;
  width: 64px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line120 {
  position: absolute;
  left: 463px;
  top: 1000px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line121 {
  position: absolute;
  left: 399px;
  top: 1000px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line122 {
  position: absolute;
  left: 499px;
  top: 1000px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line123 {
  position: absolute;
  left: 598.82px;
  top: 1000px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line124 {
  position: absolute;
  left: 951px;
  top: 685px;
  width: 32px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line125 {
  position: absolute;
  left: 951px;
  top: 734px;
  width: 32px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line126 {
  position: absolute;
  left: 982.67px;
  top: 675px;
  width: 2px;
  height: 60.1px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line127 {
  position: absolute;
  left: 1023.5px;
  top: 624.99px;
  width: 2px;
  height: 49.68px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line128 {
  position: absolute;
  left: 1024.33px;
  top: 624px;
  width: 75.67px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line129 {
  position: absolute;
  left: 1001.33px;
  top: 674px;
  width: 98.67px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line130 {
  position: absolute;
  left: 943px;
  top: 450.83px;
  width: 2px;
  height: 49.17px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line131 {
  position: absolute;
  left: 931px;
  top: 401px;
  width: 2px;
  height: 49.17px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line132 {
  position: absolute;
  left: 899px;
  top: 400.83px;
  width: 2px;
  height: 99.17px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line133 {
  position: absolute;
  left: 986.8px;
  top: 400px;
  width: 2px;
  height: 99.17px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line134 {
  position: absolute;
  left: 900px;
  top: 449px;
  width: 87.97px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line135 {
  position: absolute;
  left: 900px;
  top: 499px;
  width: 87.97px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line136 {
  position: absolute;
  left: 900px;
  top: 399px;
  width: 87.97px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line137 {
  position: absolute;
  left: 872.15px;
  top: 300px;
  width: 2px;
  height: 88.1px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line138 {
  position: absolute;
  left: 986.82px;
  top: 266px;
  width: 2px;
  height: 104.37px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line139 {
  position: absolute;
  left: 200px;
  top: 799px;
  width: 27.17px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line140 {
  position: absolute;
  left: 226.39px;
  top: 800px;
  width: 2px;
  height: 61.94px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line141 {
  position: absolute;
  left: 109.53px;
  top: 828px;
  width: 2px;
  height: 119.35px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}




</style>

