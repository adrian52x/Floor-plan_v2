<script>
    import { myStore, isButtonClicked } from "../../store/store";

    let floor = 4;
    let clickedObject = null;
    let isActive = false;
    
    isButtonClicked.subscribe((value) => {
        isActive = value;
    });

    myStore.subscribe(value => {
            clickedObject = value;
            console.log("clickedObject from PLAN",clickedObject);
        })


let lines = Array.from({ length: 127 }, (_, i) => i + 1);    
let stairs = Array.from({ length: 8 }, (_, i) => i + 1);    
let elevators = Array.from({ length: 4 }, (_, i) => i + 1);
let meetingIcons = Array.from({ length: 16 }, (_, i) => i + 1);
let meetingRooms = Array.from({ length: 16 }, (_, i) => i + 1);
let printerRooms = Array.from({ length: 4 }, (_, i) => i + 1);
let desks = Array.from({ length: 197 }, (_, i) => i + 1);

</script>

<div class="floor-plan">
    <div id="group"/>


        {#each meetingRooms as meetingRoom, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class={isActive & index+1 == clickedObject?.name & floor == clickedObject?.floor & clickedObject?.type === 'meetingRoom' ? 'bg-red-400' : 'bg-blue-200'} id="meetingRoom{meetingRoom}"> <p>{floor}.{meetingRoom.toLocaleString('en-US', {minimumIntegerDigits: 2})}</p> </div>
        {/each}

        {#each printerRooms as printerRoom, index}
            <div class={isActive & index+1 == clickedObject?.name & floor == clickedObject?.floor & clickedObject?.type === 'printerRoom' ? 'bg-red-400' : 'bg-green-200'} id="printerRoom{printerRoom}"> <p class="text-xs">{floor}.{printerRoom.toLocaleString('en-US', {minimumIntegerDigits: 2})}</p> </div>
        {/each}

        <div class="desksLayer">
          {#each desks as desk, index}
          <div class={isActive & index+1 == clickedObject?.name & floor == clickedObject?.floor & clickedObject?.type === 'desk' ? 'bg-red-400' : 'bg-yellow-300'} id="desk{desk}"> <p class="text-xs">{floor}.{desk.toLocaleString('en-US', {minimumIntegerDigits: 2})}</p> </div>
          {/each}
        </div>


        {#each lines as wall}
            <div id="line{wall}"/>
        {/each}

        {#each stairs as stair}
            <div id="stairsIcon{stair}"/>
        {/each}

  
        {#each elevators as elevator}
            <div id="elevator{elevator}"/>
        {/each}

        {#each meetingIcons as meetingicon}
            <div id="meetingIcon{meetingicon}"/> 
        {/each}

        
        
        <div id="printIcon1"/>
        <div id="printIcon2"/>
        <div id="printIcon3"/>
        





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

#desk197 {
  position: absolute;
  left: 242px;
  top: 632.8px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk196 {
  position: absolute;
  left: 271px;
  top: 632.8px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk195 {
  position: absolute;
  left: 242px;
  top: 616.8px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;

}

#desk194 {
  position: absolute;
  left: 271px;
  top: 616.8px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;

}

#desk193 {
  position: absolute;
  left: 5.1px;
  top: 526.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk192 {
  position: absolute;
  left: 5.4px;
  top: 489px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk191 {
  position: absolute;
  left: 5.4px;
  top: 473px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk190 {
  position: absolute;
  left: 5.4px;
  top: 438px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk189 {
  position: absolute;
  left: 5.4px;
  top: 422px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk188 {
  position: absolute;
  left: 91.6px;
  top: 415.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk187 {
  position: absolute;
  left: 27px;
  top: 481px;
  width: 29px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk186 {
  position: absolute;
  left: 27px;
  top: 430px;
  width: 29px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk185 {
  position: absolute;
  left: 91.6px;
  top: 431.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk184 {
  position: absolute;
  left: 867px;
  top: 909px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk183 {
  position: absolute;
  left: 838px;
  top: 909px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk182 {
  position: absolute;
  left: 242.9px;
  top: 715.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk181 {
  position: absolute;
  left: 271.9px;
  top: 715.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk180 {
  position: absolute;
  left: 242.9px;
  top: 699.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk179 {
  position: absolute;
  left: 271.9px;
  top: 699.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk178 {
  position: absolute;
  left: 242px;
  top: 800px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk177 {
  position: absolute;
  left: 271px;
  top: 800px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk176 {
  position: absolute;
  left: 242px;
  top: 784px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk175 {
  position: absolute;
  left: 271px;
  top: 784px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk174 {
  position: absolute;
  left: 352px;
  top: 939px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk173 {
  position: absolute;
  left: 352px;
  top: 910px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk172 {
  position: absolute;
  left: 336px;
  top: 939px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk171 {
  position: absolute;
  left: 336px;
  top: 910px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk170 {
  position: absolute;
  left: 438px;
  top: 939px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk169 {
  position: absolute;
  left: 438px;
  top: 910px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk168 {
  position: absolute;
  left: 422px;
  top: 939px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk167 {
  position: absolute;
  left: 422px;
  top: 910px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk166 {
  position: absolute;
  left: 524.9px;
  top: 939.6px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk165 {
  position: absolute;
  left: 524.9px;
  top: 910.6px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk164 {
  position: absolute;
  left: 508.9px;
  top: 939.6px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk163 {
  position: absolute;
  left: 508.9px;
  top: 910.6px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk162 {
  position: absolute;
  left: 612.3px;
  top: 939.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk161 {
  position: absolute;
  left: 612.3px;
  top: 910.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk160 {
  position: absolute;
  left: 596.3px;
  top: 939.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk159 {
  position: absolute;
  left: 596.3px;
  top: 910.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk158 {
  position: absolute;
  left: 705px;
  top: 939.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk157 {
  position: absolute;
  left: 705px;
  top: 910.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk156 {
  position: absolute;
  left: 689px;
  top: 939.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk155 {
  position: absolute;
  left: 689px;
  top: 910.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk154 {
  position: absolute;
  left: 781px;
  top: 939.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk153 {
  position: absolute;
  left: 781px;
  top: 910.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk152 {
  position: absolute;
  left: 765px;
  top: 939.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk151 {
  position: absolute;
  left: 765px;
  top: 910.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(90.00027deg);
}

#desk150 {
  position: absolute;
  left: 1068.2px;
  top: 186.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk149 {
  position: absolute;
  left: 1039.2px;
  top: 186.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk148 {
  position: absolute;
  left: 1068.2px;
  top: 202.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk147 {
  position: absolute;
  left: 1039.2px;
  top: 202.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk146 {
  position: absolute;
  left: 1067.2px;
  top: 267.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk145 {
  position: absolute;
  left: 1038.2px;
  top: 267.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk144 {
  position: absolute;
  left: 1067.2px;
  top: 283.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk143 {
  position: absolute;
  left: 1038.2px;
  top: 283.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk142 {
  position: absolute;
  left: 1067.8px;
  top: 352.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk141 {
  position: absolute;
  left: 1038.8px;
  top: 352.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk140 {
  position: absolute;
  left: 1067.8px;
  top: 368.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk139 {
  position: absolute;
  left: 1038.8px;
  top: 368.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk138 {
  position: absolute;
  left: 1067.8px;
  top: 445.6px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk137 {
  position: absolute;
  left: 1038.8px;
  top: 445.6px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk136 {
  position: absolute;
  left: 1067.8px;
  top: 461.6px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk135 {
  position: absolute;
  left: 1038.8px;
  top: 461.6px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk134 {
  position: absolute;
  left: 1067px;
  top: 549.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk133 {
  position: absolute;
  left: 1038px;
  top: 549.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk132 {
  position: absolute;
  left: 1067px;
  top: 565.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk131 {
  position: absolute;
  left: 1038px;
  top: 565.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk130 {
  position: absolute;
  left: 1067px;
  top: 638.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk129 {
  position: absolute;
  left: 1038px;
  top: 638.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk128 {
  position: absolute;
  left: 1067px;
  top: 654.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk127 {
  position: absolute;
  left: 1038px;
  top: 654.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk126 {
  position: absolute;
  left: 832.6px;
  top: 326.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk125 {
  position: absolute;
  left: 803.6px;
  top: 326.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk124 {
  position: absolute;
  left: 832.6px;
  top: 342.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk123 {
  position: absolute;
  left: 803.6px;
  top: 342.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk122 {
  position: absolute;
  left: 832.6px;
  top: 421.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk121 {
  position: absolute;
  left: 803.6px;
  top: 421.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk120 {
  position: absolute;
  left: 832.6px;
  top: 437.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk119 {
  position: absolute;
  left: 803.6px;
  top: 437.9px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk118 {
  position: absolute;
  left: 832.3px;
  top: 524px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk117 {
  position: absolute;
  left: 803.3px;
  top: 524px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk116 {
  position: absolute;
  left: 832.3px;
  top: 540px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk115 {
  position: absolute;
  left: 803.3px;
  top: 540px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk114 {
  position: absolute;
  left: 832.3px;
  top: 627px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk113 {
  position: absolute;
  left: 803.3px;
  top: 627px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk112 {
  position: absolute;
  left: 832.3px;
  top: 643px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk111 {
  position: absolute;
  left: 803.3px;
  top: 643px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk110 {
  position: absolute;
  left: 867px;
  top: 972.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk109 {
  position: absolute;
  left: 838px;
  top: 972.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk108 {
  position: absolute;
  left: 867px;
  top: 988.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk107 {
  position: absolute;
  left: 838px;
  top: 988.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#line124 {
  position: absolute;
  left: 550px;
  top: 1061px;
  width: 2px;
  height: 38px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#meetingRoom16 {
  position: absolute;
  left: 189.3px;
  top: 600.3px;
  width: 37px;
  height: 65.2px;
  background-blend-mode: normal;
}

#meetingRoom15 {
  position: absolute;
  left: 150.8px;
  top: 666.1px;
  width: 75px;
  height: 134.2px;
  background-blend-mode: normal;
}

#printerRoom4 {
  position: absolute;
  left: 364.5px;
  top: 112px;
  width: 35px;
  height: 37.2px;
  background-blend-mode: normal;
}

#meetingRoom1 {
  position: absolute;
  left: 189.3px;
  top: 600.3px;
  width: 37px;
  height: 65.2px;
  background-blend-mode: normal;
}

#printerRoom2 {
  position: absolute;
  left: 150.8px;
  top: 1063px;
  width: 114.5px;
  height: 36.2px;
  background-blend-mode: normal;
}

#meetingRoom14 {
  position: absolute;
  left: 151px;
  top: 600px;
  width: 37.5px;
  height: 65.2px;
  background-blend-mode: normal;
}

#printerRoom1 {
  position: absolute;
  left: 262px;
  top: 454.5px;
  width: 37.5px;
  height: 45.2px;
  background-blend-mode: normal;
}

#printerRoom3 {
  position: absolute;
  left: 800.5px;
  top: 700px;
  width: 39.5px;
  height: 44.2px;
  background-blend-mode: normal;
}

#desk106 {
  position: absolute;
  left: 854px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk105 {
  position: absolute;
  left: 854px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk104 {
  position: absolute;
  left: 854px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk103 {
  position: absolute;
  left: 230px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk102 {
  position: absolute;
  left: 230px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk101 {
  position: absolute;
  left: 230px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk100 {
  position: absolute;
  left: 246px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk99 {
  position: absolute;
  left: 246px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk98 {
  position: absolute;
  left: 246px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk97 {
  position: absolute;
  left: 62px;
  top: 953px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk96 {
  position: absolute;
  left: 33px;
  top: 953px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk95 {
  position: absolute;
  left: 4px;
  top: 953px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk94 {
  position: absolute;
  left: 62px;
  top: 969px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk93 {
  position: absolute;
  left: 33px;
  top: 969px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk92 {
  position: absolute;
  left: 4px;
  top: 969px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk91 {
  position: absolute;
  left: 62px;
  top: 872px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk90 {
  position: absolute;
  left: 33px;
  top: 872px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk89 {
  position: absolute;
  left: 4px;
  top: 872px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk88 {
  position: absolute;
  left: 62px;
  top: 888px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk87 {
  position: absolute;
  left: 33px;
  top: 888px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk86 {
  position: absolute;
  left: 4px;
  top: 888px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk85 {
  position: absolute;
  left: 62px;
  top: 791px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk84 {
  position: absolute;
  left: 33px;
  top: 791px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk83 {
  position: absolute;
  left: 4px;
  top: 791px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk82 {
  position: absolute;
  left: 62px;
  top: 807px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk81 {
  position: absolute;
  left: 33px;
  top: 807px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk80 {
  position: absolute;
  left: 4px;
  top: 807px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk79 {
  position: absolute;
  left: 62px;
  top: 710px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk78 {
  position: absolute;
  left: 33px;
  top: 710px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk77 {
  position: absolute;
  left: 4px;
  top: 710px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk76 {
  position: absolute;
  left: 62px;
  top: 726px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk75 {
  position: absolute;
  left: 33px;
  top: 726px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk74 {
  position: absolute;
  left: 4px;
  top: 726px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk73 {
  position: absolute;
  left: 61.1px;
  top: 629px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk72 {
  position: absolute;
  left: 32.1px;
  top: 629px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk71 {
  position: absolute;
  left: 3.1px;
  top: 629px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk70 {
  position: absolute;
  left: 61.1px;
  top: 645px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk69 {
  position: absolute;
  left: 32.1px;
  top: 645px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk68 {
  position: absolute;
  left: 3.1px;
  top: 645px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk67 {
  position: absolute;
  left: 121px;
  top: 415.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk66 {
  position: absolute;
  left: 121px;
  top: 431.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk65 {
  position: absolute;
  left: 269.9px;
  top: 835.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk64 {
  position: absolute;
  left: 269.9px;
  top: 851.4px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk63 {
  position: absolute;
  left: 270.4px;
  top: 570px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk62 {
  position: absolute;
  left: 270.9px;
  top: 517.3px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk61 {
  position: absolute;
  left: 270.4px;
  top: 554px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk60 {
  position: absolute;
  left: 62.6px;
  top: 548px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk59 {
  position: absolute;
  left: 33.6px;
  top: 548px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk58 {
  position: absolute;
  left: 4.6px;
  top: 548px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk57 {
  position: absolute;
  left: 62.6px;
  top: 564px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk56 {
  position: absolute;
  left: 33.6px;
  top: 564px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk55 {
  position: absolute;
  left: 4.6px;
  top: 564px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk54 {
  position: absolute;
  left: 62px;
  top: 1055.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk53 {
  position: absolute;
  left: 33px;
  top: 1055.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk52 {
  position: absolute;
  left: 4px;
  top: 1055.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk51 {
  position: absolute;
  left: 62px;
  top: 1071.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk50 {
  position: absolute;
  left: 33px;
  top: 1071.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk49 {
  position: absolute;
  left: 13px;
  top: 1139px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk48 {
  position: absolute;
  left: 13px;
  top: 1156px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk47 {
  position: absolute;
  left: 4px;
  top: 1071.2px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(0.00025638196deg);
}

#desk46 {
  position: absolute;
  left: 150.5px;
  top: 1119.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk45 {
  position: absolute;
  left: 150.5px;
  top: 1148.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk44 {
  position: absolute;
  left: 150.5px;
  top: 1177.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk43 {
  position: absolute;
  left: 166.5px;
  top: 1119.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk42 {
  position: absolute;
  left: 166.5px;
  top: 1148.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk41 {
  position: absolute;
  left: 166.5px;
  top: 1177.5px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk40 {
  position: absolute;
  left: 309.9px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk39 {
  position: absolute;
  left: 309.9px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk38 {
  position: absolute;
  left: 309.9px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk37 {
  position: absolute;
  left: 325.9px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk36 {
  position: absolute;
  left: 325.9px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk35 {
  position: absolute;
  left: 325.9px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk34 {
  position: absolute;
  left: 441.7px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk33 {
  position: absolute;
  left: 441.7px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk32 {
  position: absolute;
  left: 441.7px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk31 {
  position: absolute;
  left: 457.7px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk30 {
  position: absolute;
  left: 457.7px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk29 {
  position: absolute;
  left: 457.7px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk28 {
  position: absolute;
  left: 527.7px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk27 {
  position: absolute;
  left: 527.7px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk26 {
  position: absolute;
  left: 527.7px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk25 {
  position: absolute;
  left: 543.7px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk24 {
  position: absolute;
  left: 543.7px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk23 {
  position: absolute;
  left: 543.7px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk22 {
  position: absolute;
  left: 609px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk21 {
  position: absolute;
  left: 609px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk20 {
  position: absolute;
  left: 609px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk19 {
  position: absolute;
  left: 625px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk18 {
  position: absolute;
  left: 625px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk17 {
  position: absolute;
  left: 625px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk16 {
  position: absolute;
  left: 689.5px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk15 {
  position: absolute;
  left: 689.5px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk14 {
  position: absolute;
  left: 689.5px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk13 {
  position: absolute;
  left: 705.5px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk12 {
  position: absolute;
  left: 705.5px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk11 {
  position: absolute;
  left: 705.5px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk10 {
  position: absolute;
  left: 769px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk9 {
  position: absolute;
  left: 769px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk8 {
  position: absolute;
  left: 769px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk7 {
  position: absolute;
  left: 785.2px;
  top: 1119px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk6 {
  position: absolute;
  left: 785.2px;
  top: 1148px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk5 {
  position: absolute;
  left: 785.2px;
  top: 1177px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
  transform: rotate(-90.00001deg);
}

#desk4 {
  position: absolute;
  left: 867px;
  top: 1050px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk3 {
  position: absolute;
  left: 838px;
  top: 1050px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk2 {
  position: absolute;
  left: 867px;
  top: 1066px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#desk1 {
  position: absolute;
  left: 838px;
  top: 1066px;
  width: 28px;
  height: 15px;
  background-blend-mode: normal;
}

#meetingIcon16 {
  position: absolute;
  left: 193.8px;
  top: 632.8px;
  width: 26px;
  height: 26px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon15 {
  position: absolute;
  left: 87px;
  top: 1168.8px;
  width: 26px;
  height: 26px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon14 {
  position: absolute;
  left: 506px;
  top: 1077px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon13 {
  position: absolute;
  left: 556px;
  top: 1077px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon12 {
  position: absolute;
  left: 912px;
  top: 475px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon11 {
  position: absolute;
  left: 959.5px;
  top: 475px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon10 {
  position: absolute;
  left: 965.3px;
  top: 430.7px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon9 {
  position: absolute;
  left: 919.2px;
  top: 427.6px;
  width: 19px;
  height: 19px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon8 {
  position: absolute;
  left: 157px;
  top: 632.8px;
  width: 26px;
  height: 26px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon7 {
  position: absolute;
  left: 171.8px;
  top: 728.5px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon6 {
  position: absolute;
  left: 536.1px;
  top: 1027.8px;
  width: 30px;
  height: 30px;
  background: url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon5 {
  position: absolute;
  left: 450.2px;
  top: 1049.5px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon4 {
  position: absolute;
  left: 316.5px;
  top: 1055px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon3 {
  position: absolute;
  left: 1031.4px;
  top: 736px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon2 {
  position: absolute;
  left: 933.1px;
  top: 633.6px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#meetingIcon1 {
  position: absolute;
  left: 933.1px;
  top: 564.6px;
  width: 30px;
  height: 30px;
  background:  url("/floorPlan-icons/meeting-room.png")  no-repeat;
  background-size: cover;
}

#printIcon3 {
  position: absolute;
  left: 273px;
  top: 478.3px;
  width: 15px;
  height: 15px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}

#printIcon2 {
  position: absolute;
  left: 812px;
  top: 727px;
  width: 15px;
  height: 15px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}

#printIcon1 {
  position: absolute;
  left: 170.8px;
  top: 1070.2px;
  width: 15px;
  height: 15px;
  background:  url("/floorPlan-icons/printer.png")  no-repeat;
  background-size: cover;
}

#stairsIcon8 {
  position: absolute;
  left: 914.8px;
  top: 753.2px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#stairsIcon7 {
  position: absolute;
  left: 903.8px;
  top: 720.2px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#stairsIcon6 {
  position: absolute;
  left: 865.5px;
  top: 147px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(-0.00013022845deg);
}

#stairsIcon5 {
  position: absolute;
  left: 905.5px;
  top: 160px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(179.99988deg);
}

#stairsIcon4 {
  position: absolute;
  left: 158px;
  top: 1001px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(0.00013022845deg);
}

#stairsIcon3 {
  position: absolute;
  left: 190.2px;
  top: 1015px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(179.99988deg);
}

#stairsIcon2 {
  position: absolute;
  left: 164.6px;
  top: 440px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) scaleY(-1);
}

#stairsIcon1 {
  position: absolute;
  left: 154.2px;
  top: 407px;
  width: 33px;
  height: 33px;
  background:  url("/floorPlan-icons/stairs.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1);
}

#elevator4 {
  position: absolute;
  left: 800.5px;
  top: 738.4px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90.00008deg);
}

#elevator3 {
  position: absolute;
  left: 800.5px;
  top: 765.8px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: scaleX(-1) rotate(90.00008deg);
}

#elevator2 {
  position: absolute;
  left: 260px;
  top: 420.8px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00008deg);
}

#elevator1 {
  position: absolute;
  left: 260px;
  top: 394px;
  width: 40px;
  height: 40px;
  background:  url("/floorPlan-icons/elevator.png")  no-repeat;
  background-size: cover;
  transform: rotate(90.00008deg);
}

#line120 {
  position: absolute;
  left: 260.5px;
  top: 400px;
  width: 2px;
  height: 100px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line123 {
  position: absolute;
  left: 151.6px;
  top: 400px;
  width: 2px;
  height: 100px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line119 {
  position: absolute;
  left: 199px;
  top: 400px;
  width: 2px;
  height: 100px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line122 {
  position: absolute;
  left: 800.5px;
  top: 742.5px;
  width: 39px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line121 {
  position: absolute;
  left: 261.5px;
  top: 453.5px;
  width: 38.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line118 {
  position: absolute;
  left: 75.5px;
  top: 499px;
  width: 223.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line117 {
  position: absolute;
  left: 201.6px;
  top: 399.3px;
  width: 98.4px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line113 {
  position: absolute;
  left: 188px;
  top: 600px;
  width: 2px;
  height: 65.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line112 {
  position: absolute;
  left: 225.3px;
  top: 600px;
  width: 2px;
  height: 65.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line115 {
  position: absolute;
  left: 208px;
  top: 528.5px;
  width: 2px;
  height: 71.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line114 {
  position: absolute;
  left: 149.5px;
  top: 528.5px;
  width: 2px;
  height: 71.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line111 {
  position: absolute;
  left: 149.5px;
  top: 600px;
  width: 2px;
  height: 65.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line109 {
  position: absolute;
  left: 225.3px;
  top: 665.5px;
  width: 2px;
  height: 134.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line108 {
  position: absolute;
  left: 149.5px;
  top: 665.5px;
  width: 2px;
  height: 134.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line101 {
  position: absolute;
  left: 200px;
  top: 935.8px;
  width: 50.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line94 {
  position: absolute;
  left: 1px;
  top: 1017.5px;
  width: 86px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line93 {
  position: absolute;
  left: 226.5px;
  top: 1000px;
  width: 2px;
  height: 63px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line116 {
  position: absolute;
  left: 151.6px;
  top: 527.5px;
  width: 57.4px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line110 {
  position: absolute;
  left: 151.6px;
  top: 599px;
  width: 74.7px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line107 {
  position: absolute;
  left: 150.5px;
  top: 664.5px;
  width: 74.7px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line106 {
  position: absolute;
  left: 150.5px;
  top: 799px;
  width: 74.7px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line99 {
  position: absolute;
  left: 150.5px;
  top: 972.5px;
  width: 100px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line96 {
  position: absolute;
  left: 150.5px;
  top: 899px;
  width: 115px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line89 {
  position: absolute;
  left: 150.5px;
  top: 999px;
  width: 115px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line92 {
  position: absolute;
  left: 150.5px;
  top: 1062px;
  width: 115px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line88 {
  position: absolute;
  left: 150.5px;
  top: 1098.5px;
  width: 115px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line87 {
  position: absolute;
  left: 73.5px;
  top: 1142px;
  width: 52px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line86 {
  position: absolute;
  left: 124.5px;
  top: 1143px;
  width: 2px;
  height: 56px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line85 {
  position: absolute;
  left: 72.5px;
  top: 1143px;
  width: 2px;
  height: 56px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#meetingRoom13 {
  position: absolute;
  left: 946.4px;
  top: 450px;
  width: 44px;
  height: 50px;
  background-blend-mode: normal;
}

#meetingRoom12 {
  position: absolute;
  left: 990.5px;
  top: 689.5px;
  width: 108px;
  height: 110px;
  background-blend-mode: normal;
}

#meetingRoom11 {
  position: absolute;
  left: 900px;
  top: 600.4px;
  width: 90px;
  height: 66px;
  background-blend-mode: normal;
}

#meetingRoom10 {
  position: absolute;
  left: 900px;
  top: 527px;
  width: 90px;
  height: 73px;
  background-blend-mode: normal;
}

#meetingRoom9 {
  position: absolute;
  left: 900px;
  top: 450px;
  width: 46px;
  height: 50px;
  background-blend-mode: normal;
}

#meetingRoom8 {
  position: absolute;
  left: 957.5px;
  top: 400px;
  width: 33px;
  height: 50px;
  background-blend-mode: normal;
}

#meetingRoom7 {
  position: absolute;
  left: 900px;
  top: 400px;
  width: 57px;
  height: 50px;
  background-blend-mode: normal;
}

#meetingRoom6 {
  position: absolute;
  left: 500px;
  top: 1000px;
  width: 100px;
  height: 61px;
  background-blend-mode: normal;
}

#meetingRoom5 {
  position: absolute;
  left: 551px;
  top: 1061px;
  width: 49px;
  height: 38px;
  background-blend-mode: normal;
}

#meetingRoom4 {
  position: absolute;
  left: 500px;
  top: 1061px;
  width: 51px;
  height: 38px;
  background-blend-mode: normal;
}

#meetingRoom3 {
  position: absolute;
  left: 433px;
  top: 1000px;
  width: 67px;
  height: 99px;
  background-blend-mode: normal;
}

#meetingRoom2 {
  position: absolute;
  left: 300.5px;
  top: 1000px;
  width: 62px;
  height: 99px;
  background-blend-mode: normal;
}

#meetingRoom1 {
  position: absolute;
  left: 73.5px;
  top: 1143px;
  width: 52px;
  height: 56px;
  background-blend-mode: normal;
}

#line84 {
  position: absolute;
  left: 300.5px;
  top: 999px;
  width: 62px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line81 {
  position: absolute;
  left: 300.5px;
  top: 1098.5px;
  width: 62px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line80 {
  position: absolute;
  left: 377px;
  top: 1137.5px;
  width: 34.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line79 {
  position: absolute;
  left: 376px;
  top: 1138.5px;
  width: 2px;
  height: 60.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line78 {
  position: absolute;
  left: 410.5px;
  top: 1138.5px;
  width: 2px;
  height: 60.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line77 {
  position: absolute;
  left: 500px;
  top: 1059px;
  width: 100px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line71 {
  position: absolute;
  left: 731.5px;
  top: 1055.5px;
  width: 2px;
  height: 43.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line70 {
  position: absolute;
  left: 700px;
  top: 1054.5px;
  width: 100.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line69 {
  position: absolute;
  left: 699.5px;
  top: 1000px;
  width: 0.5px;
  height: 99px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line83 {
  position: absolute;
  left: 361.5px;
  top: 1000px;
  width: 2px;
  height: 99px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line100 {
  position: absolute;
  left: 199px;
  top: 900px;
  width: 2px;
  height: 73.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line102 {
  position: absolute;
  left: 114.5px;
  top: 887.5px;
  width: 2px;
  height: 131px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line104 {
  position: absolute;
  left: 230.5px;
  top: 832.5px;
  width: 2px;
  height: 67.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line105 {
  position: absolute;
  left: 114.5px;
  top: 803px;
  width: 2px;
  height: 63.2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line103 {
  position: absolute;
  left: 151.5px;
  top: 832.5px;
  width: 2px;
  height: 67.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line98 {
  position: absolute;
  left: 149.5px;
  top: 900px;
  width: 2px;
  height: 73.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line97 {
  position: absolute;
  left: 249.5px;
  top: 900px;
  width: 2px;
  height: 73.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line91 {
  position: absolute;
  left: 264.5px;
  top: 1000px;
  width: 2px;
  height: 99.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line90 {
  position: absolute;
  left: 149.5px;
  top: 1000px;
  width: 2px;
  height: 99.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line82 {
  position: absolute;
  left: 299.5px;
  top: 1000px;
  width: 2px;
  height: 99px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line76 {
  position: absolute;
  left: 431.5px;
  top: 1000px;
  width: 2px;
  height: 99px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line75 {
  position: absolute;
  left: 499px;
  top: 1000px;
  width: 2px;
  height: 99px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line74 {
  position: absolute;
  left: 599.5px;
  top: 1000px;
  width: 0.5px;
  height: 99px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line68 {
  position: absolute;
  left: 800px;
  top: 1000px;
  width: 0.5px;
  height: 99px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line62 {
  position: absolute;
  left: 900px;
  top: 713.5px;
  width: 51.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line59 {
  position: absolute;
  left: 966.5px;
  top: 775.5px;
  width: 24px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line34 {
  position: absolute;
  left: 909px;
  top: 112px;
  width: 2px;
  height: 30.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line33 {
  position: absolute;
  left: 870.5px;
  top: 112px;
  width: 2px;
  height: 30.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line16 {
  position: absolute;
  left: 363.5px;
  top: 112.5px;
  width: 2px;
  height: 36.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line18 {
  position: absolute;
  left: 507px;
  top: 111.5px;
  width: 2px;
  height: 88.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line14 {
  position: absolute;
  left: 299px;
  top: 111.5px;
  width: 2px;
  height: 88.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line30 {
  position: absolute;
  left: 759px;
  top: 110.5px;
  width: 193.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line31 {
  position: absolute;
  left: 844px;
  top: 141.5px;
  width: 108.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line39 {
  position: absolute;
  left: 844px;
  top: 222.5px;
  width: 108.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line40 {
  position: absolute;
  left: 844px;
  top: 261.2px;
  width: 56px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line47 {
  position: absolute;
  left: 900px;
  top: 499.8px;
  width: 90.5px;
  height: 0.2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line46 {
  position: absolute;
  left: 900px;
  top: 449.8px;
  width: 90.5px;
  height: 0.2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line54 {
  position: absolute;
  left: 978.5px;
  top: 688.5px;
  width: 120.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line56 {
  position: absolute;
  left: 900px;
  top: 600px;
  width: 90px;
  height: 0.3px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line55 {
  position: absolute;
  left: 900px;
  top: 666.7px;
  width: 90px;
  height: 0.3px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line52 {
  position: absolute;
  left: 900px;
  top: 527px;
  width: 90.5px;
  height: 0.2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line45 {
  position: absolute;
  left: 900px;
  top: 399.8px;
  width: 90.5px;
  height: 0.2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line36 {
  position: absolute;
  left: 844px;
  top: 299px;
  width: 108.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line41 {
  position: absolute;
  left: 982.5px;
  top: 180.3px;
  width: 116.5px;
  height: 0.2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line29 {
  position: absolute;
  left: 759px;
  top: 199px;
  width: 193.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line20 {
  position: absolute;
  left: 508px;
  top: 199px;
  width: 223.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line19 {
  position: absolute;
  left: 508px;
  top: 110.5px;
  width: 224.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line17 {
  position: absolute;
  left: 300px;
  top: 110.5px;
  width: 166.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line13 {
  position: absolute;
  left: 300px;
  top: 148px;
  width: 100px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line25 {
  position: absolute;
  left: 699px;
  top: 155px;
  width: 33.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line44 {
  position: absolute;
  left: 800px;
  top: 299px;
  width: 44px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line51 {
  position: absolute;
  left: 945.4px;
  top: 450px;
  width: 2px;
  height: 50px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line50 {
  position: absolute;
  left: 956.5px;
  top: 400px;
  width: 2px;
  height: 50px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line57 {
  position: absolute;
  left: 899px;
  top: 527.2px;
  width: 2px;
  height: 139.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line61 {
  position: absolute;
  left: 950.5px;
  top: 714.5px;
  width: 2px;
  height: 85.2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line67 {
  position: absolute;
  left: 632.5px;
  top: 1098px;
  width: 167.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line73 {
  position: absolute;
  left: 432.5px;
  top: 1098px;
  width: 167.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line72 {
  position: absolute;
  left: 432.5px;
  top: 999px;
  width: 176.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line66 {
  position: absolute;
  left: 632.5px;
  top: 999px;
  width: 167.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line65 {
  position: absolute;
  left: 800.5px;
  top: 699px;
  width: 99.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line64 {
  position: absolute;
  left: 800.5px;
  top: 799.7px;
  width: 99.5px;
  height: 0.3px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line63 {
  position: absolute;
  left: 839px;
  top: 700.5px;
  width: 2px;
  height: 99.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line60 {
  position: absolute;
  left: 899px;
  top: 700px;
  width: 2px;
  height: 100px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line58 {
  position: absolute;
  left: 989.5px;
  top: 689.5px;
  width: 2px;
  height: 87px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line53 {
  position: absolute;
  left: 989.5px;
  top: 527.3px;
  width: 2px;
  height: 139.4px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line49 {
  position: absolute;
  left: 989.5px;
  top: 400px;
  width: 2px;
  height: 100px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line48 {
  position: absolute;
  left: 899px;
  top: 400px;
  width: 2px;
  height: 100px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line125 {
  position: absolute;
  left: 899px;
  top: 300px;
  width: 2px;
  height: 57.9px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line43 {
  position: absolute;
  left: 989.5px;
  top: 262.4px;
  width: 2px;
  height: 112.1px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line42 {
  position: absolute;
  left: 989.5px;
  top: 180.3px;
  width: 2px;
  height: 61.2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line32 {
  position: absolute;
  left: 951.5px;
  top: 112px;
  width: 2px;
  height: 88px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line38 {
  position: absolute;
  left: 899px;
  top: 224.5px;
  width: 2px;
  height: 75.5px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line37 {
  position: absolute;
  left: 951.5px;
  top: 200px;
  width: 2px;
  height: 100px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line35 {
  position: absolute;
  left: 843px;
  top: 200px;
  width: 2px;
  height: 100px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line28 {
  position: absolute;
  left: 843px;
  top: 112px;
  width: 2px;
  height: 88px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line27 {
  position: absolute;
  left: 800.5px;
  top: 112px;
  width: 2px;
  height: 88px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line26 {
  position: absolute;
  left: 758px;
  top: 112px;
  width: 2px;
  height: 88px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line24 {
  position: absolute;
  left: 698px;
  top: 112px;
  width: 2px;
  height: 88px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line23 {
  position: absolute;
  left: 731.5px;
  top: 112px;
  width: 2px;
  height: 88px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line22 {
  position: absolute;
  left: 566px;
  top: 112px;
  width: 2px;
  height: 88px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line21 {
  position: absolute;
  left: 600px;
  top: 112px;
  width: 2px;
  height: 88px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line15 {
  position: absolute;
  left: 399px;
  top: 112px;
  width: 2px;
  height: 88px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line12 {
  position: absolute;
  left: 300px;
  top: 199px;
  width: 163.5px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line10 {
  position: absolute;
  left: 300px;
  top: 900px;
  width: 500px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line9 {
  position: absolute;
  left: 300px;
  top: 299px;
  width: 500px;
  height: 2px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line11 {
  position: absolute;
  left: 799.5px;
  top: 301px;
  width: 2px;
  height: 600px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line8 {
  position: absolute;
  left: 299px;
  top: 300px;
  width: 2px;
  height: 600px;
  border: 1px solid #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line7 {
  position: absolute;
  left: 1098px;
  top: 0px;
  width: 2px;
  height: 799.67px;
  border: 1px dashed #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line6 {
  position: absolute;
  left: 1px;
  top: 1198px;
  width: 898.37px;
  height: 2px;
  border: 1px dashed #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line5 {
  position: absolute;
  left: 0px;
  top: 400.33px;
  width: 2px;
  height: 798.67px;
  border: 1px dashed #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line4 {
  position: absolute;
  left: 1px;
  top: 399.33px;
  width: 200.14px;
  height: 2px;
  border: 1px dashed #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line3 {
  position: absolute;
  left: 898.37px;
  top: 799.67px;
  width: 2px;
  height: 399.33px;
  border: 1px dashed #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line2 {
  position: absolute;
  left: 899.36px;
  top: 798.67px;
  width: 199.64px;
  height: 2px;
  border: 1px dashed #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line127 {
  position: absolute;
  left: 200.64px;
  top: 0px;
  width: 898.37px;
  height: 2px;
  border: 1px dashed #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}

#line126 {
  position: absolute;
  left: 201.13px;
  top: 1px;
  width: 1px;
  height: 399.33px;
  border: 1px dashed #ff0000;
  background: #5100ff;
  background-blend-mode: normal;
}



</style>