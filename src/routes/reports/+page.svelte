<script>
    import { fly } from 'svelte/transition';
    import { baseURL } from '../../store/store';
    import { user } from '../../security/auth';


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

    const generateInstruments = async () => {
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

    function download_InstrumentsCSV() {
        const headers = ["Name", "BMRAM", "Action Required", "Note", "Connected to PC", "Room"];
        const rows = instruments.map(instrument => {
            const { name, bmram, actionRequired, note, connectedTo, room_id } = instrument;
            return [name, bmram, actionRequired ? 'Yes' : 'No', note, connectedTo || 'N/A', room_id || 'N/A'];
        });

        const csvContent = [headers, ...rows]
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "floorPlan-Instruments-report.csv";
        link.click();
    }

    function download_PcsCSV() {
        const headers = ["Name", "Lansweeper"];
        const rows = pcs.map(pc => {
            const { name, lansweeper } = pc;
            return [name, lansweeper];
        });

        const csvContent = [headers, ...rows]
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "floorPlan-PCs-report.csv";
        link.click();
    }

    function download_PortsCSV() {
        const headers = ["Name", "Switch Port"];
        const rows = networkPoints.map(port => {
            const { name, switchPort } = port;
            return [name, switchPort];
        });

        const csvContent = [headers, ...rows]
            .map(row => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "floorPlan-NetworkPoints-report.csv";
        link.click();
    }


   
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
                            <button on:click={() => generateInstruments()} class="font-digits px-2 py-2 rounded border border-green-300 hover:bg-green-400">
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
                                <th class="px-4 py-2">Action Required</th>
                                <th class="px-4 py-2">Note</th>
                                <th class="px-4 py-2">Connected To</th>
                                <th class="px-4 py-2">Room</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each instruments as instrument}
                                <tr>
                                    <td class="border px-4 py-2">{instrument?.name}</td>
                                    <td class="border px-4 py-2">{instrument?.bmram}</td>
                                    <td class="border px-4 py-2">{instrument?.actionRequired ? 'Yes' : 'No'}</td>
                                    <td class="note-cell text-xs border px-4 py-2">{instrument?.note}</td>
                                    <td class="border px-4 py-2">{instrument?.connectedTo ? instrument.connectedTo : "N/A"}</td>
                                    <td class="border px-4 py-2">{instrument?.room_id}</td>
                                </tr>
                                {/each}
                            </tbody>
                            </table>
                        </div>   
                    </div>
                    <button class="px-2 py-2 rounded border border-green-300 hover:bg-green-400" 
                        on:click={download_InstrumentsCSV}> Download as CSV
                    </button>
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
                        
                        <div class="table-container">
                            <table class="table-auto ">
                            <thead>
                                <tr>
                                <th class="px-4 py-2">Name</th>
                                <th class="px-4 py-2">Lansweeper</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each pcs as pc}
                                <tr>
                                    <td class="border px-4 py-2">{pc?.name}</td>
                                    <td class="border px-4 py-2">{pc?.lansweeper}</td>
                                </tr>
                                {/each}
                            </tbody>
                            </table>
                        </div>
                    </div>
                    <button class="px-2 py-2 rounded border border-green-300 hover:bg-green-400" 
                        on:click={download_PcsCSV}> Download as CSV
                    </button>
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
                        
                        <div class="table-container">
                            <table class="table-auto ">
                            <thead>
                                <tr>
                                <th class="px-4 py-2">Port Name</th>
                                <th class="px-4 py-2">Switch Port</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each networkPoints as port}
                                <tr>
                                    <td class="border px-4 py-2">{port?.name}</td>
                                    <td class="border px-4 py-2">{port?.switchPort}</td>
                                </tr>
                                {/each}
                            </tbody>
                            </table>
                        </div>
                    </div>
                    <button class="px-2 py-2 rounded border border-green-300 hover:bg-green-400" 
                        on:click={download_PortsCSV}> Download as CSV
                    </button>
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
    overflow-y: auto; /* Enable vertical scrolling if content overflows */
    max-height: 90vh;
}

.report-generator {
  box-shadow: 0px 4px 8px rgba(129, 128, 128, 0.2);
  margin-left: -100px;
  border-radius: 30px;
  width: 50%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.report {
  box-shadow: 0px 4px 8px rgba(129, 128, 128, 0.2);
  border-radius: 10px;
  //width: fit-content; /* Adjusted width to fit the table */
  margin-bottom: 20px;
  overflow: auto; /* Added horizontal scrolling */
  //height: 500px;
  //width: 800px;
  display: grid;
  place-items: center;

        @media (max-width: 1600px) {
			width: 1000px;
	    }
		@media (max-width: 1200px) {
			width: 900px;
		}
}

table {
  width: max-content; /* Adjusted width to fit the table content */
  border-collapse: collapse;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

td {
    max-width: 200px;
    //white-space: pre-wrap;
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


::-webkit-scrollbar {
      	width: 10px;
        height: 10px;
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