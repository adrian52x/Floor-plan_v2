<script>
    import { fly } from 'svelte/transition';
    import { baseURL } from '../../store/store';
	import { onMount } from 'svelte';


    let actionRequired = "";
    let connectedTo = "";
    let room = "";

    let instruments = null;
    let pcs = null;
    let networkPoints = null;
    
    let activeTab = 'Instruments';
    const handleTabClick = (event) => {
        activeTab = event.target.dataset.tab;
    };

    const generateInstrument = async () => {
        const body = {
            actionRequired,
			connectedTo,
			room
        };

        try {
			const response = await fetch(`${baseURL}/api/instruments/filter`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
			});

			instruments = await response.json();

		} catch (error) {
			console.error(error);
			// Handle error scenario, show error message, etc.
		}

        console.log(body);
        console.log(instruments);
    }

    const generatePCs = async () => {
        const url = `${baseURL}/api/pcs`;
        const response = await fetch(url);
        pcs = await response.json();
    };

    const generatePorts = async () => {
        const url = `${baseURL}/api/netports`;
        const response = await fetch(url);
        networkPoints = await response.json();
    };
   
</script>


<div class="fixed bg-gray-100 border-r-2 shadow-lg w-full h-full" transition:fly={{x: -1000, opacity: 1}}>
    <div class="font-defaultText relative  left-10 top-8" >Report generator:</div>
    <div class="main-container">
        
        

        <div class="tabs">
            <button
            class={`tab font-digits hover:underline rounded bg-gray-200 ${activeTab ==='Instruments' ? 'bg-green-200' : '' }`}
              on:click={handleTabClick}
              class:selected={activeTab === 'Instruments'}
              data-tab="Instruments"
            >
              Instruments
            </button>
            <button
            class={`tab font-digits hover:underline rounded bg-gray-200 ${activeTab ==='PCs' ? 'bg-green-200' : '' }`}
              on:click={handleTabClick}
              class:selected={activeTab === 'PCs'}
              data-tab="PCs"
            > 
              PCs
            </button>
            <button
              class={`tab font-digits hover:underline rounded bg-gray-200 ${activeTab ==='Network points' ? 'bg-green-200' : '' }`}
              on:click={handleTabClick}
              class:selected={activeTab === 'Network points'}
              data-tab="Network points"
            >
              Network points
            </button>
        </div>
        
        {#if activeTab === 'Instruments'}
            <div class="report-generator">
                
    
                <div class="ml-4 mt-4 mb-4 space-y-4 font-defaultText">

                    <div class="font-defaultText mt-2">Filters:</div>
                    

                    <div>
                        <span class="text-sm">Action Required ?</span>
                        <select class="rounded-md text-xs" bind:value={actionRequired}>
                            <option value=""  selected >---</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div>
                        <span class="text-sm">Connected to a PC ?</span>
                        <select class="rounded-md text-xs" bind:value={connectedTo}>
                            <option value=""  selected >---</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div>
                        <span class="text-sm">Assigned to a room ?</span>
                        <select class="rounded-md text-xs" bind:value={room}>
                            <option value=""  selected >---</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>


                    <div>
                        <button on:click={() => generateInstrument()} class="font-digits px-2 py-2 rounded border border-green-300 hover:bg-green-400">
                            <iconify-icon class="text-xl h-4" icon="pajamas:api" ></iconify-icon>
                            Generate
                        </button>
                    </div>

                </div>

                    
            </div>

            


            {#if instruments}
                <div class="report">
                    <div class="table-container">
                        <table class="table-auto ">
                        <thead>
                            <tr>
                            <th class="px-4 py-2">Name</th>
                            <th class="px-4 py-2">BMRAM</th>
                            <th class="px-4 py-2">Lansweeper</th>
                            <th class="px-4 py-2">Action Required</th>
                            <th class="px-4 py-2">Note</th>
                            <th class="px-4 py-2">Connected To</th>
                            <th class="px-4 py-2">Room ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each instruments as instrument}
                            <tr>
                                <td class="border px-4 py-2">{instrument?.name}</td>
                                <td class="border px-4 py-2">{instrument?.bmram}</td>
                                <td class="border px-4 py-2">{instrument?.lansweeper}</td>
                                <td class="border px-4 py-2">{instrument?.actionRequired ? 'Yes' : 'No'}</td>
                                <td class="border px-4 py-2">{instrument?.note}</td>
                                <td class="border px-4 py-2">{instrument?.connectedTo}</td>
                                <td class="border px-4 py-2">{instrument?.room_id}</td>
                            </tr>
                            {/each}
                        </tbody>
                        </table>
                    </div>   
                </div>
            {/if}


        {:else if activeTab === 'PCs'}
            <div class="report-generator">
                
                <div class="ml-4 mt-4 mb-4 space-y-4 font-defaultText">

                    <div class="font-defaultText mt-2">No filters:</div>
                
                    <div>
                        <button on:click={() => generatePCs()} class="font-digits px-2 py-2 rounded border border-green-300 hover:bg-green-400">
                            <iconify-icon class="text-xl h-4" icon="pajamas:api" ></iconify-icon>
                            Generate
                        </button>
                    </div>

                </div>
                
            </div>

            {#if pcs}
                <div class="report">
                    
                    {#each pcs as pc }
                        <div> {pc?.name}</div>
                    {/each}
                
                </div>
            {/if}

        {:else if activeTab === 'Network points'}
            <div class="report-generator">
                    
                <div class="ml-4 mt-4 mb-4 space-y-4 font-defaultText">

                    <div class="font-defaultText mt-2">No filters:</div>
                
                    <div>
                        <button on:click={() => generatePorts()} class="font-digits px-2 py-2 rounded border border-green-300 hover:bg-green-400">
                            <iconify-icon class="text-xl h-4" icon="pajamas:api" ></iconify-icon>
                            Generate
                        </button>
                    </div>

                </div>
                
            </div>

            {#if networkPoints}
                <div class="report">
                    
                    {#each networkPoints as port }
                        <div> {port?.name}</div>
                    {/each}
                
                </div>
            {/if}

        {/if}
 

    </div>
</div>

<style lang="scss">


.main-container {
    margin-top: 20px;    
    display: flex;
    flex-direction: column;
    align-items: center;
}

.report-generator {
  box-shadow: 0px 4px 8px rgba(129, 128, 128, 0.2);
  margin-left: -100px;
  border-radius: 8px;
  width: 50%;
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.report {
  box-shadow: 0px 4px 8px rgba(129, 128, 128, 0.2);
  border-radius: 8px;
  //width: fit-content; /* Adjusted width to fit the table */
  margin-bottom: 20px;
  overflow: auto; /* Added horizontal scrolling */
  max-height: 500px;
  max-width: 800px;
  display: grid;
  place-items: center;
}

table {
  width: max-content; /* Adjusted width to fit the table content */
  border-collapse: collapse;
}



.tabs {
    margin-left: -100px;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.tab {
    //background-color: transparent;
    //border: none;
    color: #333;
    cursor: pointer;
    font-size: 1.25rem;
    padding: 0.5rem 1rem;
    text-align: center;
    margin-right: 10px;
    //text-transform: uppercase;
}



</style>