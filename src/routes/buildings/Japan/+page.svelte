
<script>
    import Map from "../../../components/Map.svelte";

    const buildings = [
        {
            name: "Japan",
            lng: 140.10951294244973,
            lat: 35.53848158582272
        }
    ]
</script>


<Map centerLng={buildings[0].lng} centerLat={buildings[0].lat} zoom=16/>