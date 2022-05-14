export interface EntityTemplate {
    object:  Object;
    tileset: Tileset;
    type:    string;
}

export interface Object {
    gid:      number;
    height:   number;
    id:       number;
    name:     string;
    rotation: number;
    type:     string;
    visible:  boolean;
    width:    number;
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

export const resolveTemplate = (o: TiledObject) => {
    if (!o.template) return;

    const file = o.template!.split('/').pop()!;

    return enitityTemplates[file];
}
