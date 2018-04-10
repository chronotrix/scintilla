import ObjectGet from "../../utils/object/ObjectGet";
import Environment from '../../system/PlatformEnvironment';

// based on phaser - https://github.com/photonstorm/phaser/blob/src/loader/filetypes/AudioFile.js
export default function FindAudioURLPath(urls)
{
    if (urls.constructor !== Array)
        urls = [urls];

    for (var i = 0; i < urls.length; i++)
    {
        var url = ObjectGet.value(urls[i], 'uri', urls[i]);

        if (url.indexOf('blob:') === 0 || url.indexOf('data:') === 0)
        {
            return url;
        }

        var type = url.match(/\.([a-zA-Z0-9]+)($|\?)/);
        type = ObjectGet.value(urls[i], 'type', type ? type[1] : '').toLowerCase();

        if (Environment.audioFormats[type])
        {
            return {
                uri: url,
                type: type
            };
        }
    }

    return null;
}