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
    
    
    

    let lines = Array.from({ length: 87 }, (_, i) => i + 1);
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

#line87 {
  position: absolute;
  left: 420.49px;
  top: 1076.9px;
  width: 79.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line37 {
  position: absolute;
  left: 236.5px;
  top: 359.5px;
  width: 2px;
  height: 40.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line36 {
  position: absolute;
  left: 236.5px;
  top: 273.5px;
  width: 2px;
  height: 67px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line45 {
  position: absolute;
  left: 520.5px;
  top: 199px;
  width: 79.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line46 {
  position: absolute;
  left: 519.5px;
  top: 200px;
  width: 2px;
  height: 33px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line44 {
  position: absolute;
  left: 488.5px;
  top: 233.35px;
  width: 33px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line74 {
  position: absolute;
  left: 238px;
  top: 1000px;
  width: 43.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line73 {
  position: absolute;
  left: 238.5px;
  top: 1076.95px;
  width: 41px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line72 {
  position: absolute;
  left: 237.5px;
  top: 1001px;
  width: 2px;
  height: 76.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line86 {
  position: absolute;
  left: 399.5px;
  top: 1076.7px;
  width: 4.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line85 {
  position: absolute;
  left: 400px;
  top: 999px;
  width: 4.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line80 {
  position: absolute;
  left: 295.5px;
  top: 1000px;
  width: 14px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line88 {
  position: absolute;
  left: 308.5px;
  top: 965.1px;
  width: 2px;
  height: 6.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line71 {
  position: absolute;
  left: 279.5px;
  top: 1001px;
  width: 2px;
  height: 13.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line70 {
  position: absolute;
  left: 279px;
  top: 1066.4px;
  width: 2px;
  height: 11.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line50 {
  position: absolute;
  left: 236.5px;
  top: 121px;
  width: 43px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line49 {
  position: absolute;
  left: 237px;
  top: 200px;
  width: 42.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line40 {
  position: absolute;
  left: 237.5px;
  top: 232.4px;
  width: 46.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line41 {
  position: absolute;
  left: 236.5px;
  top: 233.4px;
  width: 2px;
  height: 26.1px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line39 {
  position: absolute;
  left: 300px;
  top: 232.39px;
  width: 142.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line35 {
  position: absolute;
  left: 237.5px;
  top: 299px;
  width: 62.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line34 {
  position: absolute;
  left: 237.5px;
  top: 399px;
  width: 62.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line48 {
  position: absolute;
  left: 236.5px;
  top: 122px;
  width: 2px;
  height:80px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line38 {
  position: absolute;
  left: 277.5px;
  top: 234.5px;
  width: 2px;
  height: 65.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line42 {
  position: absolute;
  left: 464.9px;
  top: 234.5px;
  width: 2px;
  height: 65.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line33 {
  position: absolute;
  left: 323px;
  top: 233.5px;
  width: 2px;
  height: 66.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line43 {
  position: absolute;
  left: 462px;
  top: 232.4px;
  width: 7.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line52 {
  position: absolute;
  left: 277.5px;
  top: 122px;
  width: 2px;
  height: 13.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line51 {
  position: absolute;
  left: 277.5px;
  top: 188.5px;
  width: 2px;
  height: 11.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line47 {
  position: absolute;
  left: 307px;
  top: 225.5px;
  width: 2px;
  height: 7.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line59 {
  position: absolute;
  left: 236.5px;
  top: 454px;
  width: 2px;
  height: 28.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line67 {
  position: absolute;
  left: 236.5px;
  top: 938.5px;
  width: 2px;
  height: 28px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line68 {
  position: absolute;
  left: 277px;
  top: 900.6px;
  width: 2px;
  height: 65px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line65 {
  position: absolute;
  left: 236.5px;
  top: 860.5px;
  width: 2px;
  height: 63px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line64 {
  position: absolute;
  left: 236.5px;
  top: 751.5px;
  width: 2px;
  height: 84px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line63 {
  position: absolute;
  left: 236.5px;
  top: 698.3px;
  width: 2px;
  height: 31.7px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line61 {
  position: absolute;
  left: 236.5px;
  top: 648.3px;
  width: 2px;
  height: 31.7px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line60 {
  position: absolute;
  left: 236.5px;
  top: 522.5px;
  width: 2px;
  height: 34px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line58 {
  position: absolute;
  left: 236.5px;
  top: 494px;
  width: 2px;
  height: 14px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line56 {
  position: absolute;
  left: 299px;
  top: 420px;
  width: 2px;
  height: 14px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line32 {
  position: absolute;
  left: 300px;
  top: 299px;
  width: 10px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line53 {
  position: absolute;
  left: 299px;
  top: 446.5px;
  width: 2px;
  height: 108px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line31 {
  position: absolute;
  left: 299px;
  top: 300px;
  width: 2px;
  height: 105.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line30 {
  position: absolute;
  left: 599px;
  top: 900px;
  width: 2px;
  height: 299.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line29 {
  position: absolute;
  left: 237.5px;
  top: 899px;
  width: 362.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line28 {
  position: absolute;
  left: 299px;
  top: 648px;
  width: 2px;
  height: 251.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#stairsIcon1 {
  position: absolute;
  left: 308px;
  top: 626px;
  width: 20px;
  height: 20px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#stairsIcon2 {
  position: absolute;
  left: 308px;
  top: 557px;
  width: 20px;
  height: 20px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#stairsIcon3 {
  position: absolute;
  left: 366px;
  top: 592px;
  width: 20px;
  height: 20px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
}

#elevator3 {
  position: absolute;
  left: 307px;
  top: 570px;
  width: 60px;
  height: 60px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00008deg);
}

#line27 {
  position: absolute;
  left: 388px;
  top: 556px;
  width: 2px;
  height: 92.3px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line26 {
  position: absolute;
  left: 299px;
  top: 556px;
  width: 2px;
  height: 94.3px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line25 {
  position: absolute;
  left: 271px;
  top: 609.3px;
  width: 2px;
  height: 39px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line24 {
  position: absolute;
  left: 271px;
  top: 555.2px;
  width: 2px;
  height: 33px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line23 {
  position: absolute;
  left: 237.5px;
  top: 648.28px;
  width: 151.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line57 {
  position: absolute;
  left: 300px;
  top: 426.7px;
  width: 100px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line69 {
  position: absolute;
  left: 393.5px;
  top: 963.5px;
  width: 6.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line66 {
  position: absolute;
  left: 237.5px;
  top: 964.5px;
  width: 143px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line62 {
  position: absolute;
  left: 237.5px;
  top: 800px;
  width: 62.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line55 {
  position: absolute;
  left: 237.5px;
  top: 453px;
  width: 62.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line54 {
  position: absolute;
  left: 237.5px;
  top: 499px;
  width: 62.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line22 {
  position: absolute;
  left: 237.5px;
  top: 554.5px;
  width: 162.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line21 {
  position: absolute;
  left: 399px;
  top: 300px;
  width: 2px;
  height: 254.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line20 {
  position: absolute;
  left: 324px;
  top: 299px;
  width: 275.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line19 {
  position: absolute;
  left: 599px;
  top: 0.5px;
  width: 2px;
  height: 299.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line84 {
  position: absolute;
  left: 427px;
  top: 1001px;
  width: 2px;
  height: 76px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line82 {
  position: absolute;
  left: 420.49px;
  top: 999px;
  width: 79.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line81 {
  position: absolute;
  left: 499px;
  top: 1000px;
  width: 2px;
  height: 78px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line18 {
  position: absolute;
  left: 427px;
  top: 123px;
  width: 2px;
  height: 75px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line17 {
  position: absolute;
  left: 420.49px;
  top: 198px;
  width: 80px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line16 {
  position: absolute;
  left: 420.49px;
  top: 121px;
  width: 80px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line15 {
  position: absolute;
  left: 499px;
  top: 123px;
  width: 2px;
  height: 76px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line79 {
  position: absolute;
  left: 297.5px;
  top: 1077.8px;
  width: 102px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#stairsIcon4 {
    position: absolute;
  left: 356.5px;
  top: 1018.05px;
  width: 23.05px;
  height: 23.05px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00001deg);
}

#stairsIcon5 {
    position: absolute;
  left: 376.95px;
  top: 1057.4px;
  width: 23.05px;
  height: 23.05px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1) rotate(0.00013056048deg);
}

#elevator2 {
  position: absolute;
  left: 307px;
  top: 1003px;
  width: 45px;
  height: 45px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
}

#line78 {
  position: absolute;
  left: 399px;
  top: 964px;
  width: 2px;
  height: 116px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line77 {
  position: absolute;
  left: 348.5px;
  top: 1001px;
  width: 2px;
  height: 76.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line76 {
  position: absolute;
  left: 308.5px;
  top: 995.5px;
  width: 2px;
  height: 82.3px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line75 {
  position: absolute;
  left: 310px;
  top: 1052px;
  width: 39.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line14 {
  position: absolute;
  left: 307px;
  top: 121px;
  width: 98px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#stairsIcon6 {
  position: absolute;
  left: 351.45px;
  top: 142.4px;
  width: 23.05px;
  height: 23.05px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: rotate(90deg);
}

#stairsIcon7 {
  position: absolute;
  left: 371.45px;
  top: 182.4px;
  width: 23.05px;
  height: 23.05px;
  background:  url("/floorPlan-icons/stairsV2.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#elevator1 {
    position: absolute;
  left: 305.7px;
  top: 155px;
  width: 45px;
  height: 45px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(5.960163E-08deg);
}

#line13 {
  position: absolute;
  left: 399px;
  top: 122px;
  width: 2px;
  height: 76.87px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line12 {
  position: absolute;
  left: 348.62px;
  top: 122px;
  width: 2px;
  height: 76.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line11 {
  position: absolute;
  left: 307px;
  top: 123px;
  width: 2px;
  height: 83.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line10 {
  position: absolute;
  left: 307px;
  top: 148px;
  width: 41px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line9 {
  position: absolute;
  left: 199px;
  top: 0px;
  width: 2px;
  height: 1200px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}



</style>