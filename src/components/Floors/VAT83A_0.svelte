<script>
    import { selectedObject, isButtonClicked } from "../../store/store";
    import { onMount } from "svelte";
    import { buildings } from "../../store/data.js";

    onMount(() => {
      selectedObject.set(null)
    });
      
    const buildingName = "VAT83A";
    let floor = 0;
    let clickedObject = null;
    let isActive = false;
    
    isButtonClicked.subscribe((value) => {
        isActive = value;
    });

    selectedObject.subscribe(value => {
            clickedObject = value;
            //console.log("clickedObject from PLAN",clickedObject);
    })


    //Departments view
    let floorAndDepartments = buildings.find(building => building.name === buildingName)?.floors.find(fl => fl.level === floor);

    let departments = floorAndDepartments.departments.map(depart => {
        return { name: depart, checked: false };
    });
    function toggleDepartment(event, department) {
        department.checked = event.target.checked;
    }


    let lines = Array.from({ length: 117 }, (_, i) => i + 1);   
    let doors = Array.from({ length: 19 }, (_, i) => i + 1);   
    let stairs = Array.from({ length: 6 }, (_, i) => i + 1);   
    let rectangles = Array.from({ length: 2 }, (_, i) => i + 1);   
    let elevators = Array.from({ length: 4 }, (_, i) => i + 1);
    let meetingIcons = Array.from({ length: 4 }, (_, i) => i + 1);
    let meetingRooms = Array.from({ length: 4 }, (_, i) => i + 1);
    let printerRooms = Array.from({ length: 2 }, (_, i) => i + 1);
    let desks = Array.from({ length: 20 }, (_, i) => i + 1);

</script>

