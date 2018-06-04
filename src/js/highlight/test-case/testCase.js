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

    set singleHighlightPrimitve(singleHighlightPrimitve) {
        this._singleHighlightPrimitve = singleHighlightPrimitve;
    }

    get singleHighlightPrimitve() {
        return this._singleHighlightPrimitve;
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
                this.singleHighlightPrimitve = pickedObject.id.highlight;
                this.singleHighlightPrimitve.setup([AnimateType.IndicationEnlarge], {indicationOnly: true}, pickedObject.id);
                this.singleHighlightPrimitve.start();
            }
            else {
                const cartesian = this.view.scene.pickPosition(click.position);
                const entity = this.view.entities.add({
                    filterArr: [{occupationFilter: Math.floor(Math.random() * Math.ceil(5))}],
                    name: 'billboard',
                    position: cartesian,
                    billboard: {
                        scale: 0,
                        image: new Cesium.PinBuilder().fromUrl('images/user.svg', this.cesium.Color.ROYALBLUE, 60),
                        verticalOrigin: this.cesium.VerticalOrigin.BOTTOM
                    }
                })
                entity.addProperty('highlight');
                entity.highlight = new HighlightSelector();
                entity.highlight.setup([AnimateType.IndicationEnlarge], {indicationOnly: true}, entity);
                entity.highlight.start();
            }
        }
        this.handler = new this.cesium.ScreenSpaceEventHandler(this.view.scene.canvas);
        this.handler.setInputAction(this.clickListener.bind(this), this.cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    _addEntityToEntitiesArr() {
        let entitiesMock = [];
        BillboardMocks.forEach(billboard => {
            let entityToPush;
            if (billboard.pinBuilder) {
                entityToPush = {
                    filterArr: billboard.filtersArr,
                    name: 'billboard',
                    position: this.cesium.Cartesian3.fromDegrees(billboard.position.x, billboard.position.y),
                    billboard: {
                        image: new Cesium.PinBuilder().fromUrl('images/user.svg', this.cesium.Color.ROYALBLUE, 60),
                        verticalOrigin: this.cesium.VerticalOrigin.BOTTOM
                    }
                };
            }
            else {
                entityToPush = {
                    filterArr: billboard.filtersArr,
                    name: 'billboard',
                    position: this.cesium.Cartesian3.fromDegrees(billboard.position.x, billboard.position.y),
                    billboard: {
                        scale: 1.5,
                        image: 'images/man-user.svg',
                        verticalOrigin: this.cesium.VerticalOrigin.BOTTOM,
                        width: 25,
                        height: 25

                    }
                };
            }

            entitiesMock.push(entityToPush);
        })
        return entitiesMock;
    }

    _addDropDownEventListener() {
        let ddOccupation = document.getElementById('ddOccupation');
        let ddAge = document.getElementById('ddAge');
        let selected;
        ddOccupation.addEventListener('change', () => {
            selected = parseInt(ddOccupation.options[ddOccupation.selectedIndex].value);
            this.view.entities.values.forEach(entity => {
                entity.filterArr.forEach(catagory => {
                    if (catagory.occupationFilter != undefined && catagory.occupationFilter === selected) {
                        const animation = entity.highlight;

                        //option 1
                        // animation.setup(this.animationTypes, {indicationOnly: false}, entity);
                        //option 2
                        // animation.setup(this.animationTypes, {indicationOnly: false, duration: 5000}, entity);
                        //option 3
                        //if(entity.scale)
                        // if(entity.billboard.scale._value > 1){
                        //     animation.setup(this.animationTypes, {indicationOnly: false, interval: true, minScale: entity.billboard.scale._value}, entity);
                        // }
                        animation.setup(this.animationTypes, {indicationOnly: false, interval: false, scalePercent: 0.9}, entity);
                        animation.start();
                        // setTimeout(() => animation.stop(), 5000);
                    }
                })
            })
        })
    }

    _stopAnimationEventlisteners() {

        if (this.singleHighlightPrimitve) {
            this.singleHighlightPrimitve.stop();
            this.singleHighlightPrimitve = null;
        }
        else {
            document.getElementById('stopAnimation').addEventListener('click', () => {
                this.view.entities.values.forEach(entity => {
                    entity.highlight.stop();
                })
            })
        }
    }
}


