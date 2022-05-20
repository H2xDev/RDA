import { Level } from "../../../core/tiled/level";
import { ResourceEvents } from "../../../core/types/fileManagerEvents.enum";
import { V } from "../../../core/utils/vector2";
import { MapList } from "../../maps";
import { Gameplay } from "../../scenes/gameplay";
import { SceneWithCamera } from "../../scenes/sceneWithCamera";
import { FadeService } from "../../services/fade.service";
import { state } from "../../state";
import { Interactable } from "../interactable";

interface GateProps {
    to: string;
    gate: string;
}

export class Gate extends Interactable {
    constructor(private props: GateProps) {
        super();
        this.debugColor = "#67f";
        this.useGravity = false;
        this.useCollision = false;
    }
    
    protected onInteract() {
        const nextLevel = () => Gameplay
            .changeMap(this.props.to, +this.props.gate);

        FadeService.fade().then(nextLevel);
    }
}
