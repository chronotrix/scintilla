import DataList from "../structures/List";
import GameSystemManager from "../core/GameSystemManager";
import UpdateTransform from '../modules/core/UpdateTransform'
import UpdateModules from '../modules/core/UpdateModules'
import Matrix from '../math/Matrix'

export default class EntityUpdateList {

    constructor(game)
    {
        this.game = game;
        this._instances = null;
        this._destroyInstances = null;
        this._pendingInstances = null;
        this._camera = null;
    }

    get length() {return this._instances.size;}

    init()
    {
        this._instances = new DataList();
        this._destroyInstances = new DataList();
        this._pendingInstances = new DataList();
        this._camera = this.game.system.camera;
    }

    add(instance) {
        if (this._instances.indexOf(instance) === -1 && this._pendingInstances.indexOf(instance) === -1)
        {
            this._pendingInstances.push(instance);
        }

        return instance;
    }

    remove(instance) {

    }

    update(dt) {

        

        this._instances.each(element => {
            
            if (element.active)
            {
                
                UpdateTransform(element.transform, this._camera.transform);

                UpdateModules(element.modules, this.game);

                if (element.transform._isDirty)
                    element.transform._isDirty = false;

                if (element.update !== undefined)
                    element.update(dt);

            }

            
        });
    }

    lateUpdate()
    {
        let removeSize = this._destroyInstances.size;
        let insertSize = this._pendingInstances.size;
        
        if (insertSize === 0 && removeSize === 0)
            return;


        if (removeSize > 0)
            this._instances.eraseList(this._destroyInstances, removeSize);

        
        /*this._pendingInstances.each(instance => {

            this.initializeModules(instance);

            this._instances.push(instance);
        })

        this._pendingInstances.clear();*/

        this._instances.concat(this._pendingInstances, true);

        this._pendingInstances.childs.length = 0;
        this._destroyInstances.childs.length = 0;

    }

}

GameSystemManager.register('EntityUpdateList', EntityUpdateList, 'entityList');