<div class="floor-plan">
    <div id="group"/>


        {#each departments as department, index}
            <div class={department.checked === true ? `highlighted${index+1}` : ``}></div>
        {/each}

        <div class="departments font-digits">
            {#each departments as department}
                <label>
                    <input type="checkbox" bind:checked={department.checked} on:change={(e) => toggleDepartment(e, department)} />
                    {department.name}
                </label>
            {/each}
        </div>

        <div id="triangle"/>
        <div id="triangle2"/>

        {#each meetingRooms as meetingRoom, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class={isActive & index+1 == clickedObject?.name & floor == clickedObject?.floor & clickedObject?.objectType === 'meetingRoom' ? 'bg-red-400' : 'bg-blue-200'} id="meetingRoom{meetingRoom}"> <p class="text-sm">{floor}.{meetingRoom.toLocaleString('en-US', {minimumIntegerDigits: 2})}</p> </div>
        {/each}

        {#each printerRooms as printerRoom, index}
            <div class={isActive & index+1 == clickedObject?.name & floor == clickedObject?.floor & clickedObject?.objectType === 'printerRoom' ? 'bg-red-400' : 'bg-green-200'} id="printerRoom{printerRoom}"> <p class="text-xs">{floor}.{printerRoom.toLocaleString('en-US', {minimumIntegerDigits: 2})}</p> </div>
        {/each}

        <div class="desksLayer">
          {#each desks as desk, index}
          <div class={isActive & index+1 == clickedObject?.name & floor == clickedObject?.floor & clickedObject?.objectType === 'desk' ? 'bg-red-400' : 'bg-yellow-300'} id="desk{desk}"> <p style="font-size: 10px;">{floor}.{desk.toLocaleString('en-US', {minimumIntegerDigits: 2})}</p> </div>
          {/each}
        </div>


        {#each lines as wall}
            <div id="line{wall}"/>
        {/each}

        <!-- {#each doors as door}
            <div id="doorSymbol{door}"/>
        {/each} -->

        {#each stairs as stair}
            <div id="stairsIcon{stair}"/>
        {/each}

        {#each rectangles as rectangle}
            <div id="rectangle{rectangle}"/>
        {/each}
  
        {#each elevators as elevator}
            <div id="elevator{elevator}"/>
        {/each}

        {#each meetingIcons as meetingicon}
            <div id="meetingIcon{meetingicon}"/> 
        {/each}

        
        
        <div id="printIcon1"/>
        <div id="printIcon2"/>
  
        <div id="reception"/>

    
        
            <div id="KANTINE"> <h1>KANTINE</h1> </div>
            <div id="BUFFET"> <h1>BUFFET</h1> </div>
            <div id="KITCHEN"> <h1>KITCHEN</h1> </div>

            
            
            <div id="kitchenIco"/>
            
            <div id="receptioni"/>

            
<!-- <button>{clickedObject?.name}</button> -->
</div>




<style>

.floor-plan {
    position: relative;
    top: 50px;
    text-align: center;
    width: 1150px;
    height: 1250px;
    /* border: 1px solid black; */
}

.departments {
	position: relative;
	display: flex;
    flex-direction: column;
    gap: 15px;
    right: 5%;
    max-width: 300px;
    bottom: 1200px;
}

.highlighted1 {
	position: absolute;
  	left: 12px;
  	top: 400px;
 	width: 300px;
  	height: 400.0px;
  	background-color: #b3adad;
  }

.highlighted2 {
	position: absolute;
  	left: 510px;
 	width: 600px;
  	height: 100.0px;
  	background-color: #90e29b;
    top: 1px;
}

#group {
  left: 250.93px;
  top: 99px;
  width: 1112.07px;
  height: 1201px;
}

.desksLayer {
  position: absolute;
  left: 21.1px;
  top: 905px;
  width: 359.9px;
  height: 267px;
}

#desk18 {
  position: absolute;
  left: 295.8px;
  top: 106px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk17 {
  position: absolute;
  left: 295.8px;
  top: 87px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk16 {
  position: absolute;
  left: 0px;
  top: 145px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk15 {
  position: absolute;
  left: 0px;
  top: 164px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk14 {
  position: absolute;
  left: 3.9px;
  top: 252px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk13 {
  position: absolute;
  left: 3.9px;
  top: 233px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk12 {
  position: absolute;
  left: 38.9px;
  top: 233px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk11 {
  position: absolute;
  left: 38.9px;
  top: 252px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk10 {
  position: absolute;
  left: 33.9px;
  top: 164px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk9 {
  position: absolute;
  left: 68px;
  top: 164px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk8 {
  position: absolute;
  left: 33.9px;
  top: 145px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk7 {
  position: absolute;
  left: 68px;
  top: 145px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk6 {
  position: absolute;
  left: 244.9px;
  top: 25px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk5 {
  position: absolute;
  left: 244.9px;
  top: 0px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk4 {
  position: absolute;
  left: 329.9px;
  top: 87px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk20 {
  position: absolute;
  left: 329.9px;
  top: 106px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk3 {
  position: absolute;
  left: 329.9px;
  top: 156px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk2 {
  position: absolute;
  left: 329.9px;
  top: 175px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk1 {
  position: absolute;
  left: 295.9px;
  top: 175px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}

#desk19 {
  position: absolute;
  left: 295.9px;
  top: 156px;
  width: 30px;
  height: 15px;
  background-blend-mode: normal;
}


#line117 {
  position: absolute;
  left: 211.82px;
  top: 1px;
  width: 1px;
  height: 299.75px;
  background: #000000;
}

#line1 {
  position: absolute;
  left: 211.82px;
  top: 0px;
  width: 899.25px;
  height: 2px;
  background: #000000;
}

#line2 {
  position: absolute;
  left: 911.24px;
  top: 799.33px;
  width: 199.83px;
  height: 2px;
  background: #000000;
}

#line3 {
  position: absolute;
  left: 910.24px;
  top: 900.25px;
  width: 2px;
  height: 299.75px;
  background: #000000;
}

#line4 {
  position: absolute;
  left: 11.99px;
  top: 399.67px;
  width: 200.33px;
  height: 2px;
  background: #000000;
}

#line5 {
  position: absolute;
  left: 10.99px;
  top: 400.67px;
  width: 2px;
  height: 799.33px;
  background: #000000;
}

#line6 {
  position: absolute;
  left: 11.99px;
  top: 1199px;
  width: 899.25px;
  height: 2px;
  background: #000000;
}

#line7 {
  position: absolute;
  left: 1110.08px;
  top: 0px;
  width: 2px;
  height: 800.33px;
  background: #000000;
}

#triangle {
  position: absolute;
  left: 193.84px;
  top: 300.75px;
  width: 14.99px;
  height: 99.92px;
  border-top: 50px solid transparent;
  border-right: 20px solid rgb(0, 0, 0);
  border-bottom: 50px solid transparent;
  background-blend-mode: normal;
}

#triangle2 {
  position: absolute;
  left: 911.24px;
  top: 800.33px;
  width: 14.99px;
  height: 99.92px;
  border-top: 50px solid transparent;
  border-left: 20px solid rgb(0, 0, 0);
  border-bottom: 50px solid transparent;
  background-blend-mode: normal;
}

#line8 {
  position: absolute;
  left: 311.74px;
  top: 899.25px;
  width: 599.5px;
  height: 2px;
  background: #000000;
}

#line9 {
  position: absolute;
  left: 310.74px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
}

#line10 {
  position: absolute;
  left: 311.74px;
  top: 969.69px;
  width: 75.44px;
  height: 2px;
  background: #000000;
}

#line11 {
  position: absolute;
  left: 386.18px;
  top: 970.69px;
  width: 2px;
  height: 79.43px;
  background: #000000;
}

#line12 {
  position: absolute;
  left: 387.18px;
  top: 1049.13px;
  width: 124.4px;
  height: 2px;
  background: #000000;
}

#line13 {
  position: absolute;
  left: 510.57px;
  top: 900.25px;
  width: 2px;
  height: 149.88px;
  background: #000000;
}

#line14 {
  position: absolute;
  left: 412.66px;
  top: 970.19px;
  width: 99.92px;
  height: 2px;
  background: #000000;
}

#line15 {
  position: absolute;
  left: 410.66px;
  top: 970.69px;
  width: 2px;
  height: 79.43px;
  background: #000000;
}

#line16 {
  position: absolute;
  left: 386.18px;
  top: 1050.13px;
  width: 2px;
  height: 149.88px;
  background: #000000;
}

#doorSymbol1 {
  position: absolute;
  left: 409.65px;
  top: 1025.15px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleY(-1) rotate(90.00008deg);
}

#doorSymbol2 {
  position: absolute;
  left: 309.03px;
  top: 949.71px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleY(-1) rotate(90.00008deg);
}

#doorSymbol3 {
  position: absolute;
  left: 409.25px;
  top: 908.24px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00008deg);
}

#line17 {
  position: absolute;
  left: 410.66px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
}

#doorSymbol4 {
  position: absolute;
  left: 317.52px;
  top: 898.25px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#doorSymbol5 {
  position: absolute;
  left: 215.21px;
  top: 388.68px;
  width: 13.99px;
  height: 13.99px;
  background-size: cover;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
}

#doorSymbol6 {
  position: absolute;
  left: 875.28px;
  top: 797.34px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#doorSymbol7 {
  position: absolute;
  left: 160.07px;
  top: 1113.07px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#doorSymbol8 {
  position: absolute;
  left: 208.83px;
  top: 1113.07px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#doorSymbol9 {
  position: absolute;
  left: 270.77px;
  top: 1113.07px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#doorSymbol10 {
  position: absolute;
  left: 149.68px;
  top: 968.69px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleY(-1);
}

