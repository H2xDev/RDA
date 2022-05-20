import { DefaultResourceManager } from "../../core/resourceManager";
import { Level } from "../../core/tiled/level";
import { ResourceEvents } from "../../core/types/fileManagerEvents.enum";
import { context as c } from "../engine";
import { SceneWithCamera } from "./sceneWithCamera";

import { MapList } from '../maps/index';
import {spawnEntities} from "../entities/level";
import { Entity } from "../../core/entity";
import { Player } from "../entities/level/player.entity";
import { V } from "../../core/utils/vector2";

const { instance: LevelManager } = Level;

export const Gameplay = new (
    class extends SceneWithCamera {
        public meta = {
            uiComponent: 'hud',
        }

        public currentMap = 'map1';
        public mapStates = {};

        constructor() {
            super();
            Level.camera = this.camera;
            LevelManager.on(Level.Event.RESET, () => {
                Entity.CallForAll(this.children, 'destroy');
            })
            this.loadMap();
        }

        public update() {
            if (DefaultResourceManager.isLoading) {
                c.fillStyle = "#fff";
                c.textBaseline = "middle";
                c.textAlign = "center";
                c.fillText("Loading...", 0, 0);
                return;
            }

            Level.instance.render(() => {
                super.update();
            });
        } 
        
        private spawnEntities() {
            spawnEntities(this);
        }

        public changeMap(targetMap: string, gateId: number) {
            this.mapStates[this.currentMap] = { ...this.children };
            this.currentMap = targetMap;

            this.loadMap()
                .once(ResourceEvents.LOADED, () => {
                    const gate = this.children[gateId];
                    if (!gate) return;

                    V.update(Player.current.position)
                        .set(gate.position);

                    this.camera.resetPosition();
                })
        }

        private loadMap() {
            LevelManager
                .load(MapList[this.currentMap])
                .once(ResourceEvents.LOADED, () => {
                    const mapState = this.mapStates[this.currentMap];

                    this.spawnEntities();

                    if (mapState) {
                        Object
                            .values(this.children)
                            .forEach((e) => {
                                if (!mapState[e.id]) {
                                    delete this.children[e.id];
                                }
                            })
                    }
                });

            return LevelManager;
        }
    }
);
