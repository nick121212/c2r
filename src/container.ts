import {Container, injectable, decorate} from "inversify";
import {Compose, ModelProxy, BaseEngine, BaseFactory} from "modelproxy";

import {ModelProxyService} from "./mp/service";
import {RapSource} from "./sources/rap";
import {Translate} from "./utils/translate";
import {BaseSource} from "./sources/base";

const container: Container = new Container({
    autoBindInjectable: true,
    skipBaseClassChecks: true
});

decorate(injectable(), Compose);
decorate(injectable(), ModelProxy);
decorate(injectable(), BaseEngine);
decorate(injectable(), BaseFactory);

container.bind(ModelProxyService).toConstantValue(new ModelProxyService());
container.bind<BaseSource>("RAP").to(RapSource);
container.bind(Translate).toConstantValue(new Translate());

export {container};
