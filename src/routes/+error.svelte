<script>
    import { page } from '$app/stores';
  </script>
  
  <div class="error">

    {#if $page.status === 404}
      <div class=" font-digits">{$page.status}: Page {$page.error.message}</div>
      <div class=" font-digits bg-green-200 rounded-xl"> <a href="/">Go Back</a> </div>
    {:else}
    <div class=" font-digits">Opss! Something went wrong.</div>
    <div class=" font-digits bg-green-200 rounded-xl"> <a href="/">Go Back</a> </div>
    {/if}


    



  </div>


  <style>
    .error {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 80vh;
      font-size: 1.5rem;
      text-align: center;
    }
  </style>