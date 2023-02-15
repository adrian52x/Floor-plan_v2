<script>
    import { fly } from 'svelte/transition';

    export let building;
</script>


    <nav class="z-10 fixed bg-gray-100 border-r-2 shadow-lg" transition:fly={{x: -400, opacity: 1}}>

        <h1>{building.name}</h1>
        <h1>{building.lng}</h1>
        <h1>{building.lat}</h1>
        <img src="/buildings/img_{building.name}.jpg" alt="building" class="w-full h-32 "  />


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