<script>
   import "../app.css";
   
    //slot tag contains all the code from +page.svelte
    import Sidebar from "../components/Sidebar.svelte";
    import SidebarLayer2 from "../components/Sidebar_layer2.svelte";
    import Footer from "../components/Footer.svelte";
   



</script>

<Sidebar/>
    <SidebarLayer2/>

<div class="grid">
    <slot />

</div>

    


<style>

  .grid {
    margin-left: 385px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    
  }
 
</style>




