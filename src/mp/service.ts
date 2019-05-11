import { ModelProxy } from "modelproxy";
import { injectable } from "inversify";

import { proxy } from "./proxy";

@injectable()
export class ModelProxyService {
    public proxy: ModelProxy = proxy;
}
