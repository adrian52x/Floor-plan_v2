<script>
	let colour = 'gray';

    //test
  
	function handleMouseOver(e) {
		colour = 'green';
        console.log("selected");
	}
	function handleMouseOut(e) {
		colour = 'gray';
	}
</script>

<div class="floor-plan">
    <svg height="100%" width="100%">
    
        <g>
            <circle cx="400" cy="300" r="40" stroke="black" stroke-width="3" fill={colour}
                        on:mouseover={handleMouseOver} on:mouseout={handleMouseOut} />
            <text x="400" y="300"  font-family="Verdana" font-size="30" fill="black">14</text>
        </g>
        
        <g>
			<rect  class="desk" x="990" y="5" fill={colour} />
			<text  x="990" y="14" font-family="Verdana" font-size="9" fill="black" on:mouseover={handleMouseOver} on:mouseout={handleMouseOut}>14</text>
		  </g>


    </svg>
</div>

<style>
    .floor-plan {
		
			text-align: center;
		  width: 1100px;
		  height: 1200px;
		  border: 1px solid black;
	}

    .desk {
		width: 12px;
		height: 12px;
	}
</style>