
const buildings = [
    {
        name: "VAT83A",
        lng: 12.479901795222497,
        lat: 55.73510758176267,
        location: "Vandtårnsvej 83A, 2860 Søborg, Denmark",
        floors: [
            {
                level: 0
            },
            {
                level: 3
            },
            {
                level: 4
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
            level: -1
        },
        {
            level: 0
        },
        {
            level: 1
        },
        {
            level: 2
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

const buildingsGrid = [
    {
        building: "VAT83A",
        floorGridVertical: [],
        floorGridHorizontal: []
    },
    {
        building: "VAT83B",
        floorGridVertical: [
            {
                left: 0
            },
            {
                left: 100
            },
            {
                left: 200
            },
            {
                left: 300
            },
            {
                left: 400
            },
            {
                left: 500
            },
            {
                left: 600
            },
            {
                left: 700
            }
        ],
        floorGridHorizontal: [
            {
                top: 0
            },
            {
                top: 100
            },
            {
                top: 200
            },
            {
                top: 300
            },
            {
                top: 400
            },
            {
                top: 500
            },
            {
                top: 600
            },
            {
                top: 700
            },
            {
                top: 800
            },
            {
                top: 900
            },
            {
                top: 1000
            },
            {
                top: 1100
            },
            {
                top: 1200
            }
        ]
    }
]


const floorGridVertical = [
    {
        left: 0
    },
    {
        left: 100
    },
    {
        left: 200
    },
    {
        left: 300
    },
    {
        left: 400
    },
    {
        left: 500
    },
    {
        left: 600
    },
    {
        left: 700
    }
]

const floorGridHorizontal = [
    {
        top: 0
    },
    {
        top: 100
    },
    {
        top: 200
    },
    {
        top: 300
    },
    {
        top: 400
    },
    {
        top: 500
    },
    {
        top: 600
    },
    {
        top: 700
    },
    {
        top: 800
    },
    {
        top: 900
    },
    {
        top: 1000
    },
    {
        top: 1100
    },
    {
        top: 1200
    }
]


export { buildings, buildingsGrid }