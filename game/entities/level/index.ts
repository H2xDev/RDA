import { Entity, EntityEvents } from "../../../core/entity";
import { Scene } from "../../../core/scene";
import { V } from "../../../core/utils/vector2";
import { resolveTemplate } from "../../editor/templates";
import { Level } from '../../../core/tiled/level';
import {Body} from "../body";

const { instance: LevelManager } = Level;

const resolve = require.context('./', false, /\.entity\.ts$/);

const entries = resolve.keys().map(path => {
    const comp = resolve(path);
    const [className] = Object.keys(comp);

    return [className, comp[className]];
});

const levelEntities = Object.fromEntries(entries) as {
    [key: string]: new (propertes: any) => Entity,
}

const getProperties = <T extends { properties: TiledProperty[] }>(o: T) => {
    if (!o.properties) return {};

    const entries = o.properties.map(p => {
        return [p.name, p.value];
    })

    return Object.fromEntries(entries);
}

export const spawnEntities = (s: Scene) => {
    const bySupport = (o: TiledObject) => {
        const object = resolveTemplate(o);

        return (object.type in levelEntities);
    }

    const toEntities = (o: TiledObject) => {
        const object = resolveTemplate(o);
        const size = { x: object.width, y: object.height };
        const h = V.div(size, 2);
        const oProps = getProperties(object);
        const tProps = getProperties({ properties: object.templateProperties || [] });
        const props = {
            ...tProps,
            ...oProps,
        }
        
        const posVector = V.update(object);

        if (object.gid) {
            posVector.sub(V.onlyY(size));
        }

        posVector.add(h);

        const e = new levelEntities[object.type](props);
        
        if (e instanceof Body) {
            e.size.x = object.width;
            e.size.y = object.height;
        }

        V.update(e.position).set(object);
        s.addEntity(e, String(object.id));
        return e;
    }

    const triggerEvents = (e: Entity) => {
        e.setScene(s);
        e.trigger(EntityEvents.SPAWN, e);
    }

    LevelManager.objects
    .filter(bySupport)
    .map(toEntities)
    .forEach(triggerEvents);
}
