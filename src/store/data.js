const rooms = [
    {
        name: `01`,
        type: "meetingRoom",
        floor: "4",
        building: "VAT83A",
        equipment: "Logitech group, TV, HDMI"
    },
    {
        name: `02`,
        type: "meetingRoom",
        floor: "0",
        building: "VAT83A",
        equipment: "Logitech group"
    },
    {
        name: `03`,
        type: "meetingRoom",
        floor: "0", 
        building: "VAT83A",
        equipment: "Logitech group"
    },
    {
        name: `04`,
        type: "meetingRoom",
        floor: "0", 
        building: "VAT83A",
        equipment: "Logitech group"
    },
    {
        name: `01`,
        type: "printerRoom",
        floor: "0", 
        building: "VAT83A",
        equipment: "Cannon"
    },
    {
        name: `02`,
        type: "printerRoom",
        floor: "0", 
        building: "VAT83A",
        equipment: "Cannon"
    },
    {
        name: `01`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `02`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `03`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `04`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `05`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `06`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `07`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `08`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `09`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `10`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `11`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `12`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `13`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `14`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `15`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `16`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `17`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `18`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `19`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },
    {
        name: `20`,
        type: "desk",
        floor: "0", 
        building: "VAT83A",
        equipment: "Lenovo docking station, 2 monitors"
    },

]

const buildings = [
    {
        name: "VAT83A",
        lng: 12.479901795222497,
        lat: 55.73510758176267,
        location: "Vandtårnsvej 83A, 2860 Søborg, Denmark",
        floors: [0,3,4]
    },
    {
        name: "KH7",
        lng: 12.474698336540886,
        lat: 55.731868790571276,
        location: "Knud Højgaards Vej 7, 2860 Søborg, Denmark",
        floors: [0,1,2]
    },
    {
        name: "Chiba Facility",
        lng: 140.10951294244973,
        lat: 35.53848158582272,
        floors: [0,1,2,3,4,5],
        location: "10 Goikaigan, Chiba, Japan"
    }
    ,
    {
        name: "Milan Facility",
        lng: 9.188459141002138,
        lat: 45.53172243209325,
        location: "Via Olgettina, 58, Milan, Italy"
    },
    {
        name: "Headquarters",
        lng: -122.20083465937067,
        lat: 47.802990703043676,
        location: "23rd Drive Southeast, Bothell, WA 98021, Seattle"
    }
]


export { rooms, buildings}