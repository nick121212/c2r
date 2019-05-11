import {IInterfaceModelCommon, IInterfaceModel} from "modelproxy/out/models/interface";
import {ModelProxy, BaseFactory} from "modelproxy";
import _ from "lodash";
import {compile} from "json-schema-to-typescript";

const getKey = (key: string) => {
    return _.startCase(key).split(" ").join("");
}


/**
 * 生成接口Map
 * @private
 * @param {IInterfaceModelCommon<any>} i
 * @returns
 * @memberof BaseSource
 */
export const generatePathObject = (inter: IInterfaceModelCommon<any>) => {
    const paths = (inter.path || "").split("/");
    const map: any = {};
    let curMap: any = map;

    for (let i = 0, n = paths.length; i < n; i++) {
        let p = paths[i];

        if (p) {
            curMap[p] = i === n - 1 ? {
                isFinal: true,
                inter,
                reqSchema: {
                    isSchema: true,
                    key: `${getKey(p)}Request`,
                    schema: inter.config.requestSchema || undefined
                },
                resSchema: {
                    isSchema: true,
                    key: `${getKey(p)}Response`,
                    schema: inter.config.responseSchema || undefined
                }
            } : {};
            curMap = curMap[p];
        }
    }

    return map;
};

/**
 * 把jsonschema文件生成为interface文件
 * @param {String} key     对应的key值
 * @param {Object} schema  jsonschema
 */
export const generateJSFile = async (key: string, schema: any) => {
    return await compile(schema, key, {}).catch((e: Error) => {
        console.log(e, `${key}Request`, JSON.stringify(schema));

        return "";
    });
};

/**
 * 生成d.ts文件代码
 * @param {String}    key 文件的key值
 * @param {any}       map 对象
 */
export const generateNameSpaceFile = async (key: string, map: any) => {
    let str: string[] = [];

    if (map.isFinal) {
        str.push(`export interface ${key} extends IInterfaceModel<${key}Response,${key}Request,any,any> {`);
    } else {
        str.push(`export namespace ${key} {`);
    }

    if (!map.isFinal) {
        for (const key1 in map) {
            if (map.hasOwnProperty(key1)) {
                const element = map[key1];

                // console.log("-----", key1);

                // if (key1.toLocaleLowerCase() === "functionconfig") {
                //     console.log("----------", _.capitalize(key1));
                // }

                str = str.concat(await generateNameSpaceFile(getKey(key1), element));
            }
        }
    }

    str.push(`}`);

    if (map.isFinal) {
        str.push(await generateJSFile(map.resSchema.key, map.resSchema.schema));
        str.push(await generateJSFile(map.reqSchema.key, map.reqSchema.schema));
    }

    return str;
};

/**
 * 
 * @param key 
 * @param map 
 * @example 
 * export interface API {
 *   Scloud: {
 *       Sale: {
 *           Product: {
 *               Poster: {
 *                   Build: Scloud.Sale.Product.Poster.Build;
 *               }
 *           }
 *       },
 *       Soms: {
 *           Lhb: {
 *               Buildposter: Scloud.Soms.Lhb.Buildposter;
 *           }
 *       }
 *   }
 * }
 */
export const generateInterfaceFile = async (keys: string[], map: any) => {
    let str: string[] = [];

    for (const key1 in map) {
        if (map.hasOwnProperty(key1)) {
            const element = map[key1];
            const key = _.startCase(key1).split(" ").join("")

            if (element.isFinal) {
                str.push(`
                    ${key}: ${[...keys, key].join(".")};
                `);
            } else {
                str.push(`
                    ${key}: {
                        ${(await generateInterfaceFile([...keys, key], element)).join("\n")}
                    },
                `);
            }
        }
    }

    return str;
};

/**
 * 生成接口Map
 * 1. 先生成namespace文件
 * 2. 再生成接口文件
 * @param {ModelProxy} proxy
 * @returns
 * @memberof BaseSource
 */
export const generate = async (key: string, proxy: ModelProxy) => {
    const map: any = {};

    proxy.forEach((key: string, f: BaseFactory<any>) => {
        f.forEach(async (key1: string, i: IInterfaceModelCommon<any>) => {
            _.merge(map, generatePathObject(i));
        });
    });

    return [`import { IInterfaceModel } from "modelproxy/out/models/interface";`,
        ...await generateNameSpaceFile(key, map),
        `export interface ${key}{`,
        ...await generateInterfaceFile([key], map),
        `}`,].join("\n");
};
