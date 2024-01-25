<script>
import { user, handleLogin, handleLogout, isAuthenticatedTokenExists } from "../../security/auth.js";

    let userName = '';
    let password = '';

    let isAuthenticatedUser;

    isAuthenticatedUser = !!isAuthenticatedTokenExists();

    //console.log("isAuthenticatedUser", isAuthenticatedUser);

    let userData = null;
    user.subscribe(value => {
        isAuthenticatedUser = !!value;
        userData = value;
    });

    
  
    
</script>
  
<style>

</style>


    {#if isAuthenticatedUser}
    
        <div class="fixed bg-gray-100 border-r-2 shadow-lg w-full h-full flex justify-center">
            <div class="tab font-defaultText m-20">Logged in as <b>{$user.userName}</b>. </div>
        </div>
    {:else}
        <div class="flex justify-center">
            <div class="mt-16">
                <h1 class="text-2xl font-bold mb-4">Login</h1>
                <form on:submit|preventDefault={handleLogin(userName, password)}>
                    <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="userName">
                        Username
                    </label>
                    <input class="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" bind:value={userName} />
                    </div>
                    <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input class="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" bind:value={password} />
                    </div>
                    <div class="flex items-center justify-center">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Sign In
                    </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
  
  