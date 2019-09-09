"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var inversify_1 = require("inversify");
var DIContainerManager = (function () {
    function DIContainerManager() {
        this.container = new inversify_1.Container();
    }
    DIContainerManager.prototype.getContainer = function () {
        return this.container;
    };
    DIContainerManager.prototype.registerServices = function (serviceArray) {
        if (!Array.isArray(serviceArray))
            throw Error('Service array is empty');
        for (var _i = 0, serviceArray_1 = serviceArray; _i < serviceArray_1.length; _i++) {
            var serviceToInject = serviceArray_1[_i];
            if (this.isCustomObject(serviceToInject)) {
                this.handleCustomObject(serviceToInject);
                continue;
            }
            this.container.bind(serviceToInject).toSelf().inSingletonScope();
        }
        return this.container;
    };
    DIContainerManager.prototype.registerCustomServices = function (registerationFunction) {
        return registerationFunction(this.container);
    };
    DIContainerManager.prototype.handleCustomObject = function (serviceToInject) {
        var bindResult = null;
        if (this.isNamedBind(serviceToInject))
            bindResult = this.bindToTag(serviceToInject.tag).to(serviceToInject.service);
        this.setServiceScope(serviceToInject, bindResult || this.container.bind(serviceToInject.service).toSelf());
    };
    DIContainerManager.prototype.isCustomObject = function (serviceToInject) {
        if (serviceToInject.service && serviceToInject.scopeType)
            return true;
        return false;
    };
    DIContainerManager.prototype.isNamedBind = function (serviceToInject) {
        if (serviceToInject.tag)
            return true;
        return false;
    };
    DIContainerManager.prototype.bindToTag = function (tag) {
        return this.container.bind(tag);
    };
    DIContainerManager.prototype.setServiceScope = function (serviceToInject, afterBindToSelf) {
        if (!serviceToInject.scopeType)
            return serviceToInject;
        if (serviceToInject.scopeType === 'request')
            afterBindToSelf.inRequestScope();
        if (serviceToInject.scopeType === 'transient')
            afterBindToSelf.inTransientScope();
        if (serviceToInject.scopeType === 'singleton')
            afterBindToSelf.inSingletonScope();
    };
    DIContainerManager.prototype.resolveService = function (service) {
        return this.container.resolve(service);
    };
    DIContainerManager.prototype.getService = function (service) {
        return this.container.get(service);
    };
    return DIContainerManager;
}());
exports.DIManager = new DIContainerManager();
exports.DIManager.registerCustomServices(function (container) {
});
exports.DIManager.registerServices([]);
//# sourceMappingURL=index.js.map