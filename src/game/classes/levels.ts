type PlanetSize = 's' | 'm' | 'l';

export class Level {
    planets: Planet[]
    signalSpeed: number
}

class Planet {
    x: number
    y: number
    connections: number[]
    sprite: number
    size: PlanetSize
}

export const levels: Level[] = [
    {
        planets: [
            {x: 150, y: 250, connections: [1], sprite: 2, size: 'l'},
            {x: 230, y: 70, connections: [2, 0], sprite: 1, size: 'm'},
            {x: 420, y: 250, connections: [3, 1], sprite: 2, size: 's'},
            {x: 500, y: 60, connections: [], sprite: 3, size: 'm'}
        ],
        signalSpeed: 10
    },
    {
        planets: [
            {x: 100, y: 75, connections: [1], sprite: 0, size: 'm'},
            {x: 190, y: 130, connections: [0, 2, 4], sprite: 1, size: 'l'},
            {x: 200, y: 220, connections: [1, 3], sprite: 2, size: 'm'},
            {x: 90, y: 280, connections: [0], sprite: 3, size: 's'},
            {x: 440, y: 120, connections: [1, 5], sprite: 3, size: 'm'},
            {x: 540, y: 180, connections: [4, 6], sprite: 1, size: 's'},
            {x: 450, y: 280, connections: [], sprite: 2, size: 'l'},
        ],
        signalSpeed: 10
    },
    {
        planets: [
            {x: 320, y: 180, connections: [1, 5, 9], sprite: 0, size: 'l'},
            {x: 420, y: 180, connections: [0, 2], sprite: 1, size: 'm'},
            {x: 500, y: 320, connections: [1, 3], sprite: 1, size: 's'},
            {x: 580, y: 80, connections: [2, 4], sprite: 3, size: 's'},
            {x: 360, y: 60, connections: [3, 5], sprite: 2, size: 'l'},

            {x: 220, y: 70, connections: [6], sprite: 1, size: 'l'},
            {x: 120, y: 110, connections: [7, 5], sprite: 2, size: 's'},
            {x: 40, y: 170, connections: [6, 8], sprite: 3, size: 'm'},
            {x: 115, y: 220, connections: [7, 9], sprite: 0, size: 'm'},
            {x: 210, y: 310, connections: [8], sprite: 3, size: 'l'},
        ],
        signalSpeed: 12
    },
    {
        planets: [
            {x: 64, y: 48, connections: [1], sprite: 0, size: 's'},
            {x: 68, y: 106, connections: [0, 2, 4], sprite: 1, size: 'm'},
            {x: 88, y: 200, connections: [1, 3, 5], sprite: 2, size: 'l'},
            {x: 128, y: 270, connections: [2, 6, 7], sprite: 3, size: 's'},

            {x: 170, y: 84, connections: [1, 5, 8], sprite: 0, size: 's'},
            {x: 220, y: 160, connections: [2, 4, 9], sprite: 2, size: 'm'},
            {x: 210, y: 240, connections: [3, 10], sprite: 2, size: 's'},
            {x: 213, y: 312, connections: [3, 10], sprite: 3, size: 'l'},

            {x: 296, y: 80, connections: [4, 9, 11], sprite: 0, size: "l"},
            {x: 370, y: 144, connections: [5, 8, 13, 14], sprite: 3, size: 'm'},
            {x: 310, y: 250, connections: [6, 7, 14], sprite: 1, size: 'l'},
            {x: 400, y: 70, connections: [8, 12, 13], sprite: 0, size: 'm'},

            {x: 500, y: 60, connections: [11, 15], sprite: 0, size: 's'},
            {x: 450, y: 120, connections: [9, 11, 17], sprite: 1, size: 'm'},
            {x: 450, y: 230, connections: [9, 10, 17, 18], sprite: 2, size: 's'},
            {x: 600, y: 75, connections: [12, 16], sprite: 2, size: 'm'},

            {x: 610, y: 150, connections: [15, 17], sprite: 0, size: 'l'},
            {x: 570, y: 210, connections: [13, 14, 16, 18], sprite: 3, size: 'm'},
            {x: 550, y: 300, connections: [14, 17], sprite: 2, size: 'm'},
        ],
        signalSpeed: 10
    },
]

export function generateLevel(planetCount: number, signalSpeed: number, width: number, height: number): Level {

    const planets: Planet[] = []

    for (let i = 0; i < planetCount; i++) {
        const size = getPlanetSize();
        const radius = radiusForSize(size);

        for (let tries = 0; tries < 200; tries++) {
            const x = (radius + 5) + (Math.random() * (width - 2 * radius - 10));
            const y = (radius + 5) + (Math.random() * (height - 2 * radius - 10));

            if (isValidPosition(x, y, radius, planets)) {
                planets.push({
                    x, y, size,
                    connections: [],
                    sprite: randomSprite()
                });
                break;
            }
        }
    }

    const maxDist = 300;
    for (let i = 0; i < planets.length; i++) {
        const neighbors = planets
            .map((p, j) => ({index: j, dist: distance(planets[i], p)}))
            .filter(n => n.index !== i && n.dist <= maxDist)
            .sort((a, b) => a.dist - b.dist);

        const count = Math.min(2, neighbors.length);
        for (let k = 0; k < count; k++) {
            const j = neighbors[k].index;
            addConnection(planets, i, j);
        }
    }

    ensureConnected(planets);

    return {
        planets,
        signalSpeed
    };
}

function getPlanetSize(): PlanetSize {
    const randomValue = Math.random() * 100;
    if (randomValue < 33) {
        return 's';
    } else if (randomValue < 66) {
        return 'm';
    } else {
        return 'l';
    }
}

function radiusForSize(size: PlanetSize): number {
    switch (size) {
        case 's':
            return 24;
        case 'm':
            return 32;
        case 'l':
            return 48
    }
}

function isValidPosition(x: number, y: number, radius: number, planets: Planet[]): boolean {
    for (const planet of planets) {
        const distancePlanet = distance(planet, {x, y});
        if (distancePlanet < radius + radiusForSize(planet.size)) {
            return false;
        }
    }
    return true;
}

function randomSprite(): number {
    const sprites = [0, 1, 2, 3,];
    return sprites[Math.floor(Math.random() * sprites.length)];
}

function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function addConnection(planets: Planet[], i: number, j: number) {
    const p1 = planets[i];
    const p2 = planets[j];
    if (p1.connections.indexOf(j) === -1 && p2.connections.indexOf(i) === -1) {
        p1.connections.push(j);
        p2.connections.push(i);
    }
}

function ensureConnected(planets: Planet[]) {
    let visited = new Set<number>();
    const queue: number[] = [];
    queue.push(0);

    while (queue.length > 0) {
        const current = queue.shift()!;
        visited.add(current);

        const neighbors = planets[current].connections.filter(n => !visited.has(n));
        queue.push(...neighbors);
    }

    if (visited.size == planets.length) {

    } else {
        let notConnected = planets.findIndex((_, i) => !visited.has(i));

        let visitedPlanets: { distance: number, index: number }[] = []
        visited.forEach((i) => {
            visitedPlanets.push({distance: distance(planets[notConnected], planets[i]), index: i})
        })

        let bestConnectionm = visitedPlanets.sort((a, b) => a.distance - b.distance).filter(d => d.distance != 0)[0];

        addConnection(planets, notConnected, bestConnectionm.index);
        ensureConnected(planets);
    }
}