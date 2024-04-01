<script>
    import { fly } from 'svelte/transition';
    import { baseURL } from '../../store/store';
    import toast, { Toaster } from 'svelte-french-toast';
    import { user } from '../../security/auth.js';
    import { onMount } from 'svelte';

    let users = [];

    let userName;
    let password;

    let isAdmin = false;

    onMount(async () => {
        fetchUsers();
    });

    

    async function fetchUsers() {
        try {
            const token = localStorage.getItem('jwt_auth');
            const response = await fetch(`${baseURL}/api/users`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `${token}`},
                credentials: 'include'
            });

            if (response.ok) {
                users = await response.json();
            } else {
                response.json().then(data => toast.error(`${data?.error}`));
            }
        } catch (error) {
            toast.error('Error fetching users:', error)
            console.log('Error fetching users:', error);
        }
    }

    const handleUserRegister = async () => {
        try {
            const token = localStorage.getItem('jwt_auth');
            const userRights = isAdmin ? ["admin"] : ["editor"];
            const response = await fetch(`${baseURL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `${token}`},
                credentials: 'include',
                body: JSON.stringify({
                    userName: userName,
                    password: password,
                    isAdmin: isAdmin,
                    userRights: userRights
                })
            });

            if (response.ok) {
                toast.success('User added successfully');
                setTimeout(() => {
        	        location.reload();
      	        }, 1000)
            } else {
                response.json().then(data => toast.error(`${data.error}`));
            }
        } catch (error) {
            toast.error('Error adding user:', error)
            console.log('Error adding user:', error);
        }
    }

    const deleteUser = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('jwt_auth'); 
                const response = await fetch(`${baseURL}/api/user/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `${token}` }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                toast.success(data.message);
                setTimeout(() => {
                    location.reload();
                }, 1000)
                
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    }

    

</script>


<Toaster />

<div class="w-full h-full" transition:fly={{x: -1000, opacity: 1}}>
    <main>
   
        {#if $user?.isAdmin}   
        
        <div class="tabs">
           <button class="tab font-digits">Add User</button>
        </div>    
   
   
        <div class="card">
            <div class="my-4 mx-4">
               
                <form on:submit|preventDefault={handleUserRegister}>
                    <div class="flex flex-col mb-4">
                        <label class="inline mr-2 font-bold" for="name">Name:</label>
                        <input class="shadow rounded-xl h-8 w-[250px]" type="text" id="name" name="name" bind:value={userName} required
                            pattern="[a-zA-Z0-9\s.\-_]+"
                            title="Room name can only contain alphanumeric characters and spaces."
                        />
                    </div>
                    <div class="flex flex-col mb-4">
                        <label class="inline mr-2 font-bold" for="password">Password:</label>
                        <input class="shadow rounded-xl h-8 w-[250px]" type="password" id="password" name="password" placeholder="******" bind:value={password} required
                            on:input="{e => e.target.setCustomValidity(e.target.value.length >= 6 ? '' : 'Password must be at least 6 characters long.')}"
                            
                        />
                    </div>
                    
                    <div class="flex flex-col mb-4">
                        <label class="inline mr-2 font-bold" for="admin">Make user admin:</label>
                        <input type="checkbox" id="admin" bind:checked={isAdmin} />
                    </div>
                
                    <button class="mt-8 w-fit py-2 px-2 rounded-md border border-green-300 hover:bg-green-200 font-semibold" type="submit">Register User</button>
                
                </form>
            </div>
        </div>

        <br>
        
        <div class="tabs">
            <button class="tab font-digits">Users</button>
        </div>

        {#if users}
            <div class="report">
                <div class="table-container">
                    <table class="table-auto ">
                        <thead>
                            <tr>
                                <th class="px-4 py-2">Username</th>
                                <th class="px-4 py-2">User Rights</th>       
                                <th class="px-4 py-2">#</th>     
                            </tr>
                        </thead>
                        <tbody>
                            {#each users as ur, i}
                                <tr>
                                    <td class="border px-4 py-2">{ur?.userName}</td>
                                    <td class="border px-4 py-2">{ur?.userRights.join(", ")}</td>
                                    <td class="border px-4 py-2">
                                        {#if i !== 0 && $user.userId !== ur._id}
                                            <button class="rounded-lg hover:bg-red-300" on:click={() => deleteUser(ur._id)}>
                                                <iconify-icon class="px-2 pt-1 text-xl" icon="mdi:close"></iconify-icon>
                                            </button>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>   
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
   
    .card {
        box-shadow: 0px 4px 8px rgba(129, 128, 128, 0.2);
        margin-left: -100px;
        border-radius: 8px;
        min-width: 300px;
        max-width: 400px;
        margin-bottom: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
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