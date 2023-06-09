
const buildings = [
    {
        name: "VAT83A",
        lng: 12.479901795222497,
        lat: 55.73510758176267,
        location: "Vandtårnsvej 83A, 2860 Søborg, Denmark",
        floors: [
            {
                level: 0,
                departments: ["depart1", "depart2"]
            },
            {
                level: 3,
                departments: ["depart1", "depart2"]
            },
            {
                level: 4,
                departments: ["depart1", "depart2", "depart3", "depart4"]
            }
        ]
    },
    {
        name: "VAT83B",
        lng: 12.479901795222497,
        lat: 55.73510758176267,
        location: "Vandtårnsvej 83B, 2860 Søborg, Denmark",
        floors: [
        {
            level: -1,
            departments: ["depart1", "depart2"]
        },
        {
            level: 0,
            departments: ["depart1", "depart2"]
        },
        {
            level: 1,
            departments: ["depart1", "depart2"]
        },
        {
            level: 2,
            departments: ["depart1", "depart2", "depart3"]
        }
    ]
    },
    {
        name: "KH7",
        lng: 12.474698336540886,
        lat: 55.731868790571276,
        location: "Knud Højgaards Vej 7, 2860 Søborg, Denmark"
    },
    {
        name: "Chiba Facility",
        lng: 140.10951294244973,
        lat: 35.53848158582272,
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

const allRooms = [
    {
        _id: "647fd164bc9b3123029200e0",
        name: "4.47",
        type: "meetingRoom",
        floor_id: "647fcaf39596edd0dd65344a",
        
    },
    {
        _id: "647fd169bc9b3123029200e2",
        name: "4.48",
        type: "meetingRoom",
        floor_id: "647fcaf39596edd0dd65344a",
        
    },
    {
        _id: "647fd1bcbc9b3123029200e4",
        name: "4.10",
        type: "printerRoom",
        floor_id: "647fcaf39596edd0dd65344a",
        
    },
    {
        _id: "647fd2a4bc9b3123029200e6",
        name: "4.01",
        type: "office",
        floor_id: "647fcaf39596edd0dd65344a",
        
    },
    {
        _id: "64822a7e33cc09e1a61eae88",
        name: "3.25",
        type: "meetingRoom",
        floor_id: "647fcad99596edd0dd653448",
        
    }
]

const roomInstruments = [
    {
        _id: "648221cef71e86cda4429b7a",
        roomName: "4.10",
        roomType: "printerRoom",
        instrumentName: "Tool-3"
    },
    {
        _id: "648225130ba9dcc1a0ea79a1",
        roomName: "4.10",
        roomType: "printerRoom",
        instrumentName: "Tool-6",
        instrumentDesc: "Test description"
    }
]


export { buildings, allRooms, roomInstruments}