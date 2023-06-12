<script>
    import { fly } from 'svelte/transition';
    import { buildings } from '../store/data.js'

	export let roomData;
	export let onClose;
</script>
    
    <nav class="z-10 fixed bg-gray-100 border-r-2 shadow-lg" transition:fly={{x: 400, opacity: 1}}>

		<button on:click={onClose} class="flex justify-end w-full">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45">
			  <path fill="currentColor" d="M12 10.59l4.88-4.88a1 1 0 1 1 1.41 1.41L13.41 12l4.88 4.88a1 1 0 0 1-1.41 1.41L12 13.41l-4.88 4.88a1 1 0 0 1-1.41-1.41L10.59 12 5.71 7.12A1 1 0 0 1 7.12 5.71L12 10.59z"/>
			</svg>
		</button>
    
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
		
		{#if roomData?.instruments.length > 0}
			{#each roomData.instruments as instrument}
				<div class="font-newText px-2 py-4 text-sm text-left">{instrument.name}</div>
			{/each}
		
		{:else}
			<div class="font-newText px-2 py-4 text-sm text-left">No Instruments</div>
		{/if}
		

    



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