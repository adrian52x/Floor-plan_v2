<script>
    import "../../app.css";
    

    
</script>

<div class="grid">
    <slot/>
</div>
  



  
  
<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr;
        height: 100vh;
    }
</style>