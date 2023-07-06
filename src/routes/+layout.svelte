<script>
    import "../app.css";
    import { onMount } from 'svelte';
    import { isAuthenticatedTokenExists, setAuthenticatedUser, parseToken } from '../security/auth.js';
   
    //slot tag contains all the code from +page.svelte
    import Sidebar from "../components/Sidebar.svelte";
    import Footer from "../components/Footer.svelte";


    onMount(() => {

        const token = isAuthenticatedTokenExists();

        if (token) {
            const decodedToken = parseToken(token);
            setAuthenticatedUser(decodedToken);
        } 
        
    });
  

</script>

<Sidebar/>

<div class="grid">
    <slot />
</div>

    


<style>

  .grid {
    margin-left: 65px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    
  }
 
</style>




