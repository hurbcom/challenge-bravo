import { Container } from "inversify";
import { ControllerContainer } from "./Controller";
import { RepositoryContainer } from "./Infra/Repository";
import { ServiceContainer } from "./Services";

const injectContainer = new Container();

injectContainer.load(RepositoryContainer);
injectContainer.load(ServiceContainer);
injectContainer.load(ControllerContainer);

export default injectContainer;
