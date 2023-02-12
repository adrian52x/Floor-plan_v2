<script>
    import Map from "../../../components/Map.svelte";

    const buildings = [
        {
            name: "Seattle",
            lng: -122.20083465937067,
            lat: 47.802990703043676
        }
    ]
</script>

<Map centerLng={buildings[0].lng} centerLat={buildings[0].lat} zoom=16/>