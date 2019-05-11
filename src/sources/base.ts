import {injectable, inject} from "inversify";
import {IInterfaceModelCommon} from "modelproxy/out/models/interface";
import {ModelProxy, BaseFactory} from "modelproxy";
import _ from "lodash";

import {ModelProxyService} from "../mp/service";
import {RapRef} from "../models/rap";
import {Translate} from "../utils/translate";

/**
 * 各种source的基类
 * @export
 * @class BaseSource
 */
@injectable()
export abstract class BaseSource {
    constructor(@inject(ModelProxyService) protected mpService: ModelProxyService, @inject(Translate) protected transService: Translate) {}

    public abstract download(url: string, projectId: number): Promise<RapRef.RapData>;
    public abstract analysis(url: string, projectId: number, mpConfig: any): any;
}
