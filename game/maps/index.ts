import World from './rdworld.json';

const entries = World.maps.map((d) => {
    const map = require('./' + d.fileName) as TiledMapOrthogonal;
    const name = d.fileName.split('.').shift()!;

    return [name, map] as [string, TiledMapOrthogonal];
})

export const MapList = Object.fromEntries(entries);

