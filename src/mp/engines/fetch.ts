import {FetchEngine} from "modelproxy-engine-fetch";
import {IExecute} from "modelproxy/out/models/execute";
import {IInterfaceModel} from "modelproxy/out/models/interface";

import cusErrorM from "../middlewares/cuserror";
import globalM from "../middlewares/global";
import httpErrorM from "../middlewares/httperror";
import jsonAta from "../middlewares/jsonata";
import {IGProxyCtx} from "../models/proxyctx";
import chalk from "chalk";

/**
 * 默认的fetch引擎逻辑
 * log
 * 全局参数设置
 * 接口调用
 * http错误
 * 服务端错误
 */
export default () => {
    const engine: FetchEngine<IGProxyCtx<any, any>> = new FetchEngine<IGProxyCtx<any, any>>();

    // 这里处理下这个问题
    engine.proxy = (instance: IInterfaceModel<any, any, any, any>, executeInfo: IExecute<any, any>, ...otherOptions: any[]) => {
        return engine.doProxy(instance, executeInfo, ...otherOptions).then((res: IGProxyCtx<any, any>) => {
            return res.result;
        });
    };
    // 加入log
    // engine.use(logM());
    // 加入全局参数 pid，wid
    // engine.use(globalM());

    engine.use(async (ctx: IGProxyCtx<any, any>, next: () => void) => {
        if (ctx.instance) {
            const {title, path, method, state, states = {}} = ctx.instance;

            console.log(chalk.cyanBright(`开始调用接口： ${method} ${title} ${states[state || ""]} ${path}`));
        }
        await next();
    });


    // fetch接口引擎初始化
    engine.use(engine.fetch.bind(engine));
    // 如果有http错误，则抛出错误
    engine.use(httpErrorM());
    // 如果有服务器端约定错误，测抛出错误
    // engine.use(cusErrorM());
    // 返回数据处理
    engine.use(jsonAta());

    return engine;
};
