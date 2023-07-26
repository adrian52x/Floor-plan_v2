<script>
    import { fly } from 'svelte/transition';
    import { buildings } from '../store/data.js'
	import Spinner from './Spinner.svelte';
	import { onDestroy, onMount, afterUpdate } from 'svelte';
	import CloseButtonX from './utils/closeButtonX.svelte';
	import { user } from '../security/auth.js';
	import { currentOpenedRoom } from '../store/store.js';
	import { baseURL } from '../store/store.js';

	export let roomData;
	export let instruments;
	export let onClose;


	export let isLoading;
	export let errorMessage;

	// Sort the instruments array by name in alphabetical order
	instruments.sort((a, b) => {
		const nameA = a.name.toLowerCase();
		const nameB = b.name.toLowerCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});

	let notifyMessage = {
		message: null,
		type: null  // Success or Error
	}
	let showAddInstruments = false;
	let selectedInstrumentToAdd;


	$:{
        if (roomData) {
            
			currentOpenedRoom.set(roomData.roomName)
			showAddInstruments = false;
			console.log(roomData);
        }
	}
	
	$:{
		if ($currentOpenedRoom){
			notifyMessage.message = null;
			notifyMessage.type = null;
		}
	}



	console.log("isLoading", isLoading);

	setTimeout(() => {
		console.log("roomData", roomData);
	}, 1000);

	const assignInstrument = async () => {
		//console.log(selectedInstrumentToAdd._id);
		//console.log(roomData.roomId);

		const body = {
            roomId: roomData.roomId,
			instrumentId: selectedInstrumentToAdd._id
        };

		try {
			const response = await fetch(`${baseURL}/api/room-instruments`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
			});

			if (response.status == 400) {
				response.json().then(error => {
					notifyMessage.message = error.error; 
					notifyMessage.type = "Error"
				});
			} else if (response.status == 200){
				const assignedInstrument = {
				_id: selectedInstrumentToAdd._id,
				name: selectedInstrumentToAdd.name
				}

				//roomData.instruments.push(assignedInstrument);
				roomData.instruments = [ ...roomData.instruments, assignedInstrument ];
				console.log(roomData);

				notifyMessage.message = `${selectedInstrumentToAdd.name} added to ${roomData.roomName} successfully`;
				notifyMessage.type = "Success";
			}


		} catch (error) {
			console.error(error);
			// Handle error scenario, show error message, etc.
		}
		
	}

	const unassignInstrument = async (instrument, room)  => {
		const body = {
            instrumentId: instrument._id,
            roomId: room.roomId
        };

		

        try {
            const response = await fetch(`${baseURL}/api/room-instruments`, {
            method: 'DELETE',
			headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Failed to unassign instrument ${instrument.name} from ${room.roomName}`);
        }

			roomData.instruments = roomData.instruments.filter(item => item._id !== instrument._id);
			notifyMessage.message = `${instrument.name} unassigned from ${room.roomName} successfully`;
			notifyMessage.type = "Success";

            //console.log(`${instrument.name} unassigned from ${room.roomName} successfully`);
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
			
			<div class="flex justify-between pb-4">
				<div class="font-digits text-left text-lg py-2 " >Instruments in this room:</div>
				{#if $user?.isAdmin}
					<button on:click={() => showAddInstruments = !showAddInstruments} class="px-2 py-1  text-lg bg-gray-200 h-8 rounded-xl font-defaultText hover:bg-gray-300">
						<iconify-icon class=" text-xl" icon="mdi:arrow-down" ></iconify-icon>
						Add
					</button>
				{/if}	
			</div>

			
			
			
			{#if $user?.isAdmin}
				<hr>
				{#if roomData && roomData?.instruments?.length > 0}
						{#each roomData.instruments as instrument}
							<!-- <div class="font-defaultText px-2 py-4 text-m text-left">{instrument.name}</div> -->
							<div class="font-defaultText bg-gray-200 px-2 mb-3  rounded-lg flex justify-between">
								<div class="pt-1">{instrument.name}</div>
								<div>
									
									<button class="rounded-lg hover:bg-gray-300" on:click={() => unassignInstrument(instrument, roomData)}> 
										<iconify-icon class="px-2 pt-1 text-xl" icon="mdi:close" ></iconify-icon>
									</button>
								</div>
							</div>
						{/each}
					
					{:else}
						<div class="font-defaultText px-2 py-4 text-sm text-left">No Instruments</div>
				{/if}

				{#if showAddInstruments}
					<label class="pt-6 flex justify-between text-m font-defaultText" for="instruments">Select an instrument to add here:</label> 
					<div class="flex pb-8">
						<div class="flex-1 mr-4">
							<select bind:value={selectedInstrumentToAdd} name="instruments" id="instruments" class="h-10 rounded-xl w-full  mb-4"> 
								{#each instruments as instrument}
									<option value="{instrument}">{instrument.name}</option>
								{/each}
							</select> 
						</div>
						<button on:click={() => assignInstrument()} class="hover:bg-gray-300 rounded-xl h-10">
							<iconify-icon class=" text-xl px-2 pt-1" icon="mdi:add" ></iconify-icon>
						</button>
					</div>
				{/if}
				
			{:else}

				{#if roomData && roomData?.instruments?.length > 0}
					{#each roomData.instruments as instrument}
						<div class="font-defaultText bg-gray-200 px-2 mb-3 pt-1 rounded-lg text-left">{instrument.name}</div>
					{/each}
			
				{:else}
					<div class="font-defaultText px-2 py-4 text-sm text-left">No Instruments</div>
				{/if}
				
			{/if}
			<hr>
			
			{#if notifyMessage.message != null}
				
				<div class={`text-left ${notifyMessage.type === 'Success' ? 'bg-green-200' : 'bg-red-200'}  rounded-lg font-defaultText px-2 mt-8 py-2 font-semibold `}>{notifyMessage.message}</div>
				
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