import { Resource } from "../resourceManager";
import { ResourceEvents } from "../types/fileManagerEvents.enum";
import { Camera } from '../camera';
import { V, Vector2 } from '../utils/vector2';
import {Entity} from "../entity";

export interface SolidArea extends Entity {
    size: Vector2;
}

export interface TileLayerExt extends TiledLayerTilelayer {
    parallaxx: number;
    parallaxy: number;
    offsetx: number;
    offsety: number;
}

export class Tileset extends Resource {
    private image = new Image();

    constructor(public tilesetData: TiledTileset) {
        super();

        const { image: filename = '' } = this.tilesetData;
        const src = filename.split('/').pop();

        this.image.src = '/gfx/' + src;
        this.image.addEventListener('load', () => {
            this.trigger(ResourceEvents.LOADED, this);
        })
    }

    public drawTile(c: CanvasRenderingContext2D, index: number, x: number, y: number) {
        const { image, tilesetData } = this;
        const { tilewidth, tileheight, columns, firstgid } = tilesetData;
        const cIndex = index - firstgid;

        const tx = (cIndex % columns) * tilewidth;
        const ty = (cIndex / columns >> 0) * tileheight;

        c.drawImage(image, tx, ty, tilewidth, tileheight, x * tilewidth, y * tileheight, tilewidth, tileheight);
    }
}

export class Level extends Resource {
    static context: CanvasRenderingContext2D;
    static camera: Camera;
    static instance: Level = new Level();
    static Event = {
        RESET: 'level:reset',
    };

    private bakedLayers: HTMLCanvasElement[] = [];
    private tilesets: Tileset[] = [];
    private map!: TiledMap;
    private foregroundLayers: HTMLCanvasElement[] = [];
    private backgroundLayers: HTMLCanvasElement[] = [];
    private solidMask: boolean[] = [];
    private solidAreas: SolidArea[] = [];
    private canvasSize = [0, 0];

    public objects: TiledObject[] = [];

    public load(map: TiledMapOrthogonal) {
        this.map = map;
        this.reset();
        this.prepareTilesets()
            .then(() => {
                this.bakeLayers();
                this.sortLayers();
                this.generateSolidMask();
                this.prepareObjects();
                this.trigger(ResourceEvents.LOADED, this);
                console.log(this);
            });
    }

    public get backgroundColor() {
        if (!this.map) return "#000";

        return this.map.backgroundcolor || "#000";
    }

    public render(renderBetween: () => void) {
        const { context, camera } = Level;
        const { tileLayers, foregroundLayers, backgroundLayers } = this;
        const { position: cpos } = camera;

        const renderLayer = (canvas: HTMLCanvasElement) => {
            const index = +canvas.dataset.index!;
            const { name } = canvas.dataset;
            const data = tileLayers[index];

            if (name === '$') return;

            const { parallaxx = 1, parallaxy = 1 } = data;
            const { offsetx = 1, offsety = 1 } = data;

            const offset = V.fromArray([ offsetx, offsety ]);
            const parallax = V.update(V.fromArray([ parallaxx, parallaxy ]))
                .sub({ x: 1, y: 1 })
                .mul(-1)
                .done();


            const pos = V.update(V.mul2(cpos, parallax))
                .add(offset)
                .done();
            
            const blurPercent = Math.abs(1 - parallaxx);

            context.save();
            context.filter = `blur(${blurPercent * 4}px)`
            context.globalAlpha = data.opacity;
            context.drawImage(canvas, ...V.asArray(pos));
            context.restore();
        }

        backgroundLayers.forEach(renderLayer);
        renderBetween?.();
        foregroundLayers.forEach(renderLayer);
    }
    
    /**
     * @param by uses to ignore self while collsion checking
     */
    public checkSolid(x: number, y: number, by?: Entity) {
        const [ width ] = this.canvasSize;
        const cx = (x >> 0) - 1;
        const cy = (y >> 0) - 1;
        const index = cy * width + cx;

        const isAreaCollided = !!this.getSolidArea(x, y, by);
        const isMaskCollided = !!this.solidMask[index];

        return isMaskCollided || isAreaCollided;
    }

    public getSolidArea(x: number, y: number, by?: Entity) {
        return this.solidAreas
            .find(area => {
                if (by === area) return false;

                const { position, size } = area;
                const half = V.div(size, 2);

                return true 
                    && x > position.x - half.x && x < position.x + half.x
                    && y > position.y - half.y && y < position.y + half.y;
            });
    }

