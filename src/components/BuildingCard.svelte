<script>

    export let building;
</script>
  
  <div class="card">
    <div class="card-image">
      <a href="/{building.name}"><img src="/buildings/img_{building.name}.jpg" alt="{building.name}"></a> 
      
    </div>
    <div class="card-content">
      <a class="font-newText text-xl font-bold" href="/{building.name}">{building.name}</a> 
      
      <hr>

      <h2 class="building-location py-2">
        <a href="https://www.google.com">
          <img class="icon-maps mr-2" src="/icon_google-maps.png" alt="Icon">
        </a>
        {building.location}
      </h2>

      <hr>


        <div class="building-floors pt-2 pl-2">
          <img class="icon-floors " src="/icon_plan_logo.jpg" alt="Floors">
          {#if building.floors?.length > 0 }
            
                {#each building.floors as floor}

                    <a href="{building.name}/{floor.level}">
                        <div class="px-4 py-2 my-2 bg-gray-200 rounded-md font-semibold w-full hover:bg-gray-400 hover:shadow-xl ">  
                            {floor.level}
                        </div>
                    </a>
                    
                
                {/each}
            {:else}
                <div class="px-4 py-2 my-2 bg-gray-200 rounded-md font-semibold">No data</div>
            {/if}   
        </div>
    </div>
  </div>
  
  <style>

    .icon-maps {
      width: 15px;
      height: 20px;
    }

    .icon-floors {
      width: 60px;
      height: 60px;
      margin-left: -15px;
      margin-right: -10px;
      border-radius: 90%;
    }


    .card {
      margin-top: 52px;
      display: flex;
      flex-direction: column;
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    }
  
    .card-image {
      height: 300px;
      width: 400px;
      overflow: hidden;
    }
  
    .card-image img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  
    .card-content {
      padding: 16px;
    }
  
    .building-location {
      font-size: 14px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .building-floors {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      max-width: 500px; /* adjust the maximum width to your liking */
      margin: 0 auto;
      gap: 15px;
    }
  </style>