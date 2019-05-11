import jsonata from "jsonata";

export default () => {
    /**
     * 解析JSON数据
     * 先处理空格和回车符号
     * @class JParseFunc
     */
    class JParseFunc {
        /**
         * 添加一个方法jparse
         * @static
         * @param {jsonata.Expression} exp
         * @memberof JParseFunc
         */
        public static init(exp: jsonata.Expression) {
            exp.assign("jparse", this.combine);
        }

        private static combine(str: string) {
            if (str.constructor !== String) {
                throw new Error("第一个参数有问题");
            }

            return JSON.parse(str.replace(/\\'/g, `'`));
        }
    }

    return async (ctx: any, next: () => void) => {
        const { config } = ctx.instance;
        const { jsonata: jd = "" } = config || {};

        // 如果存在jsonata数据，则处理
        if (jd) {
            const result = jsonata(jd);

            JParseFunc.init(result);

            ctx.result = result.evaluate(ctx.result);
        }

        await next();
    };
};