#doorSymbol11 {
  position: absolute;
  left: 214.82px;
  top: 898.25px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleY(-1);
}

#doorSymbol12 {
  position: absolute;
  left: 166.66px;
  top: 998.37px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleY(-1);
}

#line18 {
  position: absolute;
  left: 166.36px;
  top: 899.25px;
  width: 145.38px;
  height: 2px;
  background: #000000;
}

#line19 {
  position: absolute;
  left: 165.36px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
}

#line20 {
  position: absolute;
  left: 11.99px;
  top: 969.69px;
  width: 250.29px;
  height: 2px;
  background: #000000;
}

#line21 {
  position: absolute;
  left: 210.82px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
}

#line22 {
  position: absolute;
  left: 261.28px;
  top: 900.25px;
  width: 2px;
  height: 70.44px;
  background: #000000;
}

#line23 {
  position: absolute;
  left: 211.82px;
  top: 934.42px;
  width: 50.46px;
  height: 2px;
  background: #000000;
}

#line24 {
  position: absolute;
  left: 98.42px;
  top: 999.17px;
  width: 163.86px;
  height: 2px;
  background: #000000;
}

#line25 {
  position: absolute;
  left: 97.42px;
  top: 1000.17px;
  width: 2px;
  height: 15.49px;
  background: #000000;
}

