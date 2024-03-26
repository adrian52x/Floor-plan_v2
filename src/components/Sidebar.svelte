<script>
    import { isAuthenticatedTokenExists, user, handleLogout } from "../security/auth.js";

    let isAuthenticatedUser;

    isAuthenticatedUser = !!isAuthenticatedTokenExists();

    export let token;
    
</script>


<nav class="z-50 p-2 text-xl fixed max-w-5xl h-full bg-gray-100 shadow-lg flex flex-col justify-between" >

  
           
        
        <div class="nav-item mt-4 group ">
            <a href="/" >
                <img class="icon " src="/icon_logo.jpg" alt="Icon">
                <span class="hidden text-sm font-digits group-hover:inline absolute m-2">Home</span>
            </a>
        </div>

        <div class="nav-item mt-7 group">
            <a href="/" class="block hover:shadow">
                <img class="icon" src="/icon_building.jpg" alt="Icon">
                <span class="hidden text-sm font-digits group-hover:inline absolute m-2">Buildings</span>
            </a>
        </div> 

        <div class="nav-item mt-6 group">
            <a href="/reports" class="block hover:shadow">
                <img class="icon" src="/icon_transfer.jpg" alt="Icon">
                <span class="hidden text-sm font-digits group-hover:inline absolute m-2">Reports</span>
            </a>
        </div> 
        

        <div class="nav-item mt-6 group">
            <a href="/contact" class="block hover:shadow">

                <iconify-icon class="ml-3" style="color: gray; font-size: 30px;" icon="mdi:chat-question-outline" ></iconify-icon>
                <!-- <img class="icon" src="/icon_person.jpg" alt="Icon"> -->
                
                <span class="hidden text-sm font-digits group-hover:inline absolute m-2">Feedback</span>
            </a>
        </div>
        
        {#if $user?.isAdmin}
            <div class="nav-item mt-6 group">
                <a href="/add-user" class="block hover:shadow">

                    <iconify-icon class="ml-3" style="color: gray; font-size: 30px;" icon="ci:user-add" ></iconify-icon>
                    
                    <span class="hidden text-sm font-digits group-hover:inline absolute m-2">Add user</span>
                </a>
            </div>

            <div class="nav-item mt-6 group">
                <a href="/logs" class="block hover:shadow">

                    <iconify-icon class="ml-3" style="color: gray; font-size: 30px;" icon="ooui:recent-changes-ltr" ></iconify-icon>
                    
                    <span class="hidden text-sm font-digits group-hover:inline absolute m-2">Logs</span>
                </a>
            </div>


        {/if} 


        {#if !isAuthenticatedUser }
            <div class="nav-item font-defaultText mt-auto">
                <span class="text-sm px-1 font-bold">{token === "expired" ? "Session expired" : ''}</span>
                <a href="/login" class="block hover:shadow">
                    <img class="icon" src="/icon_login.jpg" alt="Icon">
                    <span class="text-sm font-digits px-2">Login</span>
                </a>
            </div>
        {:else}
        
            <div class="nav-item font-defaultText mt-auto ">
                <span class="text-sm px-1 font-bold">{$user?.userName}</span>
                <button class="block hover:shadow" on:click={handleLogout}>
                    <img class="icon" src="/icon_logout.jpg" alt="Icon">
                    <span class="text-xs font-digits px-1">Logout</span>
                </button>
                
            </div>
        {/if}
        
        
        
    

       
  
  </nav>

  
  <style>
  
  nav{
    border-right: 1px solid #dfdcdc;
    width: 65px;
  }

  .icon {
    width: 57px;
    height: 45px;
    display: inline-block;
    
  }


  </style>