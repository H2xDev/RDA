import Matter from "matter-js";
import TiledMap, {Point, TiledLayer, TiledLayerImagelayer, TiledLayerObjectgroup, TiledMapOrthogonal, TiledObject} from "tiled-types/types";
import {Camera} from "../core/camera";
import {Entity} from "../core/entity";
import {V} from "../core/utils/vectorUtil";
import { context as c, renderer } from "../game/engine";

const toRad = 1 / 180 * Math.PI;

export class MapManager extends Entity {
    private currentMap!: TiledMap;
    private camera!: Camera;

    public async loadMap(name: string) {
        const fullPath = `/maps/${name}.json`;
        const asJSON = (t: Response) => t.json();
        this.currentMap = await fetch(fullPath).then(asJSON); 
        await this.loadImageLayers();

        this.parseMap();
        this.setBackgroundColor();
    }

    public setCamera(camera: Camera) {
        this.camera = camera;
    }

    private setBackgroundColor() {
        renderer.setBackgroundColor(this.currentMap.backgroundcolor || "#000");
    }

    private loadImageLayers() {
        if (!this.currentMap) return;
        const { layers } = this.currentMap;
        const imageLayers = layers.filter(layer => layer.type === 'imagelayer') as TiledLayerImagelayer[];

        const loadImage = (l: TiledLayerImagelayer) => {
            const fileName = l.image.split('/').pop();
            console.log(fileName);

            return new Promise<void>(r => {
                const i = new Image();
                i.src = '/gfx/' + fileName;
                l.image = i as unknown as string;
                
                i.onload = () => r();
            }); 
        }

        const promises = imageLayers.map(loadImage);

        return Promise.all(promises);
    }

    private parseMap() {
        const layers = this.currentMap.layers as TiledLayerObjectgroup[];
        const { objects = [] } = layers.find(layer => !!layer.objects) || {};
        console.log(this.currentMap);
        const { world } = this.scene;

        const toVertices = (vertexList: Point[]) => {
            return [vertexList];
        }

        const getPolylineBounds = (vertexList: Point[]) => {
            let hx = -Infinity;
            let hy = -Infinity;
            let lx = Infinity;
            let ly = Infinity;


            vertexList.forEach((p) => {
                if (p.x > hx) hx = p.x;
                if (p.y > hy) hy = p.y;
                if (p.x < lx) lx = p.x;
                if (p.y < ly) ly = p.y;
            });

            return {
                max: V.Cr(hx, hy),
                min: V.Cr(lx, ly),
            }
        }
        
        const parseObject = (o: TiledObject) => {
            const { sin, cos, PI } = Math;
            const rot = o.rotation * toRad;
            
            let body: Matter.Body | undefined;

            if (o.polyline) {
                const vertices = Matter.Vertices.chamfer(o.polyline, 10, 10, 10, 10);
                body = Matter.Bodies
                    .fromVertices(0, 0, [vertices], { isStatic: true }, true);

                const originalBounds = getPolylineBounds(o.polyline);
                const offsetX = originalBounds.max.x - body.bounds.max.x;
                const offsetY = originalBounds.max.y - body.bounds.max.y;

                Matter.Body.translate(body, { x: offsetX + o.x, y: offsetY + o.y });
                console.log(body);
            }

            if (!body) {
                o = { ...o };
                o.x += cos(rot) * o.width / 2;
                o.y += sin(rot) * o.width / 2;
                o.x += cos(rot + PI / 2) * o.height / 2;
                o.y += sin(rot + PI / 2) * o.height / 2;

                body = Matter.Bodies
                .rectangle(
                    o.x, o.y,
                    o.width, o.height,
                    { isStatic: true },
                );

                Matter.Body
                    .setAngle(body, rot);

            }

            
            return body as Matter.Body;
        }

        const bodies = objects
            .filter(e => !!e)
            .map(parseObject) as Matter.Body[];

        Matter.Composite.add(world, bodies);
    }

    public renderImageLayers() {
        if (!this.currentMap) return;
        if (!this.camera) return;

        const { layers } = this.currentMap;
        const imageLayers = layers.filter(layer => layer.type === 'imagelayer') as TiledLayerImagelayer[];    
       

        const renderImageLayer = (l: any) => {
            const image = l.image as HTMLImageElement;
            const { position: cpos, resolution } = this.camera;
            const px = 1 - (l.parallaxx === undefined ? 1 : l.parallaxx);
            const py = 1 - (l.parallaxy === undefined ? 1 : l.parallaxy);
            const ox = l.offsetx || 0;
            const oy = l.offsety || 0;
            
            const x = ox + cpos.x * px;
            const y = oy + cpos.y * py;

            let [sw, sh] = resolution;

            sw /= this.camera.zoom;
            sh /= this.camera.zoom;

            if (x + image.width > cpos.x - sw / 2 && x < cpos.x + sw / 2 &&
               y + image.height > cpos.y - sh / 2 && y < cpos.y + sh / 2) {
                c.drawImage(image, x, y);
            }
        }

        imageLayers.forEach(renderImageLayer);
    }
}
