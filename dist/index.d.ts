import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { ServiceToInject } from './interfaces/ServiceToInject.interface';
declare class DIContainerManager {
    private container;
    constructor();
    getContainer(): Container;
    registerServices(serviceArray: ServiceToInject[]): Container;
    registerCustomServices(registerationFunction: (DIContainer: Container) => any): any;
    private handleCustomObject;
    private isCustomObject;
    private isNamedBind;
    private bindToTag;
    private setServiceScope;
    resolveService<T>(service: interfaces.Newable<T>): T;
    getService<T>(service: interfaces.Newable<T>): T;
}
export declare let DIManager: DIContainerManager;
export {};
