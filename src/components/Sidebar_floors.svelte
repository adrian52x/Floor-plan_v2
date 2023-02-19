<script>
    import { fly } from 'svelte/transition';
    import { myStore, buttonClicked } from "../store/store"

    let clickedObject = $myStore;

    console.log("clickedObject from sidebar", clickedObject);

    export let selectedFloor;
    export let building;
    export let rooms;


    // TODO filter objectRooms by floor


    function changeColor(object) {
       clickedObject = object
        myStore.set(object)
        buttonClicked.set(true)
        
    }
</script>


    <nav class="z-10 fixed bg-gray-100 border-r-2 shadow-lg" transition:fly={{x: -400, opacity: 1}}>

        <h1>{building.name}</h1>
        <h1>Floor: {selectedFloor}</h1> <br>

        
        <h1>Meeting Rooms</h1><br>

        {#each rooms as room}
          {#if room.type === 'meetingRoom'}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div class="px-4 py-2 mb-2 rounded-md font-semibold text-gray-50 w-fit " class:bg-gray-500={ true } class:bg-red-500={ clickedObject?.name === room.name & clickedObject?.type === room.type } on:click={changeColor(room)}>{selectedFloor}.{room.name}</div>
          {/if}
        {/each}
        
        <br>

        <h1>Printer Rooms</h1><br>

        {#each rooms as room}
          {#if room.type === 'printerRoom'}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div class="px-4 py-2 mb-2 rounded-md font-semibold text-gray-50 w-fit " class:bg-gray-500={ true } class:bg-red-500={ clickedObject?.name === room.name & clickedObject?.type === room.type } on:click={changeColor(room)}>{selectedFloor}.{room.name}</div>
          {/if}
        {/each}


        <br><hr>
        <a href="/buildings/{building.name}">BACK</a>
 
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