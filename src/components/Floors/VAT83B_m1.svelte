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
    
    
    

    let lines = Array.from({ length: 188 }, (_, i) => i + 1);
    let stairs = Array.from({ length: 7 }, (_, i) => i + 1);    
    let elevators = Array.from({ length: 4 }, (_, i) => i + 1);      

    
    
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

#elevator2 {
  position: absolute;
  left: 307px;
  top: 1003px;
  width: 45px;
  height: 45px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
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
  transform: rotate(90deg);
}

#line27 {
  position: absolute;
  left: 420.49px;
  top: 1076.9px;
  width: 79.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line26 {
  position: absolute;
  left: 399.5px;
  top: 1076.7px;
  width: 4.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line25 {
  position: absolute;
  left: 388px;
  top: 556px;
  width: 2px;
  height: 92.3px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line24 {
  position: absolute;
  left: 299px;
  top: 556px;
  width: 2px;
  height: 91.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line23 {
  position: absolute;
  left: 300.22px;
  top: 647.11px;
  width: 88.78px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line22 {
  position: absolute;
  left: 299.9px;
  top: 553.88px;
  width: 89.16px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line21 {
  position: absolute;
  left: 400px;
  top: 999px;
  width: 4.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line20 {
  position: absolute;
  left: 427px;
  top: 1001px;
  width: 2px;
  height: 75px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line19 {
  position: absolute;
  left: 420.49px;
  top: 999px;
  width: 79.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line18 {
  position: absolute;
  left: 427.1px;
  top: 123.4px;
  width: 2px;
  height: 75px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line17 {
  position: absolute;
  left: 420.49px;
  top: 198px;
  width: 79.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line16 {
  position: absolute;
  left: 420.49px;
  top: 121px;
  width: 79.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line15 {
  position: absolute;
  left: 499px;
  top: 123.5px;
  width: 2px;
  height: 75px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line14 {
  position: absolute;
  left: 300px;
  top: 1077.8px;
  width: 99.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line13 {
  position: absolute;
  left: 398.69px;
  top: 1000.25px;
  width: 2px;
  height: 77.62px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line12 {
  position: absolute;
  left: 348.5px;
  top: 1001px;
  width: 2px;
  height: 76.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line11 {
  position: absolute;
  left: 308.5px;
  top: 999.88px;
  width: 2px;
  height: 77.93px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line10 {
  position: absolute;
  left: 310px;
  top: 1052px;
  width: 39.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line9 {
  position: absolute;
  left: 310px;
  top: 121px;
  width: 95.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line8 {
  position: absolute;
  left: 399px;
  top: 122px;
  width: 2px;
  height: 76.87px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line7 {
  position: absolute;
  left: 348.62px;
  top: 122px;
  width: 2px;
  height: 76.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line6 {
  position: absolute;
  left: 309px;
  top: 123px;
  width: 2px;
  height: 83.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line5 {
  position: absolute;
  left: 310px;
  top: 144px;
  width: 39.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line4 {
  position: absolute;
  left: 800px;
  top: 0;
  width: 2px;
  height: 1199.98px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line3 {
  position: absolute;
  left: 0px;
  top: 1199.08px;
  width: 800px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line2 {
  position: absolute;
  left: -1px;
  top: 0px;
  width: 2px;
  height: 1199.94px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line1 {
  position: absolute;
  left: 0px;
  top: -1px;
  width: 800px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}


#line48 {
  position: absolute;
  left: 65px;
  top: 232.72px;
  width: 2px;
  height: 17.28px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line47 {
  position: absolute;
  left: 65.11px;
  top: 200px;
  width: 2px;
  height: 17.28px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line36 {
  position: absolute;
  left: 279.99px;
  top: 93px;
  width: 2px;
  height: 64.8px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line31 {
  position: absolute;
  left: 300px;
  top: 0.5px;
  width: 2px;
  height: 92.8px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line84 {
  position: absolute;
  left: 99px;
  top: 450px;
  width: 2px;
  height: 34.6px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line80 {
  position: absolute;
  left: 47px;
  top: 316px;
  width: 2px;
  height: 99.81px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line77 {
  position: absolute;
  left: 153px;
  top: 400px;
  width: 2px;
  height: 99.81px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line63 {
  position: absolute;
  left: 99px;
  top: 250px;
  width: 2px;
  height: 149.08px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line62 {
  position: absolute;
  left: 250px;
  top: 250px;
  width: 2px;
  height: 249.04px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line61 {
  position: absolute;
  left: 399px;
  top: 249.96px;
  width: 2px;
  height: 249.04px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line60 {
  position: absolute;
  left: 499px;
  top: 249.96px;
  width: 2px;
  height: 249.04px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line65 {
  position: absolute;
  left: 699px;
  top: 251.52px;
  width: 2px;
  height: 98.48px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line64 {
  position: absolute;
  left: 650px;
  top: 250.96px;
  width: 2px;
  height: 98.48px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line59 {
  position: absolute;
  left: 599px;
  top: 250px;
  width: 2px;
  height: 249.04px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line123 {
  position: absolute;
  left: 749px;
  top: 710.04px;
  width: 2px;
  height: 38.96px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line122 {
  position: absolute;
  left: 749px;
  top: 568.25px;
  width: 2px;
  height: 116.92px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line69 {
  position: absolute;
  left: 749px;
  top: 454.25px;
  width: 2px;
  height: 81.29px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line68 {
  position: absolute;
  left: 749px;
  top: 384.82px;
  width: 2px;
  height: 50.18px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line57 {
  position: absolute;
  left: 749.1px;
  top: 309px;
  width: 2px;
  height: 54.6px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line56 {
  position: absolute;
  left: 749px;
  top: 250px;
  width: 2px;
  height: 37.24px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line42 {
  position: absolute;
  left: 734.95px;
  top: 1px;
  width: 2px;
  height: 197.87px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line41 {
  position: absolute;
  left: 649.62px;
  top: -0px;
  width: 2px;
  height: 198.27px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line38 {
  position: absolute;
  left: 599.01px;
  top: 93.93px;
  width: 2px;
  height: 105.01px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line30 {
  position: absolute;
  left: 599px;
  top: 0.7px;
  width: 2px;
  height: 77.07px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line28 {
  position: absolute;
  left: 250.28px;
  top: 0.53px;
  width: 2px;
  height: 199.37px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line50 {
  position: absolute;
  left: 161px;
  top: 248.76px;
  width: 160.69px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line67 {
  position: absolute;
  left: 537.89px;
  top: 498.91px;
  width: 211.95px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line76 {
  position: absolute;
  left: 139.75px;
  top: 399px;
  width: 13.93px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line79 {
  position: absolute;
  left: 1px;
  top: 292.92px;
  width: 53.09px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line75 {
  position: absolute;
  left: 100px;
  top: 399px;
  width: 21.25px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line83 {
  position: absolute;
  left: 28.54px;
  top: 340.1px;
  width: 19.26px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line82 {
  position: absolute;
  left: 0.98px;
  top: 415.05px;
  width: 46.8px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line81 {
  position: absolute;
  left: 1px;
  top: 449px;
  width: 99.02px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line92 {
  position: absolute;
  left: 150px;
  top: 622px;
  width: 101.08px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line74 {
  position: absolute;
  left: 188.59px;
  top: 499px;
  width: 115.58px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line73 {
  position: absolute;
  left: 321.32px;
  top: 499px;
  width: 114.17px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line141 {
  position: absolute;
  left: 399px;
  top: 988.64px;
  width: 2px;
  height: 11.36px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line140 {
  position: absolute;
  left: 399px;
  top: 948px;
  width: 2px;
  height: 11.36px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line145 {
  position: absolute;
  left: 110px;
  top: 986.72px;
  width: 2px;
  height: 13.28px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line144 {
  position: absolute;
  left: 110px;
  top: 948px;
  width: 2px;
  height: 13.28px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line129 {
  position: absolute;
  left: 199.02px;
  top: 749px;
  width: 2px;
  height: 50.7px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line155 {
  position: absolute;
  left: 550px;
  top: 1000px;
  width: 2px;
  height: 199.74px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line176 {
  position: absolute;
  left: 749px;
  top: 907.57px;
  width: 2px;
  height: 40.43px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line174 {
  position: absolute;
  left: 748.89px;
  top: 833px;
  width: 2px;
  height: 55.95px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line167 {
  position: absolute;
  left: 749px;
  top: 749px;
  width: 2px;
  height: 68.28px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line152 {
  position: absolute;
  left: 550.12px;
  top: 794.26px;
  width: 2px;
  height: 153.74px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line133 {
  position: absolute;
  left: 450.5px;
  top: 763.5px;
  width: 2px;
  height: 184.48px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line188 {
  position: absolute;
  left: 349px;
  top: 0.58px;
  width: 2px;
  height: 121.42px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line186 {
  position: absolute;
  left: 57px;
  top: 1000px;
  width: 2px;
  height: 49.64px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line185 {
  position: absolute;
  left: 154px;
  top: 1160px;
  width: 2px;
  height: 39.59px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line183 {
  position: absolute;
  left: 199px;
  top: 1130px;
  width: 2px;
  height: 29.52px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line182 {
  position: absolute;
  left: 249px;
  top: 1130px;
  width: 2px;
  height: 29.52px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line179 {
  position: absolute;
  left: 249.17px;
  top: 1000px;
  width: 2px;
  height: 64.6px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line178 {
  position: absolute;
  left: 165.07px;
  top: 1000px;
  width: 2px;
  height: 128.73px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line159 {
  position: absolute;
  left: 299px;
  top: 1079.18px;
  width: 2px;
  height: 120.82px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line158 {
  position: absolute;
  left: 348.74px;
  top: 1078.78px;
  width: 2px;
  height: 120.82px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line160 {
  position: absolute;
  left: 399px;
  top: 1078px;
  width: 2px;
  height: 52.34px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line165 {
  position: absolute;
  left: 499.16px;
  top: 1148px;
  width: 2px;
  height: 8.67px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line164 {
  position: absolute;
  left: 499.08px;
  top: 1170.86px;
  width: 2px;
  height: 29.14px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line163 {
  position: absolute;
  left: 443.92px;
  top: 1148px;
  width: 2px;
  height: 51.95px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line157 {
  position: absolute;
  left: 427.23px;
  top: 1078px;
  width: 2px;
  height: 69.92px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line132 {
  position: absolute;
  left: 351px;
  top: 849px;
  width: 2px;
  height: 98.98px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line131 {
  position: absolute;
  left: 296px;
  top: 849px;
  width: 2px;
  height: 98.98px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line130 {
  position: absolute;
  left: 55px;
  top: 749.34px;
  width: 2px;
  height: 98.98px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line128 {
  position: absolute;
  left: 199px;
  top: 826.66px;
  width: 2px;
  height: 120.74px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line94 {
  position: absolute;
  left: 251.08px;
  top: 700px;
  width: 2px;
  height: 48.93px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line93 {
  position: absolute;
  left: 251px;
  top: 646px;
  width: 2px;
  height: 28.59px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line110 {
  position: absolute;
  left: 606.51px;
  top: 553px;
  width: 37.49px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line108 {
  position: absolute;
  left: 568.19px;
  top: 553.91px;
  width: 10.68px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line100 {
  position: absolute;
  left: 524px;
  top: 554px;
  width: 23.66px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line117 {
  position: absolute;
  left: 557.26px;
  top: 747.75px;
  width: 193.05px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line104 {
  position: absolute;
  left: 500px;
  top: 647px;
  width: 57.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line114 {
  position: absolute;
  left: 558px;
  top: 641.9px;
  width: 46.66px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line120 {
  position: absolute;
  left: 605px;
  top: 681px;
  width: 39.11px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line115 {
  position: absolute;
  left: 605px;
  top: 613.05px;
  width: 39.11px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line103 {
  position: absolute;
  left: 540px;
  top: 619px;
  width: 17.1px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line102 {
  position: absolute;
  left: 515.29px;
  top: 611px;
  width: 24.71px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line98 {
  position: absolute;
  left: 459px;
  top: 554px;
  width: 50.73px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line97 {
  position: absolute;
  left: 300px;
  top: 554px;
  width: 135.59px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line96 {
  position: absolute;
  left: 284.49px;
  top: 647px;
  width: 215.18px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line95 {
  position: absolute;
  left: 252px;
  top: 647px;
  width: 15.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line91 {
  position: absolute;
  left: 251px;
  top: 609.74px;
  width: 2px;
  height: 20.26px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line173 {
  position: absolute;
  left: 699px;
  top: 794px;
  width: 2px;
  height: 24.19px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line170 {
  position: absolute;
  left: 585.27px;
  top: 784.91px;
  width: 2px;
  height: 34.18px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line175 {
  position: absolute;
  left: 699px;
  top: 833px;
  width: 2px;
  height: 16.09px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line171 {
  position: absolute;
  left: 585.11px;
  top: 832.91px;
  width: 2px;
  height: 16.09px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line169 {
  position: absolute;
  left: 585px;
  top: 748.71px;
  width: 2px;
  height: 20.76px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line118 {
  position: absolute;
  left: 643px;
  top: 678.28px;
  width: 2px;
  height: 70.72px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line116 {
  position: absolute;
  left: 643px;
  top: 605px;
  width: 2px;
  height: 50.37px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line109 {
  position: absolute;
  left: 642.93px;
  top: 500px;
  width: 2px;
  height: 84.79px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line119 {
  position: absolute;
  left: 604px;
  top: 678px;
  width: 2px;
  height: 15.06px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line113 {
  position: absolute;
  left: 604px;
  top: 640px;
  width: 2px;
  height: 15.06px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line112 {
  position: absolute;
  left: 604.8px;
  top: 604.98px;
  width: 2px;
  height: 18.07px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line111 {
  position: absolute;
  left: 604.1px;
  top: 514.61px;
  width: 2px;
  height: 73.79px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line107 {
  position: absolute;
  left: 573px;
  top: 500px;
  width: 2px;
  height: 54.21px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line106 {
  position: absolute;
  left: 539.07px;
  top: 500px;
  width: 2px;
  height: 15.29px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line105 {
  position: absolute;
  left: 557px;
  top: 632.3px;
  width: 2px;
  height: 15.7px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line101 {
  position: absolute;
  left: 538.86px;
  top: 539.08px;
  width: 2px;
  height: 81.17px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line121 {
  position: absolute;
  left: 535.41px;
  top: 648px;
  width: 2px;
  height: 101.21px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line99 {
  position: absolute;
  left: 499px;
  top: 555px;
  width: 2px;
  height: 93.07px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line90 {
  position: absolute;
  left: 250.95px;
  top: 549px;
  width: 2px;
  height: 40.75px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line89 {
  position: absolute;
  left: 149px;
  top: 549px;
  width: 2px;
  height: 200.14px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line88 {
  position: absolute;
  left: 50px;
  top: 548.86px;
  width: 2px;
  height: 200.14px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line149 {
  position: absolute;
  left: 285.94px;
  top: 999.15px;
  width: 23.39px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line148 {
  position: absolute;
  left: 228.1px;
  top: 999px;
  width: 43.06px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line177 {
  position: absolute;
  left: 0px;
  top: 1128.77px;
  width: 300.21px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line181 {
  position: absolute;
  left: 229.12px;
  top: 1063.98px;
  width: 20.88px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line187 {
  position: absolute;
  left: 1.02px;
  top: 1049px;
  width: 57.16px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line184 {
  position: absolute;
  left: 155.02px;
  top: 1159px;
  width: 44.98px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line180 {
  position: absolute;
  left: 166px;
  top: 1063.66px;
  width: 44.98px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line147 {
  position: absolute;
  left: 90.1px;
  top: 999px;
  width: 120.87px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line146 {
  position: absolute;
  left: 46px;
  top: 999px;
  width: 24.9px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line127 {
  position: absolute;
  left: 0px;
  top: 999px;
  width: 24.9px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line143 {
  position: absolute;
  left: 352px;
  top: 897px;
  width: 57.42px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line139 {
  position: absolute;
  left: 290.46px;
  top: 946.76px;
  width: 118.96px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line138 {
  position: absolute;
  left: 165.81px;
  top: 947.14px;
  width: 94.54px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line126 {
  position: absolute;
  left: 0px;
  top: 946.86px;
  width: 133.87px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line166 {
  position: absolute;
  left: 551px;
  top: 848px;
  width: 198.72px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line153 {
  position: absolute;
  left: 536px;
  top: 947.07px;
  width: 214.2px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line154 {
  position: absolute;
  left: 633.43px;
  top: 999.93px;
  width: 166.16px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line151 {
  position: absolute;
  left: 536.43px;
  top: 999px;
  width: 66.57px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line150 {
  position: absolute;
  left: 500px;
  top: 999px;
  width: 11.03px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line162 {
  position: absolute;
  left: 421px;
  top: 1130px;
  width: 7px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line161 {
  position: absolute;
  left: 400px;
  top: 1130px;
  width: 7px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line156 {
  position: absolute;
  left: 428.73px;
  top: 1146.93px;
  width: 71.27px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line142 {
  position: absolute;
  left: 427.79px;
  top: 946.83px;
  width: 83.61px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line172 {
  position: absolute;
  left: 700.08px;
  top: 793px;
  width: 49.92px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line168 {
  position: absolute;
  left: 551px;
  top: 793px;
  width: 34.61px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line137 {
  position: absolute;
  left: 428.15px;
  top: 848.06px;
  width: 23.34px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line134 {
  position: absolute;
  left: 428.19px;
  top: 897.92px;
  width: 23.13px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line136 {
  position: absolute;
  left: 346px;
  top: 848px;
  width: 63.09px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line135 {
  position: absolute;
  left: 285.23px;
  top: 848px;
  width: 38.93px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line125 {
  position: absolute;
  left: 0px;
  top: 848.41px;
  width: 253.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line124 {
  position: absolute;
  left: 115px;
  top: 748.12px;
  width: 137.62px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line87 {
  position: absolute;
  left: 0px;
  top: 748.27px;
  width: 81.82px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line86 {
  position: absolute;
  left: 0px;
  top: 547.8px;
  width: 251.84px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line85 {
  position: absolute;
  left: 1px;
  top: 499px;
  width: 124.48px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line78 {
  position: absolute;
  left: 140.04px;
  top: 499px;
  width: 31.36px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line72 {
  position: absolute;
  left: 458.55px;
  top: 499.14px;
  width: 57.95px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line71 {
  position: absolute;
  left: 700.5px;
  top: 460px;
  width: 49.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line70 {
  position: absolute;
  left: 700.34px;
  top: 429.07px;
  width: 49.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line66 {
  position: absolute;
  left: 600px;
  top: 399px;
  width: 149.84px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line58 {
  position: absolute;
  left: 500.43px;
  top: 349.19px;
  width: 249.59px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line55 {
  position: absolute;
  left: 686px;
  top: 249.1px;
  width: 64.03px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line54 {
  position: absolute;
  left: 640px;
  top: 249.82px;
  width: 22.98px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line53 {
  position: absolute;
  left: 567.7px;
  top: 249px;
  width: 53.6px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line52 {
  position: absolute;
  left: 457px;
  top: 249px;
  width: 83.3px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line51 {
  position: absolute;
  left: 342.58px;
  top: 249px;
  width: 86.6px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line49 {
  position: absolute;
  left: 93px;
  top: 248.97px;
  width: 42.42px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line32 {
  position: absolute;
  left: 1px;
  top: 250px;
  width: 71.38px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line40 {
  position: absolute;
  left: 500px;
  top: 197.9px;
  width: 26.64px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line45 {
  position: absolute;
  left: 778.11px;
  top: 199px;
  width: 20.89px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line43 {
  position: absolute;
  left: 640px;
  top: 198px;
  width: 22.26px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line44 {
  position: absolute;
  left: 683px;
  top: 199px;
  width: 77.15px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line46 {
  position: absolute;
  left: 500px;
  top: 121.09px;
  width: 100.04px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line39 {
  position: absolute;
  left: 550px;
  top: 198.42px;
  width: 71.52px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line37 {
  position: absolute;
  left: 294.95px;
  top: 198.96px;
  width: 108.48px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line34 {
  position: absolute;
  left: 222.05px;
  top: 199.04px;
  width: 55.05px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line35 {
  position: absolute;
  left: 281.01px;
  top: 92.23px;
  width: 18.97px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line33 {
  position: absolute;
  left: 57px;
  top: 200px;
  width: 142.95px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line29 {
  position: absolute;
  left: 0.53px;
  top: 199.02px;
  width: 30.4px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#elevator4 {
  position: absolute;
  left: 1.4px;
  top: 246px;
  width: 54px;
  height: 54px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(-90deg);
}








</style>