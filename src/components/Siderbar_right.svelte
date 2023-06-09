<script>
    import { fly } from 'svelte/transition';
    import { buildings } from '../store/data.js'

	export let roomData;
</script>
    
    <nav class="z-10 fixed bg-gray-100 border-r-2 shadow-lg" transition:fly={{x: 400, opacity: 1}}>
    
        <!-- {#each buildings as building }
    
            <a class="font-newText px-2 py-4 text-xl text-left font-bold" href="/{building.name}">{building.name}</a>
            <div class="font-newText px-2 py-4 text-sm text-left">{building.location}</div>
            <img src="/buildings/img_{building.name}.jpg" onerror="this.src='/buildings/default_image.png';" alt="building" class="w-full h-32 "  />
            <br> <hr style="border: 1px solid;"> <br>
        
    
        {/each} -->
    
		<div class="font-newText px-2 py-4 text-xl text-left font-bold">{roomData?.roomName}</div>
        <img src="/buildings/default_image.png" onerror="this.src='/buildings/default_image.png';" alt="building" class="w-full h-32 "  />
        <div class="font-newText px-2 py-4 text-sm text-left">{roomData?.roomType}</div>
        <br> <hr style="border: 1px solid;"> <br>
		
		{#if roomData}
			{#each roomData.instruments as instrument}
				<div class="font-newText px-2 py-4 text-sm text-left">{instrument.name}</div>
			{/each}
		
		{:else}
			<div class="font-newText px-2 py-4 text-sm text-left">No Instruments</div>
		{/if}
		

		<div class="font-newText px-2 py-4 text-sm text-left">Instrument1</div>
		<div class="font-newText px-2 py-4 text-sm text-left">Instrument2</div>
		<div class="font-newText px-2 py-4 text-sm text-left">Instrument3</div>
		<div class="font-newText px-2 py-4 text-sm text-left">Instrument4</div>
    



	</nav>
    
<style lang="scss">
	nav {
		top: 0;
		right: 0;
		height: 100%;
		padding: 2rem 1rem 0.6rem;
		overflow-y: auto;
		width: 380px;
		display: inline-block;

		@media (max-width: 1600px) {
			width: 350px;
	    }
		@media (max-width: 1200px) {
			width: 320px;
		}
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