import { Flicker } from "./animations/flicker";
import { Enlarge } from "./animations/enlarge";
import { AnimateType, Types } from "./config";
import { ChangeOpacity } from "./animations/changeOpacity";
import { Jump } from "./animations/jump";
import { Cesium } from "../../index";

export class HighlightSelector {
    //optionsOFALL....


    constructor(animationArr, options) {
        this.options = options;
        this.pickedPrimitve = {};
        // this.setup(animationArr, options)
    }

    get inervalId() {
        return this._intervalId;
    }
    set inervalId(intervalId) {
        this._intervalId = intervalId;
    }

    get scale() {
        return this._scale;
    }

    set scale(scale) {
        this._scale = scale;
    }

    get primitiveConfig() {
        return this._primitiveConfig;
    }

    set primitiveConfig(primitiveConfig) {
        this._primitiveConfig = primitiveConfig;
    }

    get options() {
        return this._options;
    }

    set options(options) {
        this._options = options;
    }

    set selectedEntity(entity) {
        this._selectedEntity = entity;
    }

    get selectedEntity() {
        return this._selectedEntity;
    }

    set animations(animations) {
        this._animations = animations;
    }

    get animations(){
        return this._animations;
    }

    setup(animationArr, options, entity) {

        this.selectedEntity = entity;
        let helperArr = [];
        if (animationArr) {
            animationArr.forEach(animation => {
                switch (animation) {
                    case AnimateType.shrinkGrow:
                        helperArr.push(new Enlarge(this.selectedEntity));
                        break;
                    case AnimateType.flicker:
                        helperArr.push(new Flicker(this.selectedEntity));
                        break;
                    case AnimateType.changeOpacity:
                        helperArr.push(new ChangeOpacity(this.selectedEntity));
                        break;
                    case AnimateType.jump:
                        helperArr.push(new Jump(this.selectedEntity));
                        break;
                    default:
                        helperArr.push(new Enlarge(this.selectedEntity));
                }
            })
            this.animations = helperArr;
            this.setDefinedPrimitivesInEntity(this.selectedEntity);
            for (let primtiveShapeKey in this.pickedPrimitve) {
                this.setPrimitiveProp(primtiveShapeKey)
            }
        }
    }

    start() {
        if(this.inervalId)
            this.stop();
        this.inervalId = window.setInterval(() => {
            this.animations.forEach(animation => animation.startAnimation())
        }, this.primitiveConfig.timeoutInterval);
        if (!this.primitiveConfig.interval) {
            window.setTimeout(() => window.clearInterval(this.inervalId), this.primitiveConfig.duration);
        }
    }

    stop() {
        window.clearInterval(this.inervalId);
        console.log('here');
        if(this.animations)
            this.animations.forEach(animation => animation.stopCallback());
    }

    setDefinedPrimitivesInEntity(selectedEntity) {
        if (Cesium.defined(selectedEntity.polyline))
            this.pickedPrimitve.polyline = selectedEntity.polyline;
        if (Cesium.defined(selectedEntity.label))
            this.pickedPrimitve.label = selectedEntity.label;
        if (Cesium.defined(selectedEntity.billboard))
            this.pickedPrimitve.billboard = selectedEntity.billboard;
    };

    setPrimitiveProp(primtiveShapeKey) {
        this.scale = Types[primtiveShapeKey].minScale;
        this.primitiveConfig = Types[primtiveShapeKey];
    }

// {
//     filterArray: entity.filterArr,
//     enlarge : new Enlarge(entity),
//     changeColor: new ChangeColor(entity)
// }
}
