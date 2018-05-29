import { Cesium } from '../../../index';
import { BillboardMocks } from "./testCaseConfig";
import { AnimateType, defaultOptions } from "../config";
import { HighlightSelector } from "../highlightSelector";

export class Tester {

    constructor(cesium, view, entities, options) {
        this.view = view;
        this.cesium = cesium;
        this.options = options;
        this.entities = this._addEntityToEntitiesArr() || entities;
        this.animationTypes = defaultOptions.animationType;
        this.isOpacitySelected = true;
        this._initHighlight();
        this._addDropDownEventListener();
        this._addAnimationSelectEventListener();
        this._stopAnimationEventlisteners();
        this._addClickListener();
    }

    get imageUrl() {
        const imageUrl = 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-person-128.png';
        return imageUrl;
    }

    get animationTypes() {
        return this._animationTypes;
    }

    set animationTypes(animationTypes) {
        this._animationTypes = animationTypes;
    }

    get isOpacitySelected() {
        return this._isOpacitySelected;
    }

    set isOpacitySelected(isOpacitySelected) {
        this._isOpacitySelected = isOpacitySelected;
    }

    _initHighlight() {
        this.entities.forEach(entity => {
            this.view.entities.add(entity)
        });
        this._addHighlightPropToEntity(this.view);
    }

    _addHighlightPropToEntity(viewer) {
        // constraint until the project will be integrated in cesium
        viewer.entities.values.forEach(entity => {
            entity.addProperty('highlight');
            entity.highlight = new HighlightSelector();
        })
    }

    _addClickListener() {
        this.clickListener = function (click) {
            const pickedObject = this.view.scene.pick(click.position);
            if (this.cesium.defined(pickedObject) && (pickedObject.id)) {
                const animation = pickedObject.id.highlight;
                animation.setup(this.animationTypes, [], pickedObject.id);
                animation.start();
                setTimeout(() => animation.stop(), 5000)
            }
        }
        this.handler = new this.cesium.ScreenSpaceEventHandler(this.view.scene.canvas);
        this.handler.setInputAction(this.clickListener.bind(this), this.cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    _addEntityToEntitiesArr() {
        let entitiesMock = [];
        BillboardMocks.forEach(billboard => {
            let entityToPush = {
                filterArr: billboard.filtersArr,
                name: 'billboard',
                position: this.cesium.Cartesian3.fromDegrees(billboard.position.x, billboard.position.y),
                billboard: {
                    image: new Cesium.PinBuilder().fromUrl(this.imageUrl, this.cesium.Color.ROYALBLUE, 48),
                    verticalOrigin: this.cesium.VerticalOrigin.BOTTOM
                }
            };
            entitiesMock.push(entityToPush);
        })
        return entitiesMock;
    }

    _addDropDownEventListener() {
        let ddOccupation = document.getElementById('ddOccupation');
        let ddSex = document.getElementById('ddSex');
        let ddAge = document.getElementById('ddAge');
        let selected;
        ddOccupation.addEventListener('change', () => {
            selected = parseInt(ddOccupation.options[ddOccupation.selectedIndex].value);
            this.view.entities.values.forEach(entity => {
                entity.filterArr.forEach(catagory => {
                    if (catagory.occupationFilter != undefined && catagory.occupationFilter === selected) {
                        const animation = entity.highlight;
                        animation.setup(this.animationTypes, [], entity);
                        animation.start();
                        setTimeout(() => animation.stop(), 5000);
                    }
                    else if (this.isOpacitySelected) {
                        const animation = entity.highlight;
                        animation.setup([AnimateType.changeOpacity], [], entity);
                        animation.start();
                        setTimeout(() => animation.stop(), 5000);
                    }
                })
            })
        })
    }

    _modifyAnimationTypesArr(selectedType, add = true) {
        let arr = [];
        if (add) {
            let index = this.animationTypes.findIndex(type => type === selectedType);
            this.animationTypes.forEach(type => arr.push(type));
            if (index < 0)
                arr.push(selectedType);
        }
        else
            arr = this.animationTypes.filter(type => type !== selectedType);
        return arr;
    }

    _addAnimationSelectEventListener() {
        const btnShrinkGrow = document.getElementById('btnShrinkGrow');
        const btnFlicker = document.getElementById('btnFlicker');
        const btnOpacity = document.getElementById('btnOpacity');

        let isSelectedShrinkGrow = true;
        let isSelectedFlicker = true;
        let isSelectedOpacity = true;

        btnShrinkGrow.style.backgroundColor = "#99ADC6";
        btnFlicker.style.backgroundColor = "#99ADC6";
        btnOpacity.style.backgroundColor = "#99ADC6";

        btnShrinkGrow.addEventListener('click', () => {
            if (!isSelectedShrinkGrow) {
                isSelectedShrinkGrow = true;
                btnShrinkGrow.style.backgroundColor = "#99ADC6";
                this.view.entities.values.forEach(entity => {
                    this.animationTypes = this._modifyAnimationTypesArr(AnimateType.shrinkGrow, true);
                })
            }
            else {
                isSelectedShrinkGrow = false;
                btnShrinkGrow.style.backgroundColor = "";
                this.view.entities.values.map(entity => {
                    this.animationTypes = this._modifyAnimationTypesArr(AnimateType.shrinkGrow, false);
                })
            }
        })
        btnFlicker.addEventListener('click', () => {
            if (!isSelectedFlicker) {
                isSelectedFlicker = true;
                btnFlicker.style.backgroundColor = "#99ADC6";
                this.view.entities.values.forEach(entity => {
                    this.animationTypes = this._modifyAnimationTypesArr(AnimateType.flicker, true);
                })
            }
            else {
                isSelectedFlicker = false;
                btnFlicker.style.backgroundColor = "";
                this.view.entities.values.map(entity => {
                    this.animationTypes = this._modifyAnimationTypesArr(AnimateType.flicker, false);
                })
            }
        })
        btnOpacity.addEventListener('click', () => {
            if (!isSelectedOpacity) {
                isSelectedOpacity = true;
                btnOpacity.style.backgroundColor = "#99ADC6";
                this.isOpacitySelected = true;
            }
            else {
                isSelectedOpacity = false;
                btnOpacity.style.backgroundColor = "";
                this.isOpacitySelected = false;
            }
        })
    }

    _stopAnimationEventlisteners() {
        document.getElementById('stopAnimation').addEventListener('click', () => {
            this.entities.highlight.enlarge.stopCallback();
        })
    }
}


