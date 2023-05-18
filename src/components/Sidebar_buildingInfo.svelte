<script>
    import { fly } from 'svelte/transition';

    export let building;
</script>
    
    <nav class="z-10 fixed bg-gray-100 border-r-2 shadow-lg" transition:fly={{x: -400, opacity: 1}}>

        <a href="/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                <path fill="currentColor" d="M21.41,11H7.83l4.88-4.88A1,1,0,0,0,10.29,4.29L2.29,12.29a1,1,0,0,0,0,1.42L10.29,19.71a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L7.83,13h13.58a1,1,0,0,0,0-2Z"/>
              </svg>
        </a>

        <div class="font-newText px-2 py-4 text-lg text-left font-bold">{building.name}</div>
        <div class="font-digits px-2 text-sm text-left">Lng: {building?.lng.toFixed(4)}</div>
        <div class="font-digits px-2 text-sm text-left">Lat: {building?.lat.toFixed(4)}</div>
        <div class="font-newText px-2 py-4 text-sm text-left">{building?.location}</div>


      
        <img src="/buildings/img_{building.name}.jpg" alt="building" class="w-full h-32 "  />

        <div class="font-newText px-2 py-4 text-base text-left">Floors</div>

        {#if building.floors?.length > 0 }
        
            {#each building.floors as floor}

                <a href="{building.name}/{floor}">
                    <div class="px-4 py-2 mt-2 mb-2 bg-gray-200 rounded-md font-semibold w-full hover:bg-gray-300">  
                        {floor}
                    </div>
                </a>
                
            
            {/each}
        {:else}
            <div class="font-digits px-6 py-1 mb-2 rounded-md font-semibold  bg-gray-400">No data</div>
        {/if}   




        
 
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