import {IGProxyCtx} from "../models/proxyctx";

export default () => {
    return async (ctx: IGProxyCtx<any, any>, next: (s?: string) => void) => {
        const {executeInfo = {}, globalData = {}} = ctx;
        // const { pid, wid, corpId } = globalData;
        const {data = {}, settings = {}} = executeInfo;
        const version = process.env.REACT_APP_VERSION;

        if (!ctx.executeInfo) {
            ctx.executeInfo = {};
        }

        ctx.executeInfo.data = {
            pid: 0,
            version,
            ...data
        };

        ctx.executeInfo.settings = {
            ...settings,
            timeout: 15000
        };

        await next();
    };
};
