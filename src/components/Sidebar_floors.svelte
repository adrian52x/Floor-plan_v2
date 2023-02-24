<script>
    import { fly } from 'svelte/transition';
    import { selectedObject, isButtonClicked } from "../store/store"

    let clickedObject = $selectedObject;

    console.log("clickedObject from sidebar", clickedObject);

    export let selectedFloor;
    export let building;
    export let meetings;
    export let printers;
    export let desks;


    
    //filter Objects by floor and building
    meetings = meetings.filter(object => object.floor === selectedFloor && object.building === building.name)
    printers = printers.filter(object => object.floor === selectedFloor && object.building === building.name)
    desks = desks.filter(object => object.floor === selectedFloor && object.building === building.name)

    let backupDesks = desks;


    // Search for desks
    let searchQuery = '';
    let displayFilteredDesks = false;



    function filteredDesks() {
        if (!searchQuery) {
        return desks;
        }
        const lowerCaseQuery = searchQuery.toLowerCase();
        return desks.filter(room => room.name.toLowerCase().includes(lowerCaseQuery));
    }

    function search() {
        // Filter the desks based on the search query
        const filtered = filteredDesks();

        // Update the desks displayed
        desks = filtered;
    }

    function reset() {
        // Reset the desks to the original value
        desks = backupDesks

        // Reset the search query
        searchQuery = '';
    }

    function changeColor(object) {
       clickedObject = object
       selectedObject.set(object)
        isButtonClicked.set(true)
        
    }


    let displayMeetings = true;
    let displayPrinters = true;
    let displayDesks = true;
