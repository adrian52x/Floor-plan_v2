<script>
    import { isAuthenticatedTokenExists, user, handleLogout } from "../security/auth.js";

    let isAuthenticatedUser;

    isAuthenticatedUser = !!isAuthenticatedTokenExists();
    
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

        {#if isAuthenticatedUser && $user?.isAdmin}
            <div class="nav-item mt-6 group">
                <a href="/admin" class="block hover:shadow">
                    <img class="icon" src="/icon_person.jpg" alt="Icon">
                    <span class="hidden text-sm font-digits group-hover:inline absolute m-2"> Admin Panel</span>
                </a>
            </div> 
        {/if}
        
         

        <!-- <div class="nav-item mt-4">
            <a href="/import" class="block hover:shadow">
                <img class="icon " src="/icon_transfer.jpg" alt="Icon">
            </a>
        </div> -->

        <!-- <div class="nav-item mt-5">
            <a href="/contact" class="block hover:shadow">
                <img class="icon" src="/icon_transfer.jpg" alt="Icon">
            </a>
        </div>  -->


        {#if !isAuthenticatedUser }
            <div class="nav-item font-defaultText mt-auto">
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