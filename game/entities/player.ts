import Matter from "matter-js";
import Sprite from "../../core/sprite";
import {V} from "../../core/utils/vectorUtil";
import {Actor} from "./actor";

const PLAYER_SPRITELIST = {
    default: new Sprite('box.jpg', {
        frameSize: [256, 256], 
        offset: [128, 128],
        scale: [0.125, 0.125],
    })
}

export class Player extends Actor {
    constructor() {
        super(
            Matter.Bodies.rectangle(0, 0, 32, 32),
            PLAYER_SPRITELIST,
        );

        Matter.Body.setPosition(this.collider, V.Add({...this.position}, { x: 200, y: 0 }));
        console.log(this.spriteList, this.sprite);
    }

    start() {
        this.sprite.scale = [0.125, 0.125];
    }

    update() {
        super.update();

        console.log(this.collider.position);
    }   
}