    public addSolidArea(area: SolidArea) {
        this.solidAreas.push(area);
    }

    public removeSolidArea(area: SolidArea) {
        this.solidAreas = this.solidAreas.filter(a => a !== area);
    }

    private prepareObjects() {
        const objectLayers = this.map.layers.filter(l => l.type === 'objectgroup') as TiledLayerObjectgroup[];
        const list = objectLayers.map(l => l.objects).flat();

        const fixObjectPosition = (o: TiledObject) => {
            if (o.gid) {
                o.y -= o.height;
            }
        }

        list.forEach(fixObjectPosition);

        this.objects = list;
    }

    private reset() {
        this.trigger(Level.Event.RESET);
        this.foregroundLayers = [];
        this.backgroundLayers = [];
        this.solidMask = [];
        this.solidAreas = [];
    }

    private generateSolidMask() {
        console.log(this);
        const allLayers = [...this.backgroundLayers, ...this.foregroundLayers];
        const solidLayer = allLayers.find(l => l.dataset.name === '$');

        if (!solidLayer) return;

        const c = solidLayer.getContext('2d')!;
        const { data } = c.getImageData(0, 0, c.canvas.width, c.canvas.height);
        const onlyRedComponent = (_: any, i: number) => i % 4 === 0;

        this.solidMask = Array
            .from(data)
            .filter(onlyRedComponent)
            .map(e => !!e);
    }

    private sortLayers() {
        const { tileLayers, bakedLayers } = this;

        this.foregroundLayers = tileLayers
            .map((d, i) => {

                return d.parallaxx > 1
                    ? bakedLayers[i]
                    : null
            })
            .filter(d => !!d) as HTMLCanvasElement[];

        this.backgroundLayers = tileLayers
            .map((d, i) => !d.parallaxx || d.parallaxx <= 1
                ? bakedLayers[i]
                : null)
            .filter(d => !!d) as HTMLCanvasElement[];
    }


    private get tileLayers(): TileLayerExt[] {
        return this.map.layers
            .filter(layer => layer.type === 'tilelayer') as TileLayerExt[];
    }

    private prepareTilesets() {
        return new Promise<void>((resolve) => {
            const inmapTilesets = this.map.tilesets.filter(d => !d.source);
            let tilesetsToLoad = inmapTilesets.length;

            const onTilesetLoad = () => {
                tilesetsToLoad -= 1;

                if (tilesetsToLoad < 1) {
                    resolve();
                }
            };
            
            const loadTileset = (data: TiledTileset) => {
                const tileset = new Tileset(data);
                tileset.once(ResourceEvents.LOADED, onTilesetLoad);
                
                return tileset;
            }

            this.tilesets = inmapTilesets
                .map(loadTileset);
        });
    }

    private getTilesetByTileIndex(tid: number) {
        return this.tilesets.find((t, i) => {
            const next = this.tilesets[i + 1];

            if (!next) {
                return tid >= t.tilesetData.firstgid;
            }

            return true 
                && tid >= t.tilesetData.firstgid
                && tid < next.tilesetData.firstgid;
        })
    }

    private getCoordByIndex(index: number) {
        const { width } = this.map;
        const x = index % width;
        const y = index / width >> 0;

        return [ x, y ] as [number, number];
    }

    private bakeLayers() {
        const { map } = this;
        const createCanvasByLayer = (layer: TiledLayer) => {
            const canvas = document.createElement('canvas');
            canvas.width = layer.width * map.tilewidth;
            canvas.height = layer.height * map.tileheight;
            this.canvasSize = [ canvas.width, canvas.height ];

            return canvas;
        }

        const bake = (canvas: HTMLCanvasElement, i: number) => {
            const layer = this.tileLayers[i];
            const c = canvas.getContext('2d')!;
            const data = layer.data as number[];
            c.canvas.dataset.index = String(i);
            c.canvas.dataset.name = layer.name;
            
            data.forEach((tid, index) => {
                const tileset = this.getTilesetByTileIndex(tid + 1);
                const coord = this.getCoordByIndex(index);

                if (!tileset) return;

                tileset.drawTile(c, tid, ...coord);
            })

            return canvas;
        }

        this.bakedLayers = this.tileLayers
            .map(createCanvasByLayer)
            .map(bake);
    }
};
