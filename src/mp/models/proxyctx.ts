import {IProxyCtx} from "modelproxy/out/models/proxyctx";

export interface IGProxyCtx<D, P> extends IProxyCtx<D, P> {
    globalData: any;
}
