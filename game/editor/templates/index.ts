export interface EntityTemplate {
    object:  TiledObject;
    tileset: Tileset;
    type:    string;
}

export interface Tileset {
    firstgid: number;
    source:   string;
}

const resolve = require.context('./', false, /\.json$/);

const entries = resolve.keys().map(path => {
    const templateFile = path.split('/').pop()!;
    const comp = resolve(path);

    return [templateFile, comp];
});

export const enitityTemplates = Object.fromEntries(entries) as {
    [key: string]: EntityTemplate,
}

export interface TemplatedObject extends TiledObject {
    templateProperties?: TiledProperty[];
}

export const resolveTemplate = (o: TiledObject) => {
    if (!o.template) return o as TemplatedObject;

    const file = o.template!.split('/').pop()!;

    const t = enitityTemplates[file];

    if (!t) return o as TemplatedObject;

    return {
        ...t.object,
        ...o,
        templateProperties: t.object.properties,
    } as TemplatedObject;
}
