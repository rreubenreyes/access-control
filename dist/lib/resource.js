"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Resource {
    constructor({ framework, name, preflightAuthorizationStrategy }) {
        this._name = name;
        this._framework = framework;
        this._preflightAuthorizationStrategy = preflightAuthorizationStrategy;
        this._framework.registerResource(this);
    }
    get name() {
        return this._name;
    }
    authorizePreflight({ principal }) {
        return this._preflightAuthorizationStrategy({ principal });
    }
}
exports.Resource = Resource;