</script>

    <nav class="z-10 fixed bg-gray-100 border-r-2 shadow-lg" transition:fly={{x: -400, opacity: 1}}>

        <a href="/buildings/{building.name}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                <path fill="currentColor" d="M21.41,11H7.83l4.88-4.88A1,1,0,0,0,10.29,4.29L2.29,12.29a1,1,0,0,0,0,1.42L10.29,19.71a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L7.83,13h13.58a1,1,0,0,0,0-2Z"/>
              </svg>
        </a>
        
        <div class="font-newText px-2  text-center font-bold">{building.name}</div>
        <div class="font-newText px-2 py-1 text-center font-bold">Floor:  {selectedFloor} </div>



        <div style="display: flex; flex-direction: row;">
            <div class="font-newText py-6 text-center font-bold w-full">Meeting Rooms </div> 
            <span class="meeting-color"> 
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div  class={displayMeetings ? 'up-arrow' : 'down-arrow'} on:click={() => displayMeetings = !displayMeetings}></div>
            </span>
        </div>

        {#if meetings?.length}
            {#each meetings as room}
                {#if displayMeetings}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="font-digits px-6 py-1 mb-2 rounded-md font-semibold bg-gray-200 hover:bg-gray-300" 
                            class:bg-red-400={ clickedObject?.name === room.name & clickedObject?.type === room.type }
                            class:hover:bg-red-400={ clickedObject?.name === room.name & clickedObject?.type === room.type }  
                            class:text-center={ clickedObject?.name === room.name & clickedObject?.type === room.type } 
                            on:click={changeColor(room)}>{selectedFloor}.{room.name}
                </div>
                {/if}  
            {/each}
        {:else}
             <div class="font-digits">No data</div>   
        {/if}    
        <hr style="border: 1px solid;"><br>





        <div style="display: flex; flex-direction: row;">
            <div class="font-newText pb-4 text-center font-bold w-full" >Printer Rooms</div>
                <span class="printer-color">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div  class={displayPrinters ? 'up-arrow' : 'down-arrow'} on:click={() => displayPrinters = !displayPrinters}></div>
                </span>
        </div>

         {#if printers?.length}
            {#each printers as room}
                {#if displayPrinters}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="font-digits px-6 py-1 mb-2 rounded-md font-semibold bg-gray-200 hover:bg-gray-300" 
                                class:bg-red-400={ clickedObject?.name === room.name & clickedObject?.type === room.type } 
                                class:hover:bg-red-400={ clickedObject?.name === room.name & clickedObject?.type === room.type }
                                class:text-center={ clickedObject?.name === room.name & clickedObject?.type === room.type } 
                                on:click={changeColor(room)}>{selectedFloor}.{room.name}
                    </div>
                {/if}  
            {/each}
        {:else}
            <div class="font-digits">No data</div>   
        {/if}    
        <hr style="border: 1px solid;"><br>



        <div style="display: flex; flex-direction: row;">
            <div class="font-newText pb-4 text-center font-bold w-full" >Desks</div>
                <span class="desk-color">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div  class={displayDesks ? 'up-arrow' : 'down-arrow'} on:click={() => displayDesks = !displayDesks}></div>
                </span>
        </div>




        {#if displayDesks } 
            <div class="search-container">
                <input class="search-input font-digits" type="text" bind:value={searchQuery} placeholder="Search desks">
                <button class="search-button font-digits "  on:click={search}>Search</button>
                <button class="reset-button font-digits" on:click={reset}>Reset</button>
            </div>    

            {#if desks.length}
                {#each desks as room}
                    
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="font-digits px-6 py-1 mb-2 rounded-md font-semibold  bg-gray-200 hover:bg-gray-300" 
                                    class:bg-red-400={ clickedObject?.name === room.name & clickedObject?.type === room.type }
                                    class:hover:bg-red-400={ clickedObject?.name === room.name & clickedObject?.type === room.type } 
                                    class:text-center={ clickedObject?.name === room.name & clickedObject?.type === room.type } 
                                    on:click={changeColor(room)}>
                                    {selectedFloor}.{room.name} 
                                    <br><hr>
                                    {#if clickedObject?.name === room.name && clickedObject?.type === room.type}
                                        User: X <br>
                                        {room.equipment ? 'Equipment: ' + room.equipment : ''}
                                        <!-- add more information here as needed -->
                                    {/if}
                        </div>
                    
                {/each}
            {:else}
                    <div class="font-digits">No data</div>   
            {/if} 
         {/if}    
        <hr style="border: 1px solid;"><br>
        
 
    </nav>



   

<style>

 
    nav {
        top: 0;
        height: 100%;
        padding: 2rem 1rem 0.6rem;
        overflow-y: auto;
        width: 310px;
        display: inline-block
    }

    .search-container {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .search-input {
    max-width: 7rem;
    max-height: 30px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    margin-right: 0.5rem;
  }
  
  .search-button {
    width: 25%;
    max-height: 30px;
    margin-left: -5px;
    margin-bottom: 5px;
    color: #020202;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  .reset-button {
    width: 25%;
    max-height: 30px;
    margin-bottom: 5px;
    color: #8b0505;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

    .down-arrow {
    border: solid black;
    border-width: 0 5px 5px 0;
    display: inline-block;
    padding: 4px;
    margin-left: 5px;
    margin-bottom: 1px;
    transform: rotate(45deg);
    caret-color: transparent;
  }
  .up-arrow {
    border: solid black;
    border-width: 0 5px 5px 0;
    display: inline-block;
    padding: 4px;
    margin-left: 5px;
    margin-bottom: -1px;
    transform: rotate(225deg);
    caret-color: transparent;
  }

  .meeting-color {
    right: 20px;
    top: 23px;
    width: 28px;
    height: 25px;
    border: 1px solid black;
    position: relative;
    border-radius: 20px;
    background-color: rgb(103, 191, 231);
}

.printer-color {
    right: 22px;
    top: 2px;
    width: 28px;
    height: 25px;
    border: 1px solid black;
    position: relative;
    border-radius: 20px;
    background-color: rgb(182, 255, 200);
}

.desk-color {
    right: 22px;
    top: 2px;
    width: 28px;
    height: 25px;
    border: 1px solid black;
    position: relative;
    border-radius: 20px;
    background-color: rgb(231, 222, 89);
}
    
    ::-webkit-scrollbar {
      width: 6px;
      background-color: #ffffffe7;
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: #d3d3d3;
      border-radius: 10px;
    }
    
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: #b8b8b8;
      width: 15px;
    }
</style>