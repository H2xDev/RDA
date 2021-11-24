import Matter from "matter-js";
import {V} from "../../core/utils/vectorUtil";
import {context} from "../engine";
import {Actor} from "./actor";

const { PI, cos, sin } = Math;

export class Character extends Actor {
    protected isOnGround: boolean = false;

    protected rotateByBody = false;

    protected jumpSpeed: number = 5;

    public start() {
        super.start();
        this.body.friction = 1;
        Matter.Body.setMass(this.body, 1);
    }

    public move(speed: number) {
        if (!this.isOnGround) return;
        const tspeed = V.Add(
            this.body.velocity, {
                x: speed,
                y: 0,
            });
        Matter.Body
        .setVelocity(
            this.body,
            tspeed,
        );
    }

    public jump(speed: number = this.jumpSpeed) {
        if (!this.isOnGround) return;
        Matter.Body.setVelocity(this.body, V.Add(this.body.velocity, {
            x: 0,
            y: -speed,
        }));
    }

    private updateOnGroundState() {
        const { bodies } = this.scene.world;
        const { position, bounds } = this.body;
        const height = bounds.max.y - bounds.min.y; 
        const v1 = V.Add(position, {
            x: 0,
            y: height / 1.5,
        });

        const [, t] = Matter.Query.ray(bodies, position, v1);
        this.isOnGround = !!t;

        let targetAngle = 0;

        if (this.isOnGround) {
            targetAngle = (V.Ang(t.normal) - PI / 2) * 180 / PI;
        }
        
        this.sprite.angle -= (this.sprite.angle - targetAngle) / 10;
    }

    protected renderVertices() {
        context.beginPath();
        const { vertices: v, angle, bounds, position } = this.body;
        const height = bounds.max.y - bounds.min.y; 
        v.forEach((p, i) => {
            const m = !i ? 'moveTo' : 'lineTo';

            context[m](p.x, p.y);
        });

        context.lineTo(v[0].x, v[0].y);

        context.strokeStyle = "#0f0";
        context.stroke();

        context.beginPath();

        context.moveTo(this.body.position.x, this.body.position.y);
        const v1 = V.Add(position, {
            x: cos(angle) * height / 1.5,
            y: sin(angle) * height / 1.5,
        });

        context.lineTo(v1.x, v1.y);

        context.stroke();
    }

    private updateSpeed() {
        if (this.isOnGround) {
            const newVelocity = {
                x: this.body.velocity.x * 0.85,
                y: this.body.velocity.y,
            }
            Matter.Body.setVelocity(this.body, newVelocity)
        }
    }

    public update() {
        super.update();
        this.updateOnGroundState();
        this.updateSpeed();
        // this.renderVertices();
    }
}
