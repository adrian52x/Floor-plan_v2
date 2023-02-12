<script>
    import Map from "../../components/Map.svelte";

    const buildings = [
        {
            name: "VAT83",
            lng: 12.478501795222497,
            lat: 55.73510758176267
        }
    ]

    
    let defaultLng = 12;
    let defaultLat = 40;
    let defaultZoom = 1.5;
    

</script>





<Map centerLng={defaultLng} centerLat={defaultLat} zoom={defaultZoom}/>