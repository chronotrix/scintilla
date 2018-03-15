
import ObjectUtils from '../utils/objectutils'
import XHR from './XHR'
import {LOADER_STATE} from './loaderstate'

export default class File {

    constructor(config) {

        this.type = ObjectUtils.getValue(config, 'type', null);
        this.tag = ObjectUtils.getValue(config, 'tag', null);

        if (this.type == null || this.tag == null)
        {
            throw new Error('Loader.File: Invalid tag \"' + tag + "\".");
        }

        this.url = ObjectUtils.getValue(config, 'url', null);

        if (this.url === undefined)
            this.url = ObjectUtils.getValue(config, 'path', '') + this.tag + '.' + ObjectUtils.getValue(config, 'ext', '');
        else
            this.url = ObjectUtils.getValue(config, 'path', '').concat(this.url);

        this.xhrSettings = XHR.createSettings(ObjectUtils.getValue(config, 'responseType', undefined));
        
        if (ObjectUtils.getValue(config, 'xhrSettings', false))
            this.xhrSettings = XHR.merge(this.xhrSettings, ObjectUtils.getValue(config, 'xhrSettings', {}));

        
        //console.log(this.xhrSettings);

        this.loader = null;
        this.state = LOADER_STATE.PENDING;
        this.totalBytes = 0;
        this.loadedBytes = 0;
        this.progress = 0;
        this.data = undefined;
        this.source = null;
        this.xhrRequest = null;
        this.config = ObjectUtils.getValue(config,'config',{});
        this.crossOrigin = undefined;

        // callbacks
        //loaded: false,
        //error: false,
        //loading:false,

    }

    load(gameLoader)
    {
        this.loader = gameLoader;


        if (this.state === LOADER_STATE.FINISHED)
        {
            this.onDone();

            this.loader.nextFile(this);
        }
        else
        {
           

            this.source = ObjectUtils.getURL(this.url, gameLoader.baseURL);

            
            if (this.source.indexOf('data:') === 0 || this.source == null)
            {
                console.warn("Loader.File.load: unsupported URI.");
            }
            else
            {
                this.xhrRequest = XHR.createFileRequest(this, gameLoader.xhr);
            }
        }

    }

    onLoad(event)
    {
        this.XHRreset();

        if (event.target && event.target.status !== 200)
            this.loader.next(this, true);
        else
            this.loader.next(this, false);

    }

    onError()
    {
        this.XHRreset();

        this.loader.next(this, true);
    }

    onProgress(event)
    {
        if (event.lengthComputable)
        {
            this.loadedBytes = event.loaded;
            this.totalBytes = event.total;

            this.progress = Math.min((this.loadedBytes / this.totalBytes), 1);

            //this.loader.emit('fileprogress', this, this.progress);
        }
    }

    onDone()
    {
        this.state = LOADER_STATE.DONE;
    }

    onProcessing(processingCallback)
    {
        this.state = LOADER_STATE.PROCESSING;

        this.onDone();

        processingCallback(this);
    }


    XHRreset()
    {
        this.xhrRequest.onload = undefined;
        this.xhrRequest.onerror = undefined;
        this.xhrRequest.onprogress = undefined;
    }


}

