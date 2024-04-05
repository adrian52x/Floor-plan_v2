<script>
    import { baseURL } from '../../store/store';
    import toast, { Toaster } from 'svelte-french-toast';
    import { user } from '../../security/auth.js';
    import { onMount } from 'svelte';

    let logs = [];


    onMount(async () => {
        await deleteOldLogs();
        await fetchLogs();
    });


    async function deleteOldLogs() {
        try {
            const token = localStorage.getItem('jwt_auth');
            const response = await fetch(`${baseURL}/api/logs`, { 
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `${token}`},
                credentials: 'include'
            });

            if (response.ok) {
               return;
            } else {
                response.json().then(data => toast.error(`${data.error}`));
            }
        } catch (error) {
            console.log('Error deleting logs:', error);
        }
    }
    

    async function fetchLogs() {
        try {
            const token = localStorage.getItem('jwt_auth');
            const response = await fetch(`${baseURL}/api/logs`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `${token}`},
                credentials: 'include'
            });

            if (response.ok) {
                logs = await response.json();
                logs = logs.reverse();
            } else {
                response.json().then(data => toast.error(`${data.error}`));
            }
        } catch (error) {
            toast.error('Error fetching users:', error)
        }
    }

    let currentPage = 1;
    const logsPerPage = 20;

    $: paginatedLogs = logs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

</script>


<Toaster />

<div class="w-full h-full" >
    <main>
   
        {#if $user?.isAdmin}   
        
            <div class="tabs">
                <div class="tab font-digits">Logs </div> 
            </div>

            {#if logs && logs.length > 0}
                <div class="report">
                    <div class="table-container">
                    <table class="table-auto">
                        <!-- Your table header here -->

                        <tbody>
                        {#each paginatedLogs as log, i}
                            <tr>
                                <td class="border px-4 py-2">{i + 1}</td>
                                <td class="border px-4 py-2">{log?.user ? log.user.userName : 'deleted user'}</td>                                    <td class="border px-4 py-2">{log?.userAction}</td>
                                <td class="border px-4 py-2">{log?.date}</td>
                                <td class="border px-4 py-2">{log?.time}</td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div class="pagination flex flex-wrap justify-start max-w-[700px]" >
                    {#each Array(Math.ceil(logs.length / logsPerPage)) as _, i}
                      <button class="my-3 max-w-[25px] inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm {currentPage === i + 1 ? 'bg-green-300' : ''}"
                        on:click={() => currentPage = i + 1}>{i + 1}
                      </button>
                    {/each}
                </div>

            {/if}

        
        {:else}
            <p>You are not authorized to view this page</p>
        {/if}
        

    </main>
</div>



<style lang="scss">

    main {
        margin-top: 20px;    
        display: flex;
        flex-direction: column;
        align-items: center;
    }
   
   
    .tabs {
        margin-left: -100px;
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 1rem;
    }
   
   .tab {
        background-color: transparent;
        border: none;
        color: #333;
        font-size: 1.25rem;
        padding: 0.5rem 1rem;
        text-align: center;
        text-transform: uppercase;
    }

    .report {
        margin-left: -100px;
        box-shadow: 0px 4px 8px rgba(129, 128, 128, 0.2);
        border-radius: 10px;
        //width: fit-content; /* Adjusted width to fit the table */
        margin-bottom: 20px;
        overflow: auto; /* Added horizontal scrolling */
        //height: 500px;
        //width: 800px;
        display: grid;
        place-items: center;
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
   
</style>