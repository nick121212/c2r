import { WMError } from "../errors/mperr";
import { IGProxyCtx } from "../models/proxyctx";

export default () => {
    return async (ctx: IGProxyCtx<any,any>, next: (s?: string) => void) => {
        const code = ctx.result.errcode;

        // 这里抛出异常
        if (code !== undefined && code !== 0) {
            throw new WMError(ctx.result.errmsg, code, { ...ctx.instance, ...ctx.executeInfo });
        }

        ctx.result = ctx.result.data;

        await next();
    };
};
