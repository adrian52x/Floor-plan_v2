<script>
    import { fly } from 'svelte/transition';
    import { buildings } from '../store/data.js'
	import Spinner from './Spinner.svelte';
	import { onDestroy } from 'svelte';
	import CloseButtonX from './utils/closeButtonX.svelte';

	export let roomData;
	export let onClose;


	export let isLoading;
	export let errorMessage;

	console.log("isLoading", isLoading);

	setTimeout(() => {
		console.log("roomData", roomData);
	}, 1000);

   
	
</script>
    
    <nav class="z-50 fixed bg-gray-100 border-r-2 shadow-xl" transition:fly={{x: 400, opacity: 1}}>

		<div class="flex justify-end">
			<button on:click={onClose} >
				<CloseButtonX width={45} height={45}/>
			</button>
		</div>
    
       	{#if isLoading === true }
	   		<Spinner {isLoading}/>
			{#if errorMessage != undefined}
				<div class="font-digits">{errorMessage}</div>
			{/if}
			
		{:else}

			<div class="font-newText px-2 py-4 text-xl text-left font-bold">{roomData?.roomName}</div>
			<img src="/buildings/default_image.png" onerror="this.src='/buildings/default_image.png';" alt="building" class="w-full h-32 "  />
			<div class="font-defaultText px-2 py-4 text-m text-left">{roomData?.roomType}</div>
			<br> <hr style="border: 1px solid;"> <br>
			
			{#if roomData && roomData?.instruments?.length > 0}
				{#each roomData.instruments as instrument}
					<div class="font-defaultText px-2 py-4 text-m text-left">{instrument.name}</div>
				{/each}
			
			{:else}
				<div class="font-defaultText px-2 py-4 text-sm text-left">No Instruments</div>
			{/if}

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