#line26 {
  position: absolute;
  left: 11.99px;
  top: 1014.66px;
  width: 86.43px;
  height: 2px;
  background: #000000;
}

#line27 {
  position: absolute;
  left: 165.36px;
  top: 1000.17px;
  width: 2px;
  height: 49.96px;
  background: #000000;
}

#line28 {
  position: absolute;
  left: 166.36px;
  top: 1049.13px;
  width: 72.64px;
  height: 2px;
  background: #000000;
}

#line29 {
  position: absolute;
  left: 238px;
  top: 1000.17px;
  width: 2px;
  height: 49.96px;
  background: #000000;
}

#line30 {
  position: absolute;
  left: 195.34px;
  top: 970.69px;
  width: 2px;
  height: 29.48px;
  background: #000000;
}

#line31 {
  position: absolute;
  left: 225.31px;
  top: 970.69px;
  width: 2px;
  height: 29.48px;
  background: #000000;
}

#line32 {
  position: absolute;
  left: 261.28px;
  top: 970.69px;
  width: 2px;
  height: 29.48px;
  background: #000000;
}

#doorSymbol13 {
  position: absolute;
  left: 200.82px;
  top: 403.16px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90.00008deg);
}

#doorSymbol14 {
  position: absolute;
  left: 900.24px;
  top: 769.36px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90.00008deg);
}

#doorSymbol15 {
  position: absolute;
  left: 0.99px;
  top: 991.37px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90.00008deg);
}

#doorSymbol16 {
  position: absolute;
  left: 250.78px;
  top: 953.21px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1) rotate(90.00008deg);
}

#doorSymbol17 {
  position: absolute;
  left: 250.78px;
  top: 981.18px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1) rotate(90.00008deg);
}

#doorSymbol18 {
  position: absolute;
  left: 214.81px;
  top: 982.68px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1) rotate(90.00008deg);
}

#doorSymbol19 {
  position: absolute;
  left: 82.93px;
  top: 1004.16px;
  width: 13.99px;
  height: 13.99px;
  background:  url("/floorPlan-icons/door.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#stairsIcon5 {
  position: absolute;
  left: 198.63px;
  top: 1017.15px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
}

#stairsIcon6 {
  position: absolute;
  left: 926.23px;
  top: 757.17px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#stairsIcon1 {
  position: absolute;
  left: 160.37px;
  top: 419.15px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleY(-1);
}

#stairsIcon2 {
  position: absolute;
  left: 176.85px;
  top: 444.63px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#stairsIcon3 {
  position: absolute;
  left: 920.23px;
  top: 732.59px;
  width: 32.97px;
  height: 32.97px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleY(-1);
}

#stairsIcon4 {
  position: absolute;
  left: 194.84px;
  top: 998.37px;
  width: 29.98px;
  height: 29.98px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

/* printer 1  */
#printerRoom1 {
  position: absolute;
  left: 211.82px;
  top: 900.25px;
  width: 50.46px;
  height: 35.17px;
  background-blend-mode: normal;
  
}

/* printer 2  */
#printerRoom2 {
  position: absolute;
  left: 211.82px;
  top: 935.52px;
  width: 50.46px;
  height: 35.17px;
  background-blend-mode: normal;
  
}

#printIcon1 {
  position: absolute;
  left: 230.8px;
  top: 918.24px;
  width: 14.99px;
  height: 14.99px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}

