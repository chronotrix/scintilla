import ObjectUtils from "../../utils/ObjectUtils";
import DataList from "../../structures/List";

export default class TilemapMetadata {

    constructor(config) {

        this.name = ObjectUtils.getValue(config,'name','tilemap');
        this.width =  ObjectUtils.getValue(config,'width',0);
        this.height =  ObjectUtils.getValue(config,'height',0);
        this.tileWidth =  ObjectUtils.getValue(config,'tileWidth',0);
        this.tileHeight =  ObjectUtils.getValue(config,'tileHeight',0);
        this.widthPixels = ObjectUtils.getValue(config,'pixelsWidth',this.width * this.tileWidth);
        this.heightPixels = ObjectUtils.getValue(config,'pixelsHeight',this.height * this.tileHeight);
        this.orientation = ObjectUtils.getValue(config, 'orientation', 'orthogonal');
    }


}