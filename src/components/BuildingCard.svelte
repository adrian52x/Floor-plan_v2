<script>

    export let building;
  </script>
  
  <div class="card">
    <div class="card-image">
      <img src="/buildings/img_{building.name}.jpg" alt="{building.name}">
    </div>
    <div class="card-content">
      <h2 class="building-name">{building.name}</h2>
      <h2 class="building-location">{building.location}</h2>

        <div class="building-floors">
          {#if building.floors?.length > 0 }
            
                {#each building.floors as floor}

                    <a href="{building.name}/{floor}">
                        <div class="px-4 py-2 mt-2 mb-2 bg-gray-200 rounded-md font-semibold w-full hover:bg-gray-300">  
                            {floor}
                        </div>
                    </a>
                    
                
                {/each}
            {:else}
                <div class="font-digits px-6 py-1 mb-2 rounded-md font-semibold  bg-gray-400">No data</div>
            {/if}   
        </div>
    </div>
  </div>
  
  <style>
    .card {
      margin-top: 52px;
      display: flex;
      flex-direction: column;
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
      cursor: pointer;
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
  
    .building-name {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }

    .building-location {
      font-size: 14px;
    }

    .building-floors {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      max-width: 500px; /* adjust the maximum width to your liking */
      margin: 0 auto;
    }
  </style>