#printIcon2 {
  position: absolute;
  left: 230.82px;
  top: 953.92px;
  width: 14.99px;
  height: 14.99px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}

/* meeting room , big */
#meetingRoom1 {
  position: absolute;
  left: 412.66px;
  top: 900.25px;
  width: 99.42px;
  height: 70.14px;
  /* background: rgba(187, 136, 136, 0.19); */
  background-blend-mode: normal;
}


#meetingIcon1 {
  position: absolute;
  left: 447.43px;
  top: 920.63px;
  width: 29px;
  height: 29px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon2 {
  position: absolute;
  left: 190.34px;
  top: 1157.84px;
  width: 29.98px;
  height: 29.98px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon3 {
  position: absolute;
  left: 142.58px;
  top: 1160.03px;
  width: 29.98px;
  height: 29.98px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon4 {
  position: absolute;
  left: 245.8px;
  top: 1157.84px;
  width: 29.98px;
  height: 29.98px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#line33 {
  position: absolute;
  left: 136.09px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
}

#line34 {
  position: absolute;
  left: 288.26px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
}

#line35 {
  position: absolute;
  left: 137.09px;
  top: 1114.57px;
  width: 152.17px;
  height: 2px;
  background: #000000;
}

#line36 {
  position: absolute;
  left: 231.31px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
}

#line37 {
  position: absolute;
  left: 178.35px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
}

#meetingRoom4 {
  position: absolute;
  left: 137.09px;
  top: 1115.87px;
  width: 41.47px;
  height: 84.13px;
  /* background: rgba(187, 136, 136, 0.19); */
  background-blend-mode: normal;
}

#meetingRoom3 {
  position: absolute;
  left: 179.35px;
  top: 1116.07px;
  width: 52.46px;
  height: 84.13px;
  /* background: rgba(187, 136, 136, 0.19); */
  background-blend-mode: normal;
}

#meetingRoom2 {
  position: absolute;
  left: 232.81px;
  top: 1115.87px;
  width: 56.45px;
  height: 84.13px;
  /* background: rgba(187, 136, 136, 0.19); */
  background-blend-mode: normal;
  /* box-shadow: 0px 2px 4px #ff0000; */
}

#line38 {
  position: absolute;
  left: 310.74px;
  top: 400.67px;
  width: 2px;
  height: 499.58px;
  background: #000000;
}

#line39 {
  position: absolute;
  left: 212.82px;
  top: 399.67px;
  width: 98.92px;
  height: 2px;
  background: #000000;
}

#line40 {
  position: absolute;
  left: 211.82px;
  top: 299.75px;
  width: 599.5px;
  height: 2px;
  background: #000000;
}

#line41 {
  position: absolute;
  left: 310.74px;
  top: 150.87px;
  width: 2px;
  height: 149.88px;
  background: #000000;
}

#line42 {
  position: absolute;
  left: 311.74px;
  top: 149.88px;
  width: 99.92px;
  height: 2px;
  background: #000000;
}

#line43 {
  position: absolute;
  left: 311.74px;
  top: 199.83px;
  width: 99.92px;
  height: 2px;
  background: #000000;
}

#line44 {
  position: absolute;
  left: 410.66px;
  top: 150.87px;
  width: 2px;
  height: 49.96px;
  background: #000000;
}

#line45 {
  position: absolute;
  left: 410.66px;
  top: 200.83px;
  width: 2px;
  height: 99.92px;
  background: #000000;
}

#line46 {
  position: absolute;
  left: 411.66px;
  top: 149.88px;
  width: 399.67px;
  height: 2px;
  background: #000000;
}

#line47 {
  position: absolute;
  left: 810.33px;
  top: 150.87px;
  width: 2px;
  height: 149.88px;
  background: #000000;
}

#line48 {
  position: absolute;
  left: 811.32px;
  top: 199.83px;
  width: 299.75px;
  height: 2px;
  background: #000000;
}

#line49 {
  position: absolute;
  left: 811.32px;
  top: 223.81px;
  width: 299.75px;
  height: 2px;
  background: #000000;
}

#line50 {
  position: absolute;
  left: 811.32px;
  top: 346.21px;
  width: 99.92px;
  height: 2px;
  background: #000000;
}

#line51 {
  position: absolute;
  left: 910.24px;
  top: 224.81px;
  width: 2px;
  height: 122.4px;
  background: #000000;
}

#line52 {
  position: absolute;
  left: 811.32px;
  top: 284.96px;
  width: 99.92px;
  height: 2px;
  background: #000000;
}

#line53 {
  position: absolute;
  left: 911.24px;
  top: 346.21px;
  width: 99.92px;
  height: 2px;
  background: #000000;
}

#line59 {
  position: absolute;
  left: 911.24px;
  top: 551.04px;
  width: 99.92px;
  height: 2px;
  background: #000000;
}

#line54 {
  position: absolute;
  left: 1010.16px;
  top: 224.81px;
  width: 2px;
  height: 122.4px;
  background: #000000;
}

#line55 {
  position: absolute;
  left: 960.2px;
  top: 224.81px;
  width: 2px;
  height: 122.4px;
  background: #000000;
}

#line56 {
  position: absolute;
  left: 911.24px;
  top: 318.24px;
  width: 49.96px;
  height: 2px;
  background: #000000;
}

#line57 {
  position: absolute;
  left: 910.24px;
  top: 347.21px;
  width: 2px;
  height: 205.83px;
  background: #000000;
}

#line58 {
  position: absolute;
  left: 1010.16px;
  top: 347.21px;
  width: 2px;
  height: 204.83px;
  background: #000000;
}

#line60 {
  position: absolute;
  left: 810.33px;
  top: 71.44px;
  width: 2px;
  height: 79.43px;
  background: #000000;
}

#line61 {
  position: absolute;
  left: 811.32px;
  top: 70.44px;
  width: 299.75px;
  height: 2px;
  background: #000000;
}

#line62 {
  position: absolute;
  left: 960.2px;
  top: 1px;
  width: 2px;
  height: 70.44px;
  background: #000000;
}

#line63 {
  position: absolute;
  left: 811.32px;
  top: 136.39px;
  width: 149.88px;
  height: 2px;
  background: #000000;
}

#line64 {
  position: absolute;
  left: 960.2px;
  top: 106.41px;
  width: 2px;
  height: 94.42px;
  background: #000000;
}

#line65 {
  position: absolute;
  left: 961.2px;
  top: 105.41px;
  width: 149.88px;
  height: 2px;
  background: #000000;
}

#line66 {
  position: absolute;
  left: 1068.61px;
  top: 106.41px;
  width: 2px;
  height: 94.42px;
  background: #000000;
}

#line67 {
  position: absolute;
  left: 910.24px;
  top: 577.02px;
  width: 2px;
  height: 223.31px;
  background: #000000;
}

#line68 {
  position: absolute;
  left: 911.24px;
  top: 577.02px;
  width: 199.83px;
  height: 1px;
  background: #000000;
}

#line69 {
  position: absolute;
  left: 911.24px;
  top: 713.91px;
  width: 49.96px;
  height: 2px;
  background: #000000;
}

#line70 {
  position: absolute;
  left: 960.2px;
  top: 714.9px;
  width: 2px;
  height: 85.43px;
  background: #000000;
}

#line71 {
  position: absolute;
  left: 811.32px;
  top: 713.91px;
  width: 99.92px;
  height: 2px;
  background: #000000;
}

#line74 {
  position: absolute;
  left: 811.32px;
  top: 798.34px;
  width: 99.92px;
  height: 2px;
  background: #000000;
}

#line75 {
  position: absolute;
  left: 811.32px;
  top: 771.86px;
  width: 32.47px;
  height: 2px;
  background: #000000;
}

#line76 {
  position: absolute;
  left: 811.32px;
  top: 747.88px;
  width: 32.47px;
  height: 2px;
  background: #000000;
}

#line72 {
  position: absolute;
  left: 810.33px;
  top: 714.9px;
  width: 2px;
  height: 84.43px;
  background: #000000;
}

#line73 {
  position: absolute;
  left: 842.8px;
  top: 714.9px;
  width: 2px;
  height: 84.43px;
  background: #000000;
}

#elevator1 {
  position: absolute;
  left: 810.3px;
  top: 742.88px;
  width: 35.97px;
  height: 35.97px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90deg);
}

#elevator2 {
  position: absolute;
  left: 270.74px;
  top: 395.67px;
  width: 39.97px;
  height: 39.97px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90deg);
}

#elevator3 {
  position: absolute;
  left: 270.74px;
  top: 425.15px;
  width: 39.97px;
  height: 39.97px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90deg);
}

#elevator4 {
  position: absolute;
  left: 810.3px;
  top: 768.86px;
  width: 35.97px;
  height: 35.97px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90deg);
}

#line77 {
  position: absolute;
  left: 159.37px;
  top: 400.67px;
  width: 2px;
  height: 99.92px;
  background: #000000;
}

#line78 {
  position: absolute;
  left: 160.37px;
  top: 499.58px;
  width: 151.37px;
  height: 2px;
  background: #000000;
}

#line79 {
  position: absolute;
  left: 212.32px;
  top: 400.67px;
  width: 1px;
  height: 99.92px;
  background: #000000;
}


#line80 {
  position: absolute;
  left: 273.27px;
  top: 459.12px;
  width: 38.47px;
  height: 2px;
  background: #000000;
}

#line81 {
  position: absolute;
  left: 273.27px;
  top: 430.14px;
  width: 38.47px;
  height: 1px;
  background: #000000;
}

#line82 {
  position: absolute;
  left: 810.33px;
  top: 325.23px;
  width: 2px;
  height: 21.98px;
  background: #000000;
}

#reception {
  position: absolute;
  left: 423.15px;
  top: 358.7px;
  width: 42.96px;
  height: 71.94px;
  border-radius: 8px;
  border: 1px solid #ff0000;
  background: rgba(187, 136, 136, 0.19);
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px #e50404;
}

#receptioni {
  position: absolute;
  left: 425.45px;
  top: 375.19px;
  width: 39.97px;
  height: 39.97px;
  background:  url("/floorPlan-icons/reception.png")  no-repeat;
  background-size: cover;
}

#kitchenIco {
  position: absolute;
  left: 928.23px;
  top: 414.65px;
  width: 65.95px;
  height: 65.95px;
  
  background:  url("/floorPlan-icons/kitchen.png")  no-repeat;
  background-size: cover;
  
  
}

#KITCHEN {
  position: absolute;
  left: 932.22px;
  top: 393.67px;
  width: 52.96px;
  height: 14.99px;
  color: #000000;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
}

#BUFFET {
  position: absolute;
  left: 830.31px;
  top: 485.6px;
  width: 45.96px;
  height: 14.99px;
  color: #000000;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
}

#line83 {
  position: absolute;
  left: 634.97px;
  top: 423.15px;
  width: 154.87px;
  height: 2px;
  background: #000000;
}

#line84 {
  position: absolute;
  left: 754.87px;
  top: 599.5px;
  width: 34.97px;
  height: 2px;
  background: #000000;
}

#line85 {
  position: absolute;
  left: 633.97px;
  top: 383.18px;
  width: 2px;
  height: 40.97px;
  background: #000000;
}

#line86 {
  position: absolute;
  left: 497.09px;
  top: 382.18px;
  width: 137.89px;
  height: 2px;
  background: #000000;
}

#line87 {
  position: absolute;
  left: 496.09px;
  top: 383.18px;
  width: 2px;
  height: 168.86px;
  background: #000000;
}

#line88 {
  position: absolute;
  left: 497.09px;
  top: 551.04px;
  width: 106.91px;
  height: 2px;
  background: #000000;
}

#line89 {
  position: absolute;
  left: 603px;
  top: 552.04px;
  width: 2px;
  height: 104.91px;
  background: #000000;
}

#line90 {
  position: absolute;
  left: 604px;
  top: 655.95px;
  width: 150.87px;
  height: 2px;
  background: #000000;
}

#line91 {
  position: absolute;
  left: 753.87px;
  top: 600.5px;
  width: 2px;
  height: 56.45px;
  background: #000000;
}

#rectangle1 {
  position: absolute;
  left: 843.8px;
  top: 412.86px;
  width: 19.98px;
  height: 59.95px;
  border-radius: 8px;
  border: 1px dashed #ff0000;
  background: rgba(211,211,211,0.1);
  background-blend-mode: normal;
}

#rectangle2 {
  position: absolute;
  left: 843.8px;
  top: 513.37px;
  width: 19.98px;
  height: 59.95px;
  border-radius: 8px;
  border: 1px dashed #ff0000;
  background: rgba(211,211,211,0.1);
  background-blend-mode: normal;
}


#KANTINE {
  position: absolute;
  left: 633.47px;
  top: 493.59px;
  width: 51.96px;
  height: 14.99px;
  color: #000000;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
}

#line92 {
  position: absolute;
  left: 737.89px;
  top: 1114.57px;
  width: 173.36px;
  height: 1px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line93 {
  position: absolute;
  left: 736.89px;
  top: 1115.57px;
  width: 2px;
  height: 84.43px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line94 {
  position: absolute;
  left: 611.49px;
  top: 999.17px;
  width: 89.43px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line95 {
  position: absolute;
  left: 610.49px;
  top: 1000.17px;
  width: 2px;
  height: 90.92px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line96 {
  position: absolute;
  left: 611.49px;
  top: 1090.09px;
  width: 89.43px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line97 {
  position: absolute;
  left: 699.92px;
  top: 1000.17px;
  width: 2px;
  height: 90.92px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line101 {
  position: absolute;
  left: 810.33px;
  top: 1000.17px;
  width: 2px;
  height: 75.44px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line98 {
  position: absolute;
  left: 700.92px;
  top: 1074.61px;
  width: 110.41px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line100 {
  position: absolute;
  left: 701.42px;
  top: 1050.63px;
  width: 109.91px;
  height: 1px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line99 {
  position: absolute;
  left: 700.92px;
  top: 999.17px;
  width: 110.41px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line102 {
  position: absolute;
  left: 128.39px;
  top: 599.5px;
  width: 183.35px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line103 {
  position: absolute;
  left: 127.39px;
  top: 600.5px;
  width: 2px;
  height: 99.92px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line104 {
  position: absolute;
  left: 128.39px;
  top: 699.42px;
  width: 68.44px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line105 {
  position: absolute;
  left: 195.84px;
  top: 600.5px;
  width: 2px;
  height: 99.92px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line106 {
  position: absolute;
  left: 127.39px;
  top: 541.05px;
  width: 2px;
  height: 59.45px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line107 {
  position: absolute;
  left: 128.39px;
  top: 540.05px;
  width: 101.42px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line108 {
  position: absolute;
  left: 228.81px;
  top: 541.05px;
  width: 2px;
  height: 59.45px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line109 {
  position: absolute;
  left: 11.99px;
  top: 627.48px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line111 {
  position: absolute;
  left: 11.99px;
  top: 677.94px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line110 {
  position: absolute;
  left: 85.43px;
  top: 628.98px;
  width: 2px;
  height: 134.89px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line112 {
  position: absolute;
  left: 11.99px;
  top: 720.4px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line113 {
  position: absolute;
  left: 11.99px;
  top: 720.4px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line114 {
  position: absolute;
  left: 11.99px;
  top: 762.86px;
  width: 74.44px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line115 {
  position: absolute;
  left: 1062.62px;
  top: 577.32px;
  width: 2px;
  height: 50.66px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}

#line116 {
  position: absolute;
  left: 1063.61px;
  top: 626.98px;
  width: 47.46px;
  height: 2px;
  background: #000000;
  background-blend-mode: normal;
  box-shadow: 0px 2px 4px rgba(100,100,100,0.5);
}




</style>