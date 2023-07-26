<script>
    import { fly } from 'svelte/transition';
    import { buildings } from '../store/data.js'
	import Spinner from './Spinner.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Modal from './utils/Modal.svelte';
	import ModalDelete from './utils/ModalDelete.svelte';
	import ModalUpdate from './utils/ModalUpdate.svelte';
	import ModalCreate from './utils/ModalCreate.svelte';
	
	
	export let pagePath;
	export let floorData;
	export let currentFloorId;
	export let instruments;

	export let modalItem;

	console.log(modalItem);

	onMount(() => {
		modalItem = null;
	})

	let showModal = false;
	let modalAction = '';
	const modalActionCreate = 'Create';
	const modalActionUpdate = 'Update';
	const modalActionDelete = 'Delete';
	

	//Test
	let newItem;
	const addNewItem = () => {
		switch (activeTab) {
			case roomsTab:
				newItem = {
					name: null,
					type: '',
					position: [{
						left: 0,
						top: 0,
						width: 100,
						height: 100,
					}]
				}
				break;
			case departmentsTab:
				newItem = {
					name: null,
					color: '#5F9EA0',
					position: [{
						left: 0,
						top: 0,
						width: 200,
						height: 100,
					}]
				}
				break;
			case instrumentsTab:
				newItem = {
					name: null,
					description: null
				}
				break;
		}
	}

	// let newRoom = {
    //     name: 'Add new room',
    //     type: '',
    //     position: [{
    //         left: 0,
    //         top: 0,
    //         width: 100,
    //         height: 100,
    //     }]
    // }
	
	

	const openModal = (item, modalActionOption) => {
        showModal = true;
		modalAction = modalActionOption;

		modalItem = {
			...item,
			activeTab: activeTab, // save current activeTab
			action: modalActionOption // save current action

		};
		
		console.log(modalItem);
		
			
    }

	// Unfinished
	const modalActionSuccess = () => {
		setTimeout(() => {
        	location.replace(`/${pagePath.selectedBuilding}/${pagePath.selectedFloor}`)
      	}, 1000)
	};

	
	let rooms = floorData?.rooms
	let departments = floorData?.departments
	

	console.log("rooms", rooms);
	console.log("departments", departments);
	console.log("instruments", instruments);
	
	let roomsTab = "Rooms";
	let departmentsTab = "Departments";
	let instrumentsTab = "Instruments"

	let activeTab = roomsTab;

	function handleTabClick(tab) {
    	activeTab = tab;
  	}

	function filter_searchItems(items, searchValue) {
		return items.filter(item => {
			const itemName = item.name.toLowerCase();
			const searchValueLowerCase = searchValue.toLowerCase();
			return itemName.includes(searchValueLowerCase);
  	});
}

	  let adminSearch = '';
	  let showItems = [];


	$: {
		if (adminSearch && adminSearch.length >= 1) {
			switch (activeTab) {
				case roomsTab:
					showItems = filter_searchItems(rooms, adminSearch);
					break;
				case departmentsTab:
					showItems = filter_searchItems(departments, adminSearch);
					break;
				case instrumentsTab:
					showItems = filter_searchItems(instruments, adminSearch);
					break;
			}
		} else {
			switch (activeTab) {
				case roomsTab:
					showItems = rooms;
					break;
				case departmentsTab:
					showItems = departments;
					break;
				case instrumentsTab:
					showItems = instruments;
					break;
			}
		}
	}

	

</script>
    
    <nav class="z-50 fixed bg-gray-100 border-r-2 shadow-xl" transition:fly={{x: 400, opacity: 1}}>
		<div class="flex justify-end w-full font-defaultText"> Manage </div>

		<div class="nav-header">
			<div class="flex flex-wrap space-x-2 pt-3 justify-center">
				<button on:click={() => handleTabClick(roomsTab)} class={`${activeTab == roomsTab ? 'bg-gray-500 text-white' : 'bg-gray-200'} py-1 px-2 mb-3  rounded-lg font-semibold `}> {roomsTab} </button>
				<button on:click={() => handleTabClick(departmentsTab)} class={`${activeTab == departmentsTab ? 'bg-gray-500 text-white' : 'bg-gray-200'} py-1 px-2 mb-3 rounded-lg font-semibold `} > {departmentsTab} </button>
				<button on:click={() => handleTabClick(instrumentsTab)} class={`${activeTab == instrumentsTab ? 'bg-gray-500 text-white' : 'bg-gray-200'} py-1 px-2 mb-3 rounded-lg font-semibold `} > All {instrumentsTab} </button>
				
			</div>
			<input name="adminSearch" class="font-digits w-full" placeholder="Search" bind:value={adminSearch} />
			<hr class="h-1 bg-gray-200 mb-2">
		</div>
		<div class="nav-content">
			<div class="flex justify-end mb-2">
				<div class="font-digits px-1 pt-1">Add</div>
				<div class="mr-2 border-4 rounded-xl font-semibold hover:border-green-300 w-9 h-9" on:keyup on:click={() => { addNewItem(); openModal(newItem, modalActionCreate) }}><iconify-icon class=" text-xl px-1 pt-1" icon="mdi:add" ></iconify-icon></div>    
			</div>
			{#if activeTab === roomsTab}
				{#each showItems as room }
					<div class="bg-gray-200 py-1 px-2 mb-3  rounded-lg flex justify-between">
						<div>{room.name}</div>
						<div>
							<button class="underline" on:click={() => openModal(room, modalActionUpdate)}> 
								<iconify-icon class="px-2" icon="mdi:edit"></iconify-icon>
							</button>
							
							<button class="underline" on:click={() => openModal(room, modalActionDelete)}> 
								<iconify-icon class="px-2" icon="mdi:delete"></iconify-icon>
							</button>
						</div>
					</div>	
				{/each}
			{/if}

			{#if activeTab === departmentsTab}
				{#each showItems as department }
					<div class="bg-gray-200 py-1 px-2 mb-3  rounded-lg flex justify-between">
						<div>{department.name}</div>
						<div>
							<button class="underline" on:click={() => openModal(department, modalActionUpdate)}> 
								<iconify-icon class="px-2" icon="mdi:edit"></iconify-icon>
							</button>
							
							<button class="underline" on:click={() => openModal(department, modalActionDelete)}> 
								<iconify-icon class="px-2" icon="mdi:delete"></iconify-icon>
							</button>
						</div>
					</div>
				{/each}
			{/if}

			{#if activeTab === instrumentsTab}
				{#each showItems as instrument }
					<div class="bg-gray-200 py-1 px-2 mb-3  rounded-lg flex justify-between">
						<div>{instrument.name}</div>
						<div>
							<button class="underline" on:click={() => openModal(instrument, modalActionUpdate)}> 
								<iconify-icon class="px-2" icon="mdi:edit"></iconify-icon>
							</button>
							
							<button class="underline" on:click={() => openModal(instrument, modalActionDelete)}> 
								<iconify-icon class="px-2" icon="mdi:delete"></iconify-icon>
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>


		
	</nav>

	<Modal bind:showModal>
		<div class="font-digits text-xl pt-2" slot="header">{modalItem?.name ? modalItem.name : ''}</div>
		<div class="modal-content">
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<!-- <img src="/import_example.jpg" alt="Image"> -->

			{#if modalAction == modalActionCreate}
				<ModalCreate {activeTab} bind:modalItem = {modalItem} {modalActionSuccess} {currentFloorId}/>
			{:else if modalAction == modalActionUpdate}
				<ModalUpdate {activeTab} bind:modalItem = {modalItem} {modalActionSuccess}/>	
			{:else if modalAction == modalActionDelete}	
			 	<ModalDelete {activeTab} {modalItem} {modalActionSuccess}/>
			{/if}
			
		</div>
	</Modal>
    
<style lang="scss">
	nav {
		display: flex;
		flex-direction: column;
		overflow: hidden;

		top: 0;
		right: 0;
		height: 100%;
		padding: 2rem 1rem 0.6rem;
		//overflow-y: auto;
		width: 380px;
		//display: inline-block;

		@media (max-width: 1600px) {
			width: 350px;
            zoom: 0.8;
	    }
		@media (max-width: 1200px) {
			width: 320px;
            zoom: 0.6;
		}
	}

	.nav-header {
		flex: 0 0 auto;
		/* Add your desired styles for the header */
	}

	.nav-content {
		flex: 1 1 auto;
		overflow-y: auto;
		/* Add your desired styles for the scrollable content */
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

	input {
		color: inherit;
		background-color: transparent;
		border: 1px solid rgb(214, 206, 206);
		padding: 5px;
		border-radius: 5px;
		font-size: 1.15em;
        margin-bottom: 5px;
		margin-top: 10px;

		&:focus {
			outline: 1px solid rgb(0, 0, 0);
		}
	}
</style>