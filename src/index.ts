import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { ServiceToInject } from './interfaces/ServiceToInject.interface';

/**
 * @description this class will later be modulized to be able to use it in
 * all our microservices
 */
class DIContainerManager {
    private container: Container;

    constructor() {
        this.container = new Container();
    }

    getContainer() {
        return this.container;
    }

    registerServices(serviceArray: ServiceToInject[]) {
        if (!Array.isArray(serviceArray))
            throw Error('Service array is empty');

        for (let serviceToInject of serviceArray) {
            // detect if this is a custom service
            // then apply the custom bindings
            if (this.isCustomObject(serviceToInject)) {
                this.handleCustomObject(serviceToInject);
                continue;
            }

            // basic binding
            this.container.bind(<any>serviceToInject).toSelf().inSingletonScope();
        }

        return this.container;
    }

    /**
     * @description this function allows us to make custom bindings if the registerServices does not support it yet
     * all using happen inside a function
     * @param registerationFunction 
     */
    registerCustomServices(registerationFunction: (DIContainer: Container) => any) {
        return registerationFunction(this.container);
    }

    private handleCustomObject(serviceToInject: ServiceToInject) {
        let bindResult = null;
        if (this.isNamedBind(serviceToInject))
            bindResult = this.bindToTag(serviceToInject.tag).to(serviceToInject.service);

        this.setServiceScope(
            serviceToInject,
            bindResult || this.container.bind(serviceToInject.service).toSelf()
        );
    }

    private isCustomObject(serviceToInject: ServiceToInject) {
        if (serviceToInject.service && serviceToInject.scopeType)
            return true;

        return false;
    }

    private isNamedBind(serviceToInject: ServiceToInject) {
        if (serviceToInject.tag)
            return true;

        return false;
    }

    private bindToTag(tag: string) {
        return this.container.bind(tag);
    }

    /**
     * @description set the service scope according to the type property
     * @param serviceToInject 
     * @param afterBindToSelf 
     */
    private setServiceScope(serviceToInject: ServiceToInject, afterBindToSelf: interfaces.BindingInWhenOnSyntax<any>) {
        if (!serviceToInject.scopeType)
            return serviceToInject;

        if (serviceToInject.scopeType === 'request')
            afterBindToSelf.inRequestScope();

        if (serviceToInject.scopeType === 'transient')
            afterBindToSelf.inTransientScope();

        if (serviceToInject.scopeType === 'singleton')
            afterBindToSelf.inSingletonScope();
    }

    resolveService<T>(service: interfaces.Newable<T>): T {
        return this.container.resolve<T>(service);
    }

    getService<T>(service: interfaces.Newable<T>): T {
        return this.container.get<T>(service);
    }
}

export let DIManager = new DIContainerManager();

// exmaple of how to use custom service registeration
DIManager.registerCustomServices((container: Container) => {
    // example of binding to a named service
    // container.bind('testMe').to(ServiceConsumer).inSingletonScope();
});

// registering services
DIManager.registerServices([
    // example of how to change service scope
    // { service: TestService, scopeType: 'transient' },

    // example of making named service using the easy way in objects
    // { service: ServiceConsumer, tag: 'testMe', scopeType: 'singleton' },
]);