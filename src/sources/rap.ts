import {injectable} from "inversify";
import {IInterfaceModelCommon} from "modelproxy/out/models/interface";
import {IProxyConfig} from "modelproxy/out/models/proxy.config";

import {BaseSource} from "./base";
import {RapRef} from "../models/rap";
import {createJsonSchema} from "./schema";

const requestType: {[key: string]: string} = {
    "1": "GET",
    "2": "POST"
};

@injectable()
export class RapSource extends BaseSource {
    /**
     * 解析module数据
     * @private
     * @param {string} version
     * @param {RapRef.EList[]} moduleList
     * @returns {Array<IInterfaceModelCommon<any>>}
     * @memberof RapSource
     */
    private moduleAnalysis(version: string, moduleList: RapRef.EList[]): Array<IInterfaceModelCommon<any>> {
        const interfaces: Array<IInterfaceModelCommon<any>> = [];

        moduleList.forEach((m: RapRef.EList) => {
            interfaces.push(...this.pageAnalysis(version, m.pageList || []));
        });

        return interfaces;
    }

    /**
     * 解析page数据
     * @private
     * @param {string} version
     * @param {RapRef.EList[]} pageList
     * @returns {Array<IInterfaceModelCommon<any>>}
     * @memberof RapSource
     */
    private pageAnalysis(version: string, pageList: RapRef.EList[]): Array<IInterfaceModelCommon<any>> {
        const actions: Array<IInterfaceModelCommon<any>> = [];

        pageList.forEach((p: RapRef.EList) => {
            actions.push(...this.actionAnalysis(version, p.actionList || []));
        });

        return actions;
    }

    /**
     * 解析action数据
     * @private
     * @param {string} version
     * @param {RapRef.ActionList[]} actionList
     * @returns {Array<IInterfaceModelCommon<any>>}
     * @memberof RapSource
     */
    private actionAnalysis(version: string, actionList: RapRef.ActionList[]): Array<IInterfaceModelCommon<any>> {
        const actions: Array<IInterfaceModelCommon<any>> = [];

        actionList.forEach((action: RapRef.ActionList) => {
            if (action.requestUrl) {
                actions.push({
                    key: action.requestUrl.split("/").join(""),
                    title: action.name,
                    desc: action.description,
                    path: action.requestUrl,
                    version,
                    method: requestType[action.requestType || "1"],
                    config: {
                        requestSchema: createJsonSchema(action.requestParameterList || [], `${action.name}入参`),
                        responseSchema: createJsonSchema(action.responseParameterList || [], `${action.name}出参`)
                    }
                });
            }
        });

        return actions;
    }

    /**
     * 下载rap数据
     * @param {number} projectId
     * @returns {Promise<RapRef.RapData>}
     * @memberof RapSource
     */
    public download(rapUrl: string, projectId: number): Promise<RapRef.RapData> {
        return this.mpService.proxy.execute("rap", "queryRAPModel", {
            instance: {
                states: {
                    prd: rapUrl
                }
            },
            params: {
                projectId
            }
        });
    }

    /**
     * 分析rap下载下来的数据
     * @param {number} projectId
     * @returns {(Promise<IProxyConfig | null>)}
     * @memberof RapSource
     */
    public async analysis(rapUrl: string, projectId: number, mpConfig: any): Promise<IProxyConfig | null> {
        const res = await this.download(rapUrl, projectId);

        if (!res.modelJSON || !res.modelJSON.moduleList) {
            return null;
        }

        const version = res.modelJSON.version || "1.0.0";
        const interfaces = this.moduleAnalysis(version, res.modelJSON.moduleList);

        return {
            key: await this.transService.translateAsync(res.modelJSON.name || ""),
            interfaces,
            title: res.modelJSON.name,
            desc: res.modelJSON.introduction,
            engine: "fetch",
            // states: {
            //     test: "//m-scloud.weimobqa.com"
            // },
            // state: "test",
            version,
            ...mpConfig
        };
    }
}
