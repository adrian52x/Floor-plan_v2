<script>
    import { fly } from 'svelte/transition';
    import { buildings } from '../store/data.js'
	import Spinner from './Spinner.svelte';
	import { onDestroy } from 'svelte';

   
	export let floorData;
	export let instruments;

	
	let rooms = floorData.rooms
	let departments = floorData.departments
	

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

	// $: {
	
	// 	if (adminSearch && adminSearch.length >= 1) {

	// 		showRooms = rooms.filter(item => {
	// 			const roomName = item.name.toLowerCase();
	// 			const searchValue = adminSearch.toLowerCase();
	// 			return roomName.includes(searchValue); 
	// 		});
		
	// 	console.log("after search", rooms);
	// 	} else {
	// 		showRooms = rooms;
	// 	}	
	// }
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

		<div class="flex flex-wrap space-x-2 pt-3 justify-center">
			<button on:click={() => handleTabClick(roomsTab)} class={`${activeTab == roomsTab ? 'bg-gray-500 text-white' : 'bg-gray-200'} py-1 px-2 mb-3  rounded-lg font-semibold `}> {roomsTab} </button>
			<button on:click={() => handleTabClick(departmentsTab)} class={`${activeTab == departmentsTab ? 'bg-gray-500 text-white' : 'bg-gray-200'} py-1 px-2 mb-3 rounded-lg font-semibold `} > {departmentsTab} </button>
			<button on:click={() => handleTabClick(instrumentsTab)} class={`${activeTab == instrumentsTab ? 'bg-gray-500 text-white' : 'bg-gray-200'} py-1 px-2 mb-3 rounded-lg font-semibold `} > {instrumentsTab} </button>
			
		</div>
		<input class="font-digits w-full" placeholder="Search" bind:value={adminSearch} />
		<hr class="h-1 bg-gray-200 mb-2">

		{#if activeTab === roomsTab}
			{#each showItems as room }
				<div class="bg-gray-200  px-2 mb-3  rounded-lg flex justify-between">
					<div>{room.name}</div>
					<div>
						<button>Edit</button>
        				<button>Remove</button>
					</div>
				</div>	
			{/each}
		{/if}

		{#if activeTab === departmentsTab}
			{#each showItems as department }
				<div class="bg-gray-200 py-1 px-2 mb-3  rounded-lg">{department.name}</div>
			{/each}
		{/if}

		{#if activeTab === instrumentsTab}
			{#each showItems as instrument }
				<div class="bg-gray-200 py-1 px-2 mb-3  rounded-lg">{instrument.instrumentName}</div>
			{/each}
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
            zoom: 0.8;
	    }
		@media (max-width: 1200px) {
			width: 320px;
            zoom: 0.6;
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