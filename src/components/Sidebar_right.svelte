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
        }
	}
	
	$:{
		if ($currentOpenedRoom || editingInstruments){
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
				
				const assignedItem = selectedItemToAdd;
				console.log("assignedItem", assignedItem);

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

	function toggleInstrument(instrument) {
		roomData.instruments = roomData.instruments.map(inst => ({
			...inst,
			expanded: inst === instrument ? !inst.expanded : false,
		}));
  	}
	function togglePCs(pc) {
		roomData.PCs = roomData.PCs.map(p => ({
			...p,
			expanded: p === pc ? !p.expanded : false,
		}));
  	}
	function toggleNetworkPoint(netport) {
		roomData.netWorkPorts = roomData.netWorkPorts.map(port => ({
			...port,
			expanded: port === netport ? !port.expanded : false,
		}));
  	}


	let removeItems = false;

	

	let editingInstruments = {};
	let editingPCs = {};
	let editingNetworkPoints = {};

	function startEditing(item, type) {
		switch (type) {
			case "Instrument":
				editingInstruments[item._id] = true;
				break;
			case "PC":
				editingPCs[item._id] = true;
				break;
			case "Network Point":
				editingNetworkPoints[item._id] = true;
				break;	
			
		}
	}


	const saveChanges = async (item, type) => {
	
		console.log(item);
		let itemType;

		switch (type) {
			case "Instrument":
				editingInstruments[item._id] = false;
				itemType = "instruments"
				break;
			case "PC":
				editingPCs[item._id] = false;
				itemType = "pcs"
				break;
			case "Network Point":
				editingNetworkPoints[item._id] = false;
				itemType = "netports"
				break;	
			
		}

		try {
			const response = await fetch(`${baseURL}/api/${itemType}/${item._id}`, {
				method: "PATCH",
				headers: {
				"Content-Type": "application/json"
				},
				body: JSON.stringify(item)
			});
			if (response.status === 204) {
				notifyMessage.message = `No changes were made to the ${item.name}`;
				notifyMessage.type = "Error";
				return;
			}
		
			if (response.ok) {
				notifyMessage.message = `${item.name} updated successfully`;
				notifyMessage.type = "Success";
				
			} else {
				notifyMessage.message = `Failed to update ${item.name}`;
				notifyMessage.type = "Error";
				
			}

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
			<div class="font-digits pt-3 px-2 text-left">{roomData?.roomNr == null ? '' : roomData.roomNr} </div>
			<div class="font-defaultText px-2 py-2 text-left">{roomData?.roomType}</div>
			<br> <hr style="border: 1px solid;"> <br>
			
			<div class="flex justify-between pb-4">
				<div class="font-digits text-left text-lg  " >Items in the room:</div>
				{#if $user?.isAdmin}
					<button on:click={() => showAddItems = !showAddItems} class={`px-2 py-1 text-lg bg-gray-200 h-8 rounded-l-xl font-defaultText hover:bg-gray-300 border border-gray-500 ${showAddItems ? 'border border-green-500 bg-green-200 shadow-xl' : ''}`}>
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
					<div class="flex ">
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

				<!-- Response message after assign -->
				{#if notifyMessage.message != null}
					<div class={`text-left ${notifyMessage.type === 'Success' ? 'bg-green-200' : 'bg-red-200'} mb-4 rounded-lg font-defaultText px-2 py-2 font-semibold `}>{notifyMessage.message}</div>
				{/if}
		
				<hr>
				
				<!-- Remove items button functionality-->
				{#if roomData?.instruments.length > 0 || roomData?.PCs.length > 0 || roomData?.netWorkPorts.length > 0 }  
					<div class="flex justify-end">
						<button class={`mt-1 px-2 bg-red-300 text-sm text-white h-7 rounded hover:bg-red-400 ${removeItems ? 'border border-red-500 shadow-xl' : ''}`} on:click={() => removeItems = !removeItems}>Remove items</button>
					</div>
				{/if}

				{#if roomData }
					<div class="font-defaultText px-2 py-4 text-left font-semibold">
						<iconify-icon class="text-xl" icon="pajamas:api" ></iconify-icon>
						Instruments [{roomData?.instruments?.length}]
					</div>
					{#each roomData.instruments as instrument}
						<div class="font-defaultText bg-gray-200 px-2 mb-3 rounded-lg hover:bg-gray-300 border border-gray-500"> 
							<div class="flex justify-between items-center cursor-pointer " on:click={() => toggleInstrument(instrument)} on:keydown>
								<div class="pt-1">{instrument.name}</div>
							

								<!-- warning icon itself -->
								{#if instrument.actionRequired }
									<iconify-icon class="text-xl" icon="clarity:warning-standard-solid" style="color: red;"></iconify-icon>
								{/if}
								
								<!-- Remove items button itself -->
								{#if removeItems }
									<button class="rounded-lg hover:bg-red-300" on:click={() => unassignItem(instrument, "Instrument")}> 
										<iconify-icon class="px-2 pt-1 text-xl" icon="mdi:close"></iconify-icon>
									</button>
								{/if}

								
								
						
							</div>
							
							{#if instrument.expanded} <!-- Instrument clicked => expanded -->
								<div class="py-2 mb-4 overflow-auto">
									<table class="text-left text-sm w-full  shadow-lg">
									{#if editingInstruments[instrument._id]}
										<tr class="border border-b-gray-400">
											<td>Name:</td>
											<td>
												<input type="text" bind:value={instrument.name} class="h-6 rounded-lg  w-full">
											</td>
										</tr>
										<tr class="border border-b-gray-400">
											<td>PC : <iconify-icon class="px-2 pt-1 text-xl " icon="mdi:connection" style="color: green;"></iconify-icon> </td>  
											<td>
												<select bind:value={instrument.connectedTo} name="pc" id="pc" class="h-9 rounded-lg w-full">
													<option value="N/A">N/A</option> 
													{#each roomData?.PCs as pc}
														<option value="{pc.name}">{pc.name}</option>
													{/each}
												</select> 
											</td>
										</tr>	
										<tr class="border border-b-gray-400">
											<td>Bmram:</td>
											<td>
												<input type="text" bind:value={instrument.bmram} class="h-6 rounded-lg  w-full">
											</td>
										</tr>
										<tr class="border border-b-gray-400">
											<td>Lansweeper:</td>
											<td>
												<input type="text" bind:value={instrument.lansweeper} class="h-6 rounded-lg  w-full">
											</td>
										</tr>
										<tr class="border border-b-gray-400">
											<td>Action required:</td>
											<td>
												<label class="inline-flex items-center">
													<input type="radio" bind:group={instrument.actionRequired} value={true} class="h-4 w-4 text-blue-500">
													<span class="ml-2">Yes</span>
												</label>
												<label class="inline-flex items-center ml-4">
													<input type="radio" bind:group={instrument.actionRequired} value={false} class="h-4 w-4 text-blue-500">
													<span class="ml-2">No</span>
												</label>
											</td>
										</tr>
										<tr class="border border-b-gray-400">
											<td>Note:</td>
											<td>
												<input type="text" bind:value={instrument.note} class="h-6 rounded-lg  w-full">
											</td>
										</tr>
									{:else}
										<tr class="border border-b-gray-400">
											<td>PC : <iconify-icon class="px-2 pt-1 text-xl " icon="mdi:connection" style="color: green;"></iconify-icon> </td>  
											<td>{instrument.connectedTo !== undefined ? instrument.connectedTo : "N/A"}</td>
										</tr>	
										<tr class="border border-b-gray-400">
											<td>Bmram:</td>
											<td>{instrument.bmram}</td>
										</tr>
										<tr class="border border-b-gray-400">
											<td>Lansweeper:</td>
											<td>{instrument.lansweeper}</td>
										</tr>
										<tr class="border border-b-gray-400">
											<td>Action required:</td>
											<td class={instrument.actionRequired ? "text-red-500 font-bold" : ""}>{instrument.actionRequired ? "Yes" : "No"}</td>
										</tr>
										<tr class="border border-b-gray-400">
											<td>Note:</td>
											<td>{instrument.note !== undefined ? instrument.note : "N/A"}</td>
										</tr>	
									{/if}

									</table>
								</div>
								{#if editingInstruments[instrument._id]}
									<button class="mb-2 pt-1 bg-blue-500 text-xs text-white h-5 w-10 rounded" on:click={() => saveChanges(instrument, "Instrument")}>Save</button>
									<button class="mb-2 pt-1 bg-red-400 text-xs text-white h-5 w-10 rounded" on:click={() => editingInstruments[instrument._id] = false}>Cancel</button>
								{:else}
									<button class="mb-2 pt-1 bg-green-500 text-xs text-white h-5 w-10 rounded" on:click={() => startEditing(instrument, "Instrument")}>Edit</button>
								{/if}
								
							{/if}
						</div>

					{/each}

					<hr>
					<div class="font-defaultText px-2 py-4 text-left font-semibold">
						<iconify-icon class="text-xl" icon="icon-park-twotone:new-computer" ></iconify-icon>
						PCs [{roomData?.PCs?.length}]
					</div>
					{#each roomData.PCs as pc}
					<div class="font-defaultText bg-gray-200 px-2 mb-3 rounded-lg hover:bg-gray-300 border border-gray-500">
						<div class="flex justify-between items-center cursor-pointer " on:click={() => togglePCs(pc)} on:keydown>
							<div class="pt-1">{pc.name}</div>
							
							{#if removeItems }
								<button class="rounded-lg hover:bg-red-300" on:click={() => unassignItem(pc, "PC")}> 
									<iconify-icon class="px-2 pt-1 text-xl" icon="mdi:close" ></iconify-icon>
								</button>
							{/if}

						</div>

						{#if pc.expanded} <!-- PC clicked => expanded -->
								<div class="py-2 mb-4 overflow-auto">
									<table class="text-left text-sm w-full  shadow-lg">

										{#if editingPCs[pc._id]}
											<tr class="border border-b-gray-400">
												<td>Name:</td>
												<td>
													<input type="text" bind:value={pc.name} class="h-6 rounded-lg  w-full">
												</td>
											</tr>
											<tr class="border border-b-gray-400">
												<td>Lansweeper:</td>
												<td>
													<input type="text" bind:value={pc.lansweeper} class="h-6 rounded-lg  w-full">
												</td>
											</tr>
										{:else}
											<tr class="border border-b-gray-400">
												<td>Lansweeper:</td>
												<td>{pc.lansweeper}</td>
											</tr>
										{/if}

									</table>
								</div>
								{#if editingPCs[pc._id]}
									<button class="mb-2 pt-1 bg-blue-500 text-xs text-white h-5 w-10 rounded" on:click={() => saveChanges(pc, "PC")}>Save</button>
									<button class="mb-2 pt-1 bg-red-400 text-xs text-white h-5 w-10 rounded" on:click={() => editingPCs[pc._id] = false}>Cancel</button>
								{:else}
									<button class="mb-2 pt-1 bg-green-500 text-xs text-white h-5 w-10 rounded" on:click={() => startEditing(pc, "PC")}>Edit</button>
								{/if}
								
						{/if}

					</div>	
					{/each}

					<hr>
					<div class="font-defaultText px-2 py-4 text-left font-semibold">
						<iconify-icon class="text-xl" icon="icon-park-twotone:network-tree" ></iconify-icon>
						Network Points [{roomData?.netWorkPorts?.length}]
					</div>
					{#each roomData.netWorkPorts as port}
					<div class="font-defaultText bg-gray-200 px-2 mb-3 rounded-lg hover:bg-gray-300 border border-gray-500">
						<div class="flex justify-between items-center cursor-pointer " on:click={() => toggleNetworkPoint(port)} on:keydown>
							<div class="pt-1">{port.name}</div>
							
							{#if removeItems }
								<button class="rounded-lg hover:bg-red-300" on:click={() => unassignItem(port, "Network Point")}> 
									<iconify-icon class="px-2 pt-1 text-xl" icon="mdi:close" ></iconify-icon>
								</button>
							{/if}

						</div>
						{#if port.expanded} <!-- PORT clicked => expanded -->
								<div class="py-2 mb-4 overflow-auto">
									<table class="text-left text-sm w-full  shadow-lg">

										{#if editingNetworkPoints[port._id]}
											<tr class="border border-b-gray-400">
												<td>Name:</td>
												<td>
													<input type="text" bind:value={port.name} class="h-6 rounded-lg  w-full">
												</td>
											</tr>
											<tr class="border border-b-gray-400">
												<td>Switch Port:</td>
												<td>
													<input type="text" bind:value={port.switchPort} class="h-6 rounded-lg  w-full">
												</td>
											</tr>
										{:else}
											<tr class="border border-b-gray-400">
												<td>Switch Port:</td>
												<td>{port.switchPort}</td>
											</tr>
										{/if}

									</table>
								</div>
								{#if editingNetworkPoints[port._id]}
									<button class="mb-2 pt-1 bg-blue-500 text-xs text-white h-5 w-10 rounded" on:click={() => saveChanges(port, "Network Point")}>Save</button>
									<button class="mb-2 pt-1 bg-red-400 text-xs text-white h-5 w-10 rounded" on:click={() => editingNetworkPoints[port._id] = false}>Cancel</button>
								{:else}
									<button class="mb-2 pt-1 bg-green-500 text-xs text-white h-5 w-10 rounded" on:click={() => startEditing(port, "Network Point")}>Edit</button>
								{/if}
								
						{/if}

					</div>	
					{/each}
				{/if}		
			
				
			{:else} <!-- IF USER -->

				{#if roomData }
					<div class="font-defaultText px-2 py-4 text-left font-semibold">
						<iconify-icon class="text-xl" icon="pajamas:api" ></iconify-icon>
						Instruments [{roomData?.instruments?.length}]
					</div>					
					{#each roomData.instruments as instrument}
						<div class="font-defaultText bg-gray-200 px-2 mb-3 rounded-lg hover:bg-gray-300 border border-gray-500">
							<div class="flex justify-between items-center cursor-pointer " on:click={() => toggleInstrument(instrument)} on:keydown>
								<div class="pt-1">{instrument.name}</div>
							</div>

							{#if instrument.expanded}
								<div class="py-2 mb-4 overflow-auto">
									<table class="text-left text-sm w-full  shadow-lg">
									<tr class="border border-b-gray-400">
										<td>PC : <iconify-icon class="px-2 pt-1 text-xl " icon="mdi:connection" style="color: green;"></iconify-icon> </td>  
										
										<td>{instrument.connectedTo}</td>
									</tr>	
									<tr class="border border-b-gray-400">
										<td>Bmram:</td>
										<td>{instrument.bmram}</td>
									</tr>
									<tr class="border border-b-gray-400">
										<td>Lansweeper:</td>
										<td>{instrument.lansweeper}</td>
									</tr>
									<tr class="border border-b-gray-400">
										<td>Action required:</td>
										<td>{instrument.actionRequired}</td>
									</tr>
									<tr class="border border-b-gray-400">
										<td>Note:</td>
										<td>{instrument.note}</td>
									</tr>
									</table>
								</div>
							{/if}
						</div>	
					{/each}

					<hr>

					<div class="font-defaultText px-2 py-4 text-left font-semibold">
						<iconify-icon class="text-xl" icon="icon-park-twotone:new-computer" ></iconify-icon>
						PCs [{roomData?.PCs?.length}]
					</div>
					{#each roomData.PCs as pc}
						<div class="font-defaultText bg-gray-200 px-2 mb-3 pt-1 rounded-lg text-left border border-gray-500">{pc.name}</div>
					{/each}

					<hr>

					<div class="font-defaultText px-2 py-4 text-left font-semibold">
						<iconify-icon class="text-xl" icon="icon-park-twotone:network-tree" ></iconify-icon>
						Network Points [{roomData?.netWorkPorts?.length}]
					</div>
					{#each roomData.netWorkPorts as port}
						<div class="font-defaultText bg-gray-200 px-2 mb-3 pt-1 rounded-lg text-left border border-gray-500">{port.name}</div>
					{/each}
				{/if}
				
			{/if}
			<hr>
			
		
			<br> <br> <br>
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