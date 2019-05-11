import {cacheDec} from "modelproxy";
import {IProxyCtx} from "modelproxy/out/models/proxyctx";

export default () => {
    return async (ctx: IProxyCtx<any, any>, next: (s?: string) => void) => {
        const {instance = {}, result = {}} = ctx;
        const {status, ok, statusText, url} = result;

        if (!ok || status !== 200) {
            throw new Error(statusText + "-" + url);
        }

        const jsonFunc = async () => {
            // return new Promise((resolve: () => void, reject: () => void) => {
            //     result.json().then(resolve).catch(reject);
            // });

            return Promise.resolve(await result.json());
        };

        ctx.result = await cacheDec(jsonFunc, url || instance.key, ctx.settings)();

        await next();
    };
};
