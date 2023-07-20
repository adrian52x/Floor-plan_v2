<script>
    import { fly } from 'svelte/transition';
    import { buildings } from '../store/data.js'
	import Spinner from './Spinner.svelte';
	import { onDestroy } from 'svelte';
	import CloseButtonX from './utils/closeButtonX.svelte';
	import { user } from '../security/auth.js';
	import { baseURL } from '../store/store.js';

	export let roomData;
	export let onClose;


	export let isLoading;
	export let errorMessage;



	let information = null;

	$:{
        if (roomData) {
            information = null;
        }
    }

	console.log("isLoading", isLoading);

	setTimeout(() => {
		console.log("roomData", roomData);
	}, 1000);


	const unassignInstrument = async (instrumentName, roomName)  => {
		const body = {
            instrumentName: instrumentName,
            roomName: roomName
        };

		console.log("instrumentName", instrumentName);

        try {
            const response = await fetch(`${baseURL}/api/room-instruments`, {
            method: 'DELETE',
			headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Failed to unassign instrument ${instrumentName} from ${roomName}`);
        }
			information = `${instrumentName} unassigned from ${roomName} successfully`;
            console.log(`${instrumentName} unassigned from ${roomName} successfully`);
        } catch (error) {
            console.error(error);
        }
    }
   
	
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
			
			<div class="font-digits text-left text-lg py-2 " >Instruments in this room:</div>
			{#if $user?.isAdmin}
				<hr>
				{#if roomData && roomData?.instruments?.length > 0}
						{#each roomData.instruments as instrument}
							<!-- <div class="font-defaultText px-2 py-4 text-m text-left">{instrument.name}</div> -->
							<div class="font-defaultText bg-gray-200 px-2 mb-3  rounded-lg flex justify-between">
								<div class="pt-1">{instrument.name}</div>
								<div>
									
									<button class="underline" on:click={() => unassignInstrument(instrument.name, roomData.roomName)}> 
										<iconify-icon class="px-2 pt-1 text-xl" icon="mdi:close" ></iconify-icon>
									</button>
								</div>
							</div>
						{/each}
					
					{:else}
						<div class="font-defaultText px-2 py-4 text-sm text-left">No Instruments</div>
				{/if}
				
			{:else}

				{#if roomData && roomData?.instruments?.length > 0}
					{#each roomData.instruments as instrument}
						<div class="font-defaultText px-2 py-4 text-m text-left">{instrument.name}</div>
					{/each}
			
				{:else}
					<div class="font-defaultText px-2 py-4 text-sm text-left">No Instruments</div>
				{/if}
				
			{/if}
			<hr>
			
			{#if information != null}
				
				<div class="text-left font-defaultText pt-4 font-semibold text-green-400">{information}</div>
				
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