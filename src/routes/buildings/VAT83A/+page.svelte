<script>
    import Map from "../../../components/Map.svelte";

    const buildings = [
        {
            name: "VAT83A",
            lng: 12.478501795222497,
            lat: 55.73510758176267
        }
    ]
</script>


<Map centerLng={buildings[0].lng} centerLat={buildings[0].lat} zoom=16/>