<script>
    import { fly } from 'svelte/transition';
    import { buildings } from '../store/data.js'
	import Spinner from './Spinner.svelte';
	import { onDestroy, onMount, afterUpdate } from 'svelte';
	import CloseButtonX from './utils/closeButtonX.svelte';
	import { user } from '../security/auth.js';
	import { currentOpenedRoom } from '../store/store.js';
	import { baseURL } from '../store/store.js';
	import { sortItems } from '../store/utils-functions.js';

	export let roomData;
	export let instruments; // all instruments
	export let PCs; // all PCs
	export let netWorkPorts; // all Ports
	export let onClose;

	console.log(baseURL);
	export let isLoading;
	export let errorMessage;

	// Sort the items array by name in alphabetical order from  (Select an instrument to add here)
	instruments = sortItems(instruments);
	PCs = sortItems(PCs);
	netWorkPorts = sortItems(netWorkPorts);


	let notifyMessage = {
		message: null,
		type: null  // Success or Error
	}

	let addItems = [];
	let showAddItems = false;
	let selectedItemToAdd;
	let itemTypeToAdd;


	$:{
        if (roomData) {
            
			currentOpenedRoom.set(roomData.roomName)
			showAddItems = false;
			console.log(roomData);
        }
	}
	
	$:{
		if ($currentOpenedRoom){
			notifyMessage.message = null;
			notifyMessage.type = null;
		}

		
		switch (itemTypeToAdd) {
		case 'Instrument':
			addItems = instruments;
			break;
		case 'PC':
			addItems = PCs;
			break;
		case 'Network Point':
			addItems = netWorkPorts;
			break;
		}
		
	}



	console.log("isLoading", isLoading);

	setTimeout(() => {
		console.log("roomData", roomData);
	}, 1000);

	const assignItem = async () => {

		const body = {
            roomId: roomData.roomId,
			itemId: selectedItemToAdd._id,
			itemType: itemTypeToAdd
        };

		try {
			const response = await fetch(`${baseURL}/api/itemToRoom`, {
			method: 'PATCH',
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
			} else if (response.status == 404) {
				response.json().then(error => {
					notifyMessage.message = error.error; 
					notifyMessage.type = "Error"
				});
			} else if (response.status == 200){
				const assignedItem = {
					_id: selectedItemToAdd._id,
					name: selectedItemToAdd.name
				}

				switch (itemTypeToAdd) {
					case 'Instrument':
						roomData.instruments = [ ...roomData.instruments, assignedItem ];
						break;
					case 'PC':
						roomData.PCs = [ ...roomData.PCs, assignedItem ];
						break;
					case 'Network Point':
						roomData.netWorkPorts = [ ...roomData.netWorkPorts, assignedItem ];
						break;
				}

				notifyMessage.message = `${selectedItemToAdd.name} added to ${roomData.roomName} successfully`;
				notifyMessage.type = "Success";
			}


		} catch (error) {
			console.error(error);
			// Handle error scenario, show error message, etc.
		}
		
	}

	const unassignItem = async (item, itemTypeToRemove)  => {
		const body = {
            roomId: roomData.roomId,
			itemId: item._id,
			itemType: itemTypeToRemove
        };


        try {
            const response = await fetch(`${baseURL}/api/removeItemFromRoom`, {
            method: 'PATCH',
			headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Failed to unassign ${item.name} from ${roomData.roomName}`);
        }

			switch (itemTypeToRemove) {
				case 'Instrument':
					roomData.instruments = roomData.instruments.filter(i => i._id !== item._id);
					break;
				case 'PC':
					roomData.PCs = roomData.PCs.filter(i => i._id !== item._id);
					break;
				case 'Network Point':
					roomData.netWorkPorts = roomData.netWorkPorts.filter(i => i._id !== item._id);
					break;
			}


			notifyMessage.message = `${item.name} unassigned from ${roomData.roomName} successfully`;
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
				<div class="font-digits text-left text-lg  " >Items in the room:</div>
				{#if $user?.isAdmin}
					<button on:click={() => showAddItems = !showAddItems} class="px-2 py-1 text-lg bg-gray-200 h-8 rounded-l-xl font-defaultText hover:bg-gray-300 border border-gray-500">
						Add
						<iconify-icon class=" text-xl" icon="mdi:arrow-down" ></iconify-icon>
						
					</button>
					<select bind:value={itemTypeToAdd} name="itemTypeToAdd" id="itemTypeToAdd" class="h-8 focus:outline-none rounded-r-xl w-13  mb-4 text-xs bg-gray-200"> 
						<option value="Instrument">Instrument</option>
						<option value="PC">PC</option>
						<option value="Network Point">Network Point</option>
					</select>
				{/if}	
			</div>

			
			
			
			{#if $user?.isAdmin}  <!-- IF ADMIN -->

				{#if showAddItems}
					<label class="pt-6 flex justify-between text-m font-defaultText" for="instruments">Select {itemTypeToAdd} to add here:</label> 
					<div class="flex pb-8">
						<div class="flex-1 mr-4">
							<select bind:value={selectedItemToAdd} name="addItems" id="addItems" class="h-10 rounded-xl w-full  mb-4"> 
								{#each addItems as item}
									<option value="{item}">{item.name}</option>
								{/each}
							</select> 
						</div>
						<button on:click={() => assignItem()} class="hover:bg-gray-300 rounded-xl h-10">
							<iconify-icon class=" text-xl px-2 pt-1" icon="mdi:add" ></iconify-icon>
						</button>
					</div>
				{/if}
				<hr>
				{#if roomData }
					<div class="font-defaultText px-2 py-4 text-left font-semibold">Instruments [{roomData?.instruments?.length}]</div>
					{#each roomData.instruments as instrument}
						<!-- <div class="font-defaultText px-2 py-4 text-m text-left">{instrument.name}</div> -->
						<div class="font-defaultText bg-gray-200 px-2 mb-3  rounded-lg flex justify-between">
							<div class="pt-1">{instrument.name}</div>
							<div>
								<button class="rounded-lg hover:bg-gray-300" on:click={() => unassignItem(instrument, "Instrument")}> 
									<iconify-icon class="px-2 pt-1 text-xl" icon="mdi:close" ></iconify-icon>
								</button>
							</div>
						</div>
					{/each}

					<hr>
					<div class="font-defaultText px-2 py-4 text-left font-semibold">PCs [{roomData?.PCs?.length}]</div>
					{#each roomData.PCs as pc}
						<!-- <div class="font-defaultText px-2 py-4 text-m text-left">{instrument.name}</div> -->
						<div class="font-defaultText bg-gray-200 px-2 mb-3  rounded-lg flex justify-between">
							<div class="pt-1">{pc.name}</div>
							<div>
								<button class="rounded-lg hover:bg-gray-300" on:click={() => unassignItem(pc, "PC")}> 
									<iconify-icon class="px-2 pt-1 text-xl" icon="mdi:close" ></iconify-icon>
								</button>
							</div>
						</div>
					{/each}

					<hr>
					<div class="font-defaultText px-2 py-4 text-left font-semibold">Network Points [{roomData?.netWorkPorts?.length}]</div>
					{#each roomData.netWorkPorts as port}
						<!-- <div class="font-defaultText px-2 py-4 text-m text-left">{instrument.name}</div> -->
						<div class="font-defaultText bg-gray-200 px-2 mb-3  rounded-lg flex justify-between">
							<div class="pt-1">{port.name}</div>
							<div>
								<button class="rounded-lg hover:bg-gray-300" on:click={() => unassignItem(port, "Network Point")}> 
									<iconify-icon class="px-2 pt-1 text-xl" icon="mdi:close" ></iconify-icon>
								</button>
							</div>
						</div>
					{/each}
				{/if}		
			
				
			{:else} <!-- IF USER -->

				{#if roomData }
					<div class="font-defaultText px-2 py-4 text-left font-semibold">Instruments [{roomData?.instruments?.length}]</div>
					{#each roomData.instruments as instrument}
						<div class="font-defaultText bg-gray-200 px-2 mb-3 pt-1 rounded-lg text-left">{instrument.name}</div>
					{/each}
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