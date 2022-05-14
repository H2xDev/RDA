import { Entity } from "../../../core/entity";

const resolve = require.context('./', false, /\.entity\.ts$/);

const entries = resolve.keys().map(path => {
    const comp = resolve(path);
    const [className] = Object.keys(comp);

    return [className, comp[className]];
});

export const levelEntities = Object.fromEntries(entries) as {
    [key: string]: new () => Entity,
}
