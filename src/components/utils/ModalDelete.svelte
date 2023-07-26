<script>
    import { onDestroy, onMount, afterUpdate } from 'svelte';
    import { baseURL } from '../../store/store';
  
    export let activeTab;
    export let modalItem;
    export let modalActionSuccess;

    let deleteStatus = null;

    let roomInstruments = [];
    let instrumentRooms = [];


    $: {
        if (modalItem && modalItem.activeTab === "Rooms") {
            showRoomInstruments();
        }

        if (modalItem.action === "Delete" && modalItem.activeTab === "Instruments") {
            showInstrumentRooms();
        }
    }


   


    const deleteRoom = async ()  => {
        try {
            const response = await fetch(`${baseURL}/api/rooms/${modalItem._id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            deleteStatus = "Failed to delete room";
        }

            modalActionSuccess();
            deleteStatus = "Room deleted successfully";
        } catch (error) {
            console.error(error);
        }
    }

    const deleteDepartment = async ()  => {
        try {
            const response = await fetch(`${baseURL}/api/departments/${modalItem._id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            deleteStatus = "Failed to delete department";
        }

            modalActionSuccess();
            deleteStatus = "Department deleted successfully";
        } catch (error) {
            console.error(error);
        }
    }

    const deleteInstrument = async ()  => {
        try {
            const response = await fetch(`${baseURL}/api/instruments/${modalItem._id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            deleteStatus = "Failed to delete instrument";
        }

            modalActionSuccess();
            deleteStatus = "Instrument deleted successfully";
        } catch (error) {
            console.error(error);
        }
    }

    const showRoomInstruments = async () => {
        fetch(`${baseURL}/api/1room-instruments?roomName=${modalItem.name}`)
        .then(response => response.json())
        .then(data => {
            roomInstruments = data;
            console.log(roomInstruments);
        })
        .catch(error => {
            console.log(error.message);
        });
    }

    const showInstrumentRooms = async () => {
        fetch(`${baseURL}/api/1instrument-rooms?instrumentName=${modalItem.name}`)
        .then(response => response.json())
        .then(data => {
            instrumentRooms = data;
            console.log(instrumentRooms);
        })
        .catch(error => {
            console.log(error.message);
        });
    }



  
</script>


{#if activeTab == "Rooms"}
    <div>
        <div class="text-xl font-semibold text-red-600">Delete this room?</div>
        
        {#if roomInstruments?.instruments?.length > 0}
        <div class="text-lg font-semibold text-red-400">It will also unassign all instruments associated with this room:</div>
        <hr>
				{#each roomInstruments?.instruments as instrument}
					<div class="font-defaultText px-2 py-4 text-sm text-left">{instrument.name}</div>
				{/each}
			
			{:else}
				<div class="font-defaultText px-2 py-4 text-sm text-left">No Instruments</div>
		{/if}
        
        <hr>
        <button on:click={deleteRoom} class="border-4 py-1 px-2 my-4 rounded-xl font-semibold  hover:border-red-400">Delete</button>

        
    </div>


{:else if activeTab == "Departments"}
    <div>
        <div class="text-xl font-semibold text-red-600">Delete this department?</div>
        
        <button on:click={deleteDepartment} class="border-4 py-1 px-2 my-4 rounded-xl font-semibold  hover:border-red-400">Delete</button>

    </div>

{:else if activeTab == "Instruments"}
    <div>
        <div class="text-xl font-semibold text-red-600">Delete this instrument?</div>
        {#if instrumentRooms?.length > 0}
        <div class="text-lg font-semibold text-red-400">It will also unassign all rooms associated with this instrument:</div>
        <hr>
				{#each instrumentRooms as room}
					<div class="font-defaultText px-2 py-4 text-sm text-left">{room.roomName}</div>
				{/each}
			
			{:else}
				<div class="font-defaultText px-2 py-4 text-m text-left">No rooms associated with this instrument</div>
		{/if}

        <button on:click={deleteInstrument} class="border-4 py-1 px-2 my-4 rounded-xl font-semibold  hover:border-red-400">Delete</button>

    </div>

{/if}
  

{#if deleteStatus}
    <div class="bg-green-200 rounded-lg font-defaultText px-2 mt-8 py-2 font-semibold">{deleteStatus}</div>
{/if}

  