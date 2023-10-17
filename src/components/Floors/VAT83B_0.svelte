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
    
    
    

    let lines = Array.from({ length: 187 }, (_, i) => i + 1);
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
          <div style={`position: absolute; background: #f3e8e0; left: ${gridLine.left}px; top: -75px; width: 2px; height: 1350px;`} class="text-xs"> {gridLine.left} </div>
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

#line96 {
  position: absolute;
  left: 141px;
  top: 361px;
  width: 58.52px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line113 {
  position: absolute;
  left: 0.45px;
  top: 999px;
  width: 140.55px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line115 {
  position: absolute;
  left: 0px;
  top: 647.3px;
  width: 200px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line125 {
  position: absolute;
  left: 0px;
  top: 865.4px;
  width: 142px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line124 {
  position: absolute;
  left: -0.3px;
  top: 749.5px;
  width: 142px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line106 {
  position: absolute;
  left: 0.45px;
  top: 546.75px;
  width: 140.55px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line95 {
  position: absolute;
  left: 0px;
  top: 423.75px;
  width: 200px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line182 {
  position: absolute;
  left: 238px;
  top: 1118.88px;
  width: 261.74px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line187 {
  position: absolute;
  left: 413px;
  top: 1151.9px;
  width: 86.91px;
  height: 2px;
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
  left: 96.3px;
  top: 15px;
  width: 2px;
  height: 185px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line36 {
  position: absolute;
  left: 230.5px;
  top: 90.5px;
  width: 169.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line141 {
  position: absolute;
  left: 142px;
  top: 1038.4px;
  width: 95.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line184 {
  position: absolute;
  left: 350px;
  top: 1162.12px;
  width: 18.78px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line73 {
  position: absolute;
  left: 237px;
  top: 1077px;
  width: 11.03px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line140 {
  position: absolute;
  left: 236.12px;
  top: 1077.8px;
  width: 2px;
  height: 121.81px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line72 {
  position: absolute;
  left: 198.99px;
  top: 1039.4px;
  width: 2px;
  height: 160.09px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line86 {
  position: absolute;
  left: 349px;
  top: 1120px;
  width: 2px;
  height: 43.2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line181 {
  position: absolute;
  left: 499.92px;
  top: 1038.92px;
  width: 113.58px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line180 {
  position: absolute;
  left: 600px;
  top: 943.97px;
  width: 13.5px;
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

#line149 {
  position: absolute;
  left: 112.1px;
  top: 1091.5px;
  width: 2px;
  height: 7.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line146 {
  position: absolute;
  left: 141px;
  top: 1091.5px;
  width: 2px;
  height: 7.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line80 {
  position: absolute;
  left: 236.5px;
  top: 1028.5px;
  width: 2px;
  height: 11px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line88 {
  position: absolute;
  left: 271px;
  top: 915px;
  width: 49.63px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line71 {
  position: absolute;
  left: 236.5px;
  top: 1000px;
  width: 2px;
  height: 11.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line70 {
  position: absolute;
  left: 279px;
  top: 1000.85px;
  width: 2px;
  height: 77.15px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line50 {
  position: absolute;
  left: 237.5px;
  top: 159.65px;
  width: 71.31px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line41 {
  position: absolute;
  left: 277px;
  top: 121.99px;
  width: 2px;
  height: 38.41px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line39 {
  position: absolute;
  left: 237.5px;
  top: 225.22px;
  width: 162.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line35 {
  position: absolute;
  left: 96.2px;
  top: 170.15px;
  width: 103.8px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line34 {
  position: absolute;
  left: 152.5px;
  top: 1px;
  width: 2px;
  height: 28px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line48 {
  position: absolute;
  left: 236.5px;
  top: 160.6px;
  width: 2px;
  height: 65.6px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line38 {
  position: absolute;
  left: 399px;
  top: 0.5px;
  width: 2px;
  height: 91px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line42 {
  position: absolute;
  left: 441.65px;
  top: 200px;
  width: 2px;
  height: 100px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line33 {
  position: absolute;
  left: 199px;
  top: 91.5px;
  width: 2px;
  height: 115px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line59 {
  position: absolute;
  left: 236.5px;
  top: 92.2px;
  width: 2px;
  height: 37.3px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line67 {
  position: absolute;
  left: 238px;
  top: 915px;
  width: 13.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line171 {
  position: absolute;
  left: 425px;
  top: 866px;
  width: 2px;
  height: 24.62px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line170 {
  position: absolute;
  left: 399.11px;
  top: 853.54px;
  width: 2px;
  height: 12.46px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line177 {
  position: absolute;
  left: 510.84px;
  top: 967px;
  width: 2px;
  height: 32.69px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line175 {
  position: absolute;
  left: 430px;
  top: 916px;
  width: 2px;
  height: 50.77px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line174 {
  position: absolute;
  left: 350px;
  top: 916px;
  width: 2px;
  height: 62.77px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line68 {
  position: absolute;
  left: 286.15px;
  top: 916.23px;
  width: 2px;
  height: 62.77px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line165 {
  position: absolute;
  left: 449px;
  top: 903.24px;
  width: 2px;
  height: 12.76px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line65 {
  position: absolute;
  left: 449px;
  top: 814px;
  width: 2px;
  height: 74.52px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line161 {
  position: absolute;
  left: 334px;
  top: 750px;
  width: 2px;
  height: 84px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line64 {
  position: absolute;
  left: 308.66px;
  top: 866.74px;
  width: 2px;
  height: 49.26px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line129 {
  position: absolute;
  left: 199px;
  top: 762.5px;
  width: 2px;
  height: 63px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line127 {
  position: absolute;
  left: 199px;
  top: 693.5px;
  width: 2px;
  height: 49px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line130 {
  position: absolute;
  left: 141px;
  top: 649px;
  width: 2px;
  height: 23.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line157 {
  position: absolute;
  left: 335px;
  top: 729px;
  width: 65px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line156 {
  position: absolute;
  left: 334px;
  top: 662.81px;
  width: 2px;
  height: 67.19px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line155 {
  position: absolute;
  left: 237.5px;
  top: 671.5px;
  width: 110.94px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line160 {
  position: absolute;
  left: 300.8px;
  top: 749px;
  width: 34.2px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line159 {
  position: absolute;
  left: 299.75px;
  top: 698.9px;
  width: 2px;
  height: 51.1px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line63 {
  position: absolute;
  left: 236.83px;
  top: 698px;
  width: 2px;
  height: 281.02px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line61 {
  position: absolute;
  left: 236.5px;
  top: 648.3px;
  width: 2px;
  height: 29.2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line60 {
  position: absolute;
  left: 236.5px;
  top: 490.5px;
  width: 2px;
  height: 63.7px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line89 {
  position: absolute;
  left: 299px;
  top: 472px;
  width: 2px;
  height: 3.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line58 {
  position: absolute;
  left: 236.5px;
  top: 472px;
  width: 2px;
  height: 3.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line112 {
  position: absolute;
  left: 157px;
  top: 518px;
  width: 43px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line56 {
  position: absolute;
  left: 237.5px;
  top: 553.75px;
  width: 22.01px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line107 {
  position: absolute;
  left: 199px;
  top: 328.3px;
  width: 2px;
  height: 194.1px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line100 {
  position: absolute;
  left: 199px;
  top: 226.2px;
  width: 2px;
  height: 86.3px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line105 {
  position: absolute;
  left: 55px;
  top: 243.29px;
  width: 2px;
  height: 51.71px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line103 {
  position: absolute;
  left: 70.5px;
  top: 230.1px;
  width: 2px;
  height: 12.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line99 {
  position: absolute;
  left: 173.5px;
  top: 171.2px;
  width: 2px;
  height: 28.8px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line108 {
  position: absolute;
  left: 141px;
  top: 540px;
  width: 2px;
  height: 27px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line97 {
  position: absolute;
  left: 140px;
  top: 335px;
  width: 2px;
  height: 27px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line90 {
  position: absolute;
  left: 247.5px;
  top: 376px;
  width: 12.1px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line92 {
  position: absolute;
  left: 200px;
  top: 90.45px;
  width: 8.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line91 {
  position: absolute;
  left: 237.5px;
  top: 121px;
  width: 12.1px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line119 {
  position: absolute;
  left: 121.2px;
  top: 599px;
  width: 45.3px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line138 {
  position: absolute;
  left: 168.5px;
  top: 999px;
  width: 69px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line154 {
  position: absolute;
  left: 128px;
  top: 1148.5px;
  width: 10.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line153 {
  position: absolute;
  left: 152.5px;
  top: 1148.5px;
  width: 8px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line147 {
  position: absolute;
  left: 193.5px;
  top: 1098px;
  width: 6.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line145 {
  position: absolute;
  left: 113.1px;
  top: 1098px;
  width: 64.4px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line143 {
  position: absolute;
  left: 142px;
  top: 1065.35px;
  width: 58px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line135 {
  position: absolute;
  left: 142px;
  top: 914.6px;
  width: 57.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line132 {
  position: absolute;
  left: 142px;
  top: 876.1px;
  width: 57.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line131 {
  position: absolute;
  left: 142px;
  top: 848.1px;
  width: 57.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line110 {
  position: absolute;
  left: 142px;
  top: 566px;
  width: 57.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line109 {
  position: absolute;
  left: 142px;
  top: 538.94px;
  width: 57.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line94 {
  position: absolute;
  left: 141px;
  top: 334px;
  width: 58.52px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line98 {
  position: absolute;
  left: 96.2px;
  top: 199.9px;
  width: 78.3px;
  height: 2px;;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line102 {
  position: absolute;
  left: 0.5px;
  top: 242.5px;
  width: 71px;
  height: 2px;;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line101 {
  position: absolute;
  left: 71.97px;
  top: 229.09px;
  width: 128.03px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line104 {
  position: absolute;
  left: 0.49px;
  top: 294px;
  width: 55.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line93 {
  position: absolute;
  left: 157.49px;
  top: 308.5px;
  width: 42.51px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line32 {
  position: absolute;
  left: 247.5px;
  top: 299px;
  width: 12.1px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line53 {
  position: absolute;
  left: 299px;
  top: 490.5px;
  width: 2px;
  height: 64px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line31 {
  position: absolute;
  left: 258.65px;
  top: 226.2px;
  width: 2px;
  height: 245.8px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line30 {
  position: absolute;
  left: 599px;
  top: 1040px;
  width: 2px;
  height: 159.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line29 {
  position: absolute;
  left: 337.37px;
  top: 916px;
  width: 262.63px;
  height: 2px;;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line144 {
  position: absolute;
  left: 141px;
  top: 1039.4px;
  width: 2px;
  height: 31.1px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line151 {
  position: absolute;
  left: 127.98px;
  top: 1165.5px;
  width: 2px;
  height: 34.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line152 {
  position: absolute;
  left: 159.5px;
  top: 1149.5px;
  width: 2px;
  height: 50.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line150 {
  position: absolute;
  left: 127px;
  top: 1099px;
  width: 2px;
  height: 50.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line148 {
  position: absolute;
  left: 112.15px;
  top: 1001px;
  width: 2px;
  height: 69.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line142 {
  position: absolute;
  left: 169.8px;
  top: 1000px;
  width: 2px;
  height: 39.2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line139 {
  position: absolute;
  left: 199px;
  top: 965.1px;
  width: 2px;
  height: 34.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line137 {
  position: absolute;
  left: 199px;
  top: 904.1px;
  width: 2px;
  height: 42.4px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line134 {
  position: absolute;
  left: 199px;
  top: 840.5px;
  width: 2px;
  height: 47px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line136 {
  position: absolute;
  left: 141px;
  top: 904.1px;
  width: 2px;
  height: 95.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line133 {
  position: absolute;
  left: 141px;
  top: 840.5px;
  width: 2px;
  height: 47px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line114 {
  position: absolute;
  left: 141px;
  top: 693.5px;
  width: 2px;
  height: 132px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line28 {
  position: absolute;
  left: 399.5px;
  top: 659.05px;
  width: 2px;
  height: 174.55px;
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

#line122 {
  position: absolute;
  left: 389.49px;
  top: 647.9px;
  width: 10.51px;
  height: 2px;;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#elevator2 {
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
  height: 92.3px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line123 {
  position: absolute;
  left: 199px;
  top: 585.6px;
  width: 2px;
  height: 86.9px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line117 {
  position: absolute;
  left: 141px;
  top: 567px;
  width: 2px;
  height: 33px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line163 {
  position: absolute;
  left: 189px;
  top: 612px;
  width: 10.51px;
  height: 2px;;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line121 {
  position: absolute;
  left: 166.5px;
  top: 611.5px;
  width: 11px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line120 {
  position: absolute;
  left: 165.5px;
  top: 600px;
  width: 2px;
  height: 12.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line118 {
  position: absolute;
  left: 120.2px;
  top: 600px;
  width: 2px;
  height: 12.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line116 {
  position: absolute;
  left: 121.2px;
  top: 628.8px;
  width: 2px;
  height: 19.2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line25 {
  position: absolute;
  left: 251.5px;
  top: 609.3px;
  width: 2px;
  height: 39px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line111 {
  position: absolute;
  left: 199px;
  top: 537.5px;
  width: 2px;
  height: 32.5px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line24 {
  position: absolute;
  left: 251.5px;
  top: 555px;
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
  height: 2px;;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line57 {
  position: absolute;
  left: 259.6px;
  top: 327.3px;
  width: 140.4px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line172 {
  position: absolute;
  left: 344px;
  top: 999px;
  width: 11.62px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line69 {
  position: absolute;
  left: 279.89px;
  top: 1000px;
  width: 34.99px;
  height: 2px;;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line173 {
  position: absolute;
  left: 276.22px;
  top: 978.06px;
  width: 10.78px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line74 {
  position: absolute;
  left: 238px;
  top: 978.06px;
  width: 18.9px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line176 {
  position: absolute;
  left: 428.1px;
  top: 965.82px;
  width: 83.81px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line66 {
  position: absolute;
  left: 350.78px;
  top: 977.98px;
  width: 49.22px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line126 {
  position: absolute;
  left: 142px;
  top: 699.05px;
  width: 58px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line128 {
  position: absolute;
  left: 142px;
  top: 812.5px;
  width: 57.53px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line164 {
  position: absolute;
  left: 365.7px;
  top: 670.89px;
  width: 34.3px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line158 {
  position: absolute;
  left: 238px;
  top: 705.21px;
  width: 47.52px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line167 {
  position: absolute;
  left: 431.39px;
  top: 813px;
  width: 18.61px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line166 {
  position: absolute;
  left: 400px;
  top: 812.88px;
  width: 18.61px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line169 {
  position: absolute;
  left: 348.87px;
  top: 889.87px;
  width: 77.06px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line168 {
  position: absolute;
  left: 335px;
  top: 865.03px;
  width: 66.29px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line162 {
  position: absolute;
  left: 353.55px;
  top: 834px;
  width: 46.45px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line62 {
  position: absolute;
  left: 238.3px;
  top: 833.23px;
  width: 71.2px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line55 {
  position: absolute;
  left: 237.5px;
  top: 471px;
  width: 62.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line54 {
  position: absolute;
  left: 96.4px;
  top: 28px;
  width: 39.1px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line22 {
  position: absolute;
  left: 278.5px;
  top: 554.5px;
  width: 121.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line21 {
  position: absolute;
  left: 399px;
  top: 225.5px;
  width: 2px;
  height: 329px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line20 {
  position: absolute;
  left: 442.5px;
  top: 299px;
  width: 157px;
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

#line183 {
  position: absolute;
  left: 427px;
  top: 1078px;
  width: 2px;
  height: 41.52px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line84 {
  position: absolute;
  left: 427.2px;
  top: 966.8px;
  width: 2px;
  height: 32.24px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line82 {
  position: absolute;
  left: 420.49px;
  top: 998.92px;
  width: 91.35px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line178 {
  position: absolute;
  left: 599.31px;
  top: 916px;
  width: 2px;
  height: 28.76px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line179 {
  position: absolute;
  left: 612.5px;
  top: 945px;
  width: 2px;
  height: 95.51px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line81 {
  position: absolute;
  left: 499.15px;
  top: 1001px;
  width: 2px;
  height: 198.7px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line17 {
  position: absolute;
  left: 400px;
  top: 198.9px;
  width: 100px;
  height: 2px;;
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

#line79 {
  position: absolute;
  left: 280.12px;
  top: 1077.78px;
  width: 119.38px;
  height: 2px;;
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

#elevator3 {
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
  left: 398.71px;
  top: 979.05px;
  width: 2px;
  height: 98.82px;
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
  top: 1000.84px;
  width: 2px;
  height: 76.96px;
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
  left: 271.5px;
  top: 121px;
  width: 134px;
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
  left: 307px;
  top: 149px;
  width: 45px;
  height: 45px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
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
  left: 309px;
  top: 123px;
  width: 2px;
  height: 103.2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line10 {
  position: absolute;
  left: 310px;
  top: 144px;
  width: 39.5px;
  height: 2px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line186 {
  position: absolute;
  left: 411.9px;
  top: 1120px;
  width: 2px;
  height: 32.7px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line185 {
  position: absolute;
  left: 367.95px;
  top: 1163px;
  width: 2px;
  height: 36.7px;
  background: #000000;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}




</style>