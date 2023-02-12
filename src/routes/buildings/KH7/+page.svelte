<script>
    import Map from "../../../components/Map.svelte";

    const buildings = [
        {
            name: "KH7",
            lng: 12.474698336540886,
            lat: 55.731868790571276
        }
    ]
</script>


<Map centerLng={buildings[0].lng} centerLat={buildings[0].lat} zoom=16/>