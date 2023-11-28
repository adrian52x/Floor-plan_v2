<script>
    import "../app.css";
    import 'iconify-icon';
    //import { onMount } from 'svelte';
    import { isAuthenticatedTokenExists, setAuthenticatedUser, parseToken } from '../security/auth.js';
   
    //slot tag contains all the code from +page.svelte
    import Sidebar from "../components/Sidebar.svelte";


    let token;

    $: {
      token = isAuthenticatedTokenExists();
      if (token) {
        if (isTokenExpired(token)) {
          console.log("Token expired");
          localStorage.removeItem('jwt_auth');
          token = "expired";
          setAuthenticatedUser(null); // Clear authenticated user from the store
        } else {
          const decodedToken = parseToken(token);
          console.log(decodedToken);
          setAuthenticatedUser(decodedToken);
        }
      } else {
        token = null;
        setAuthenticatedUser(null); // Clear authenticated user from the store
      }
    }

    // onMount(() => {

    //   const token = isAuthenticatedTokenExists(); 
    //     if (token) { 
    //         const decodedToken = parseToken(token); 
    //         console.log(decodedToken); 
    //         setAuthenticatedUser(decodedToken); 
    //         if (isTokenExpired(token)) { 
    //           console.log("token expired"); 
    //           localStorage.removeItem('jwt_auth');
    //         } 
    //   }   
    // });


    const isTokenExpired = (token) => {
      if (!token) {
        return true;
      }

      const parsedToken = parseToken(token);
      const createdAt = new Date(parsedToken.createdAt);
      const createdAtInMs = createdAt.getTime();
      
      const nowInMs = Date.now();

      const diff = nowInMs - createdAtInMs;

      if (diff > 10 * 60 * 60 * 1000) {  // 10 hours 
        return true;
      }

      return false;
    };
  

</script>

<Sidebar {token}/>

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




