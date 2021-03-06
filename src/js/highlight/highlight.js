import { defaultOptions } from "./config";
import { Cesium } from "../../index";


export class Highlight {

    constructor(enitity, options) {
        this.pickedLabel = {};
        this.entity = enitity || {};
        this.options = options;
        this.setDefinedPrimitivesInEntity();
    }

    get options() {
        return this._options
    }

    set options(options) {
        this._options = Object.assign({}, defaultOptions, options);
    }

    startAnimation() {
        // return new Promise((resolve, reject) => {
        //     for (let primtiveShapeKey in this.pickedLabel) {
        //         this.primtiveShapeKey = primtiveShapeKey;
        //         this.setPrimitiveProp();
        //     }
        //     // resolve(this.stopCallback.bind(this));
        // })

        for (let primtiveShapeKey in this.pickedLabel) {
            this.primtiveShapeKey = primtiveShapeKey;
            this.setPrimitiveProp();
        }
    }

    setPrimitiveProp(primtiveShapeKey) {
        console.log("need to override")
    }

    endAnimation() {
        console.log("need to override")
    }

    stopCallback() {
        console.log("need to override")
        // for (let key in this.pickedLabel) {
        //     let primitive = this.pickedLabel[key];
        //     primitive[Types[key].field] = 1;
        // }
    }

    setDefinedPrimitivesInEntity() {
        if (Cesium.defined(this.entity.polyline))
            this.pickedLabel.polyline = this.entity.polyline;
        if (Cesium.defined(this.entity.label))
            this.pickedLabel.label = this.entity.label;
        if (Cesium.defined(this.entity.billboard))
            this.pickedLabel.billboard = this.entity.billboard;
    };
}
