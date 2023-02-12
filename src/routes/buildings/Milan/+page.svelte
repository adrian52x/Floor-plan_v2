<script>
    import Map from "../../../components/Map.svelte";

    const buildings = [
        {
            name: "Milan",
            lng: 9.188459141002138,
            lat: 45.53172243209325
        }
    ]
</script>

<Map centerLng={buildings[0].lng} centerLat={buildings[0].lat} zoom=16/>