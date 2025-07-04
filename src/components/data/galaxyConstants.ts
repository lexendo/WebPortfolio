export const GALAXY_BACKGROUND_COLOR = 0x0a0a0a

export const PLANET_SETTINGS = {
    radius: 0.7,
    glowRadius: 0.8,
    segments: 24,
    glowSegments: 16,
    glowOpacity: 0.15,
};
export const LABEL_SETTINGS = {
    canvasWidth: 512,
    canvasHeight: 128,
    fontSize: 64,
    planeSize: [4, 1]
};

export const clustersData = [
    {
        id: 1,
        name: 'About Me',
        centerPosition: [4, 2.5, 0],
        color: 0x4a90e2,
        orbitRadius: 2,
        orbitSpeed: 0.5,
        planets: [
            { name: "Bio" },
            { name: "Skills" },
            { name: "Education" },
            { name: "Hobbies" },
        ]
    },
    {
        id: 2,
        name: 'Projects',
        centerPosition: [-2, 3.5, 1],
        color: 0x00ffcc,
        orbitRadius: 3.5,
        orbitSpeed: 0.05,
        planets: [
            { name: "CouchPick" },
            { name: "NotSoEpicApp" },
            { name: "FHIRCaster" },
            { name: "Crosswords" },
            { name: "DroneSim" },
            { name: "Portfolio" },
            { name: "Unity Game" },
        ]
    },
    {
        id: 3,
        name: 'Experiences',
        centerPosition: [-3, -2.5, -1],
        color: 0xffff00,
        orbitRadius: 1,
        orbitSpeed: 0.5,
        planets: [
            { name: "Siemens Healthineers", image: "/siemens.jpg" },
            { name: "FMFI", image: "/fmfi.jpg" }
        ]
    },
    {
        id: 4,
        name: 'Contacts',
        centerPosition: [3, -3, 1],
        color: 0x8e44ad,
        orbitRadius: 2,
        orbitSpeed: 0.5,
        planets: [
            { name: "LinkedIn", image: "/linkedin.png"  },
            { name: "GitHub", image: "/github.png" },
            { name: "Email", image: "/gmail2.png"  },
            { name: "Instagram", image: "/instagram.png"  },
        ]
    }
];