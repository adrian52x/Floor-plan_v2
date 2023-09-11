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
    
    
    

    let lines = Array.from({ length: 20 }, (_, i) => i + 1);    

    
    
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


  {#each lines as wall}
      <div class="z-10" id="line{wall}"/>
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
                        ${searchData?.find(data => data.roomName === room.name) ? 'bg-red-300' : ''}
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
  background: rgba(228, 102, 102, 0.19);
}


#line1 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 652px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
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


#line4 {
  position: absolute;
  left: 650px;
  top: 0px;
  width: 2px;
  height: 454.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line5 {
  position: absolute;
  left: 446.5px;
  top: 453.5px;
  width: 203.7px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line6 {
  position: absolute;
  left: 445.5px;
  top: 454.5px;
  width: 2px;
  height: 296px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line7 {
  position: absolute;
  left: 446.5px;
  top: 749.5px;
  width: 203.7px;
  height: 2px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line8 {
  position: absolute;
  left: 649.2px;
  top: 750.5px;
  width: 2px;
  height: 449.5px;
  
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}



</style>