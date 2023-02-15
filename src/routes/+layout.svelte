<script>
   import "../app.css";
   
    //slot tag contains all the code from +page.svelte
    import Sidebar from "../components/Sidebar.svelte";
    import Footer from "../components/Footer.svelte";
   



</script>

<Sidebar/>

<div class="grid">
    <slot />

</div>

    


<style>

  .grid {
    margin-left: 75px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    
  }
 
</style>




