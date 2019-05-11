import {ModelProxy} from "modelproxy";

import rapApi from "./apis/rap";
import defaultEngine from "./engines/fetch";

const proxy = new ModelProxy();

// 载入接口配置
proxy.loadConfig(rapApi);
// 加入引擎们
proxy.addEngines({
    fetch: defaultEngine()
});

export {proxy};
