<script>
    import { onMount, onDestroy } from 'svelte'
    import { Map, NavigationControl, Marker } from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';
  
    export let zoom;
    export let centerLng;
    export let centerLat;
    let map;
    let mapContainer;
  
    
    onMount(() => {
  
      const apiKey = 'VwXNRg7FtlfZps0LhWDI';
      
      map = new Map({
        container: mapContainer,
        style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${apiKey}`,
        center: [centerLng, centerLat],
        zoom
      });

      map.addControl(new NavigationControl(), 'top-right');
        new Marker({color: "#FF0000"}) // VAT83A
        .setLngLat([12.479901795222497,55.73510758176267])
        .addTo(map);

        new Marker({color: "#FF0000"}) // KH7
        .setLngLat([12.474698336540886,55.731868790571276])
        .addTo(map);  

        new Marker({color: "#FF0000"}) // Seattle
        .setLngLat([-122.20083465937067,47.802990703043676])
        .addTo(map); 
    
        new Marker({color: "#FF0000"}) // Japan
        .setLngLat([140.10951294244973,35.53848158582272])
        .addTo(map);  

        new Marker({color: "#FF0000"}) // Milan
        .setLngLat([9.188459141002138,45.53172243209325])
        .addTo(map); 
        
    });
  
    onDestroy(() => {
      map?.remove();
    });
  </script>
  
  <div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"><img
      src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo"/></a>
    <div class="map" id="map" bind:this={mapContainer}></div>
  </div>
  
  <style>
  
    .map-wrap {
      position: relative;
      margin-left: 200px;
      width: 100%;
      height: 100vh;
    }
  
    .map {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  
    .watermark {
      position: absolute;
      left: 10px;
      bottom: 10px;
      z-index: 999;
    }
  </style>