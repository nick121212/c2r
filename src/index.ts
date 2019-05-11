import "reflect-metadata";
import fs from "fs";

import {container} from "./container";
import {RapSource} from "./sources/rap";
import {ModelProxy} from "modelproxy";
import {generate} from "./sources/generate";
import template from "art-template";
import {ModelProxyService} from "./mp/service";
import _ from "lodash";

const result = "functionConfig";

console.log(_.capitalize(result), _.camelCase(result), _.startCase(result).split(" "));

process.exit(1);

// import { ParameterList } from "./models/rap";

// (async () => {
//     await container.get(RapSource).analysis(111).then(async (d: any) => {
//         const api = await generate("Scloud", new ModelProxy().loadConfig(d))

//         fs.writeFileSync(`src/scloud/Scloud.d.ts`, api);
//         fs.writeFileSync(`src/scloud/Scloud.json`, JSON.stringify(d));
//         fs.writeFileSync(`src/scloud/Scloud.ts`, template(`${__dirname}/../temps/index.ts.art`, {
//             mpPath: "../mp/proxy",
//             key: "Scloud"
//         }));

//         console.log("done");
//     });
// })();

const proxy = container.get(ModelProxyService).proxy;

const params = new URLSearchParams();

params.append("businessCode", "10012");
params.append("fid", "100102011000304006");
params.append("channelType", "1");
params.append("originalId", "wx124e5980e6432836");
params.append("traceNo", "lsh000000001");
params.append("orderNo", "lsh000000001");
params.append("requestTime", Date.now().toString());
params.append("tradeDesc", "支付测试");
// params.append("tradeDetail", "");
params.append("tradeAmount", "0.1");
params.append("currency", "CNY");
params.append("notifyUrl", "参考支付结果通知接口");
params.append("tradeType", "0");
// params.append("riskInfo", "");
// params.append("couponType", "");
// params.append("couponAmount", "");
params.append("securedFlag", "0");
params.append("secondSplitFlag", "0");
// params.append("extParams", "");

let p: any = {};

params.forEach((v, k) => {
    p[k] = v;
})

console.log(JSON.stringify(p));

proxy.execute("pay", "soa", {
    instance: {
        method: "GET"
    },
    params: {
        applicationName: "test",
        serviceName: "com.weimob.wmpay.export.Adapter2BusinessService",
        methodName: "createTrade",
        parameterInput: JSON.stringify(p)
    }
}).then((data) => {
    return data.responseVo;
}).then((data) => {
    console.log(data.responseVo);
    // http://soa-proxy.dev.internal.weimob.com/soa-proxy?applicationName=test&serviceName=com.weimob.wmpay.export.Payment2PartnerService&methodName=pay&parameterInput=
    const payParams = new URLSearchParams();

    payParams.append("tradeId", data.paymentProducts[0].tradeId);
    payParams.append("payAmount", data.tradeAmount);
    payParams.append("productNo", data.paymentProducts[0].productNo);
    payParams.append("expireTime", "1440");
    payParams.append("appId", "wx124e5980e6432836");
    payParams.append("openId", "o4WA65Jx9BF5FMDKxhF9t04vpW7o");
    payParams.append("clientIp", "172.19.80.103");

    let p1: any = {};

    payParams.forEach((v, k) => {
        p1[k] = v;
    })

    console.log(JSON.stringify(p1))

    return proxy.execute("pay", "soa", {
        instance: {
            method: "GET"
        },
        params: {
            applicationName: "test",
            serviceName: "com.weimob.wmpay.export.Payment2PartnerService",
            methodName: "pay",
            parameterInput: JSON.stringify(p1)
        }
    })
}).then(console.log).catch(console.log);

