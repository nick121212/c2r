import {IGProxyCtx} from "../models/proxyctx";

// tslint:disable
export default () => {
  return async (ctx: IGProxyCtx<any, any>, next: (s?: string) => void) => {
    const {instance = {}, executeInfo = {}, globalData = {}} = ctx;
    const start = performance.now();

    console.group(`开始调用接口: ${instance.title} -- ${new Date()}`, {});
    console.info(
      '接口信息',
      instance.ns,
      '--',
      instance.key,
      '--',
      instance.title,
    );
    console.info('接口传递参数：', JSON.stringify(executeInfo.data || {}));
    console.info('公共参数', JSON.stringify(globalData));

    try {
      await next();
      // tslint:disable-next-line:no-empty
    } catch {}

    console.info('公共参数', JSON.stringify(ctx.globalData || globalData));

    if (!ctx.isError) {
      console.info('接口调用成功', JSON.stringify(ctx.result));
    } else {
      console.error('接口调用失败', ctx.err);
    }

    console.info(`接口耗时：${performance.now() - start}毫秒`);
    console.groupEnd();

    if (ctx.isError) {
      throw ctx.err;
    }
  };
};
