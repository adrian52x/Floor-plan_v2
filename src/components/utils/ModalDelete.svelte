<script>
    import { onDestroy, onMount, afterUpdate } from 'svelte';
    import { baseURL } from '../../store/store';
  
    export let activeTab;
    export let modalItem;
    export let modalActionSuccess;

    let deleteStatus = null;

    let roomItems = [];
    let instrumentRooms = [];
    let pcRooms = [];
    let networkPointRooms = [];


    $: {
        if (modalItem && modalItem.activeTab === "Rooms") {
            showRoomItems();
        }

        if (modalItem.action === "Delete" && modalItem.activeTab === "Instruments") {
            showIntrumentRooms();
        }

        if (modalItem.action === "Delete" && modalItem.activeTab === "PCs") {
            showPCRooms();
        }

        if (modalItem.action === "Delete" && modalItem.activeTab === "Network Points") {
            showNetworkPointRooms();
        }
    }


   


    const deleteRoom = async ()  => {
        try {
            const token = localStorage.getItem('jwt_auth');
            const response = await fetch(`${baseURL}/api/rooms/${modalItem._id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
                },
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
            const token = localStorage.getItem('jwt_auth');
            const response = await fetch(`${baseURL}/api/departments/${modalItem._id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
                },
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
            const token = localStorage.getItem('jwt_auth');
            const response = await fetch(`${baseURL}/api/instruments/${modalItem._id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
                },
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

    const deletePC = async ()  => {
        try {
            const token = localStorage.getItem('jwt_auth');
            const response = await fetch(`${baseURL}/api/pcs/${modalItem._id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
                },
        });

        if (!response.ok) {
            deleteStatus = "Failed to delete PC";
        }

            modalActionSuccess();
            deleteStatus = "PC deleted successfully";
        } catch (error) {
            console.error(error);
        }
    }

    const deleteNetworkPoint = async ()  => {
        try {
            const token = localStorage.getItem('jwt_auth');
            const response = await fetch(`${baseURL}/api/netports/${modalItem._id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
                },
        });

        if (!response.ok) {
            deleteStatus = "Failed to delete Network Point";
        }

            modalActionSuccess();
            deleteStatus = "Network Point deleted successfully";
        } catch (error) {
            console.error(error);
        }
    }

    const showRoomItems = async () => {
        fetch(`${baseURL}/api/1room-items?roomName=${modalItem.name}`)
        .then(response => response.json())
        .then(data => {
            roomItems = data;
        })
        .catch(error => {
            console.log(error.message);
        });
    }

    const showIntrumentRooms = async () => {
        fetch(`${baseURL}/api/instruments/${modalItem._id}`)
        .then(response => response.json())
        .then(data => {
            instrumentRooms = data;
        })
        .catch(error => {
            console.log(error.message);
        });
    }

    const showPCRooms = async () => {
        fetch(`${baseURL}/api/pcs/${modalItem._id}`)
        .then(response => response.json())
        .then(data => {
            pcRooms = data;
        })
        .catch(error => {
            console.log(error.message);
        });
    }

    const showNetworkPointRooms = async () => {
        fetch(`${baseURL}/api/netports/${modalItem._id}`)
        .then(response => response.json())
        .then(data => {
            networkPointRooms = data;
        })
        .catch(error => {
            console.log(error.message);
        });
    }



  
</script>


{#if activeTab == "Rooms"}
    <div>
        <div class="text-xl font-semibold text-red-600">Delete this room?</div>
        <div class="text-m font-semibold text-red-400">Instruments/PCs/Network Points associated with this room (will be unassigned) :</div>

        {#if roomItems?.instruments}
            <div class="font-defaultText px-2 py-4 text-left font-semibold">Instruments [{roomItems?.instruments?.length}]</div>
			{#each roomItems?.instruments as instrument}
				<div class="font-defaultText px-2 py-2 text-sm text-left">{instrument.name}</div>
			{/each}
		{/if}

        <hr>

        {#if roomItems?.PCs}
            <div class="font-defaultText px-2 py-4 text-left font-semibold">PCs [{roomItems?.PCs?.length}]</div>
			{#each roomItems?.PCs as pc}
				<div class="font-defaultText px-2 py-2 text-sm text-left">{pc.name}</div>
			{/each}
		{/if}

        <hr>

        {#if roomItems?.netWorkPorts}
            <div class="font-defaultText px-2 py-4 text-left font-semibold">Network Points [{roomItems?.netWorkPorts?.length}]</div>
			{#each roomItems?.netWorkPorts as port}
				<div class="font-defaultText px-2 py-2 text-sm text-left">{port.name}</div>
			{/each}
		{/if}
        <hr>
        
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
        {#if instrumentRooms.roomName !== null }
            <div class="text-lg font-semibold text-red-400">Room associated with this instrument:</div>
            <hr>
            <div class="font-defaultText px-2 py-4 text-m text-left">{instrumentRooms.roomName}</div>
				
		{:else}
			<div class="font-defaultText px-2 py-4 text-m text-left">No room associated with this instrument</div>
		{/if}

        <button on:click={deleteInstrument} class="border-4 py-1 px-2 my-4 rounded-xl font-semibold  hover:border-red-400">Delete</button>

    </div>


{:else if activeTab == "PCs"}
    <div>
        <div class="text-xl font-semibold text-red-600">Delete this PC?</div>
        {#if pcRooms.roomName !== null }
            <div class="text-lg font-semibold text-red-400">Room associated with this PC:</div>
            <hr>
            <div class="font-defaultText px-2 py-4 text-m text-left">{pcRooms.roomName}</div>
				
		{:else}
			<div class="font-defaultText px-2 py-4 text-m text-left">No room associated with this PC</div>
		{/if}

        <button on:click={deletePC} class="border-4 py-1 px-2 my-4 rounded-xl font-semibold  hover:border-red-400">Delete</button>

    </div>


{:else if activeTab == "Network Points"}
    <div>
        <div class="text-xl font-semibold text-red-600">Delete this Network Point?</div>
        {#if networkPointRooms.roomName !== null }
            <div class="text-lg font-semibold text-red-400">Room associated with this Network Point:</div>
            <hr>
            <div class="font-defaultText px-2 py-4 text-m text-left">{networkPointRooms.roomName}</div>
				
		{:else}
			<div class="font-defaultText px-2 py-4 text-m text-left">No room associated with this Network Point</div>
		{/if}

        <button on:click={deleteNetworkPoint} class="border-4 py-1 px-2 my-4 rounded-xl font-semibold  hover:border-red-400">Delete</button>

    </div>

{/if}
  

{#if deleteStatus}
    <div class="bg-green-200 rounded-lg font-defaultText px-2 mt-8 py-2 font-semibold">{deleteStatus}</div>
{/if}

  