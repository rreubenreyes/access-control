"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identity_1 = require("./identity");
const resource_1 = require("./resource");
/**
 * @class AccessControlFramework
 *
 * Describes an access control framework.
 *
 * The AccessControlFramework class is used to define ways to identify actors who may participate
 * in your application's logic. When you later define roles for your application,
 * the methods you provide in this class constructor are used to identify actors as belonging
 * to those roles.
 */
class AccessControlFramework {
    constructor(opts) {
        const { identityDefinitionStrategies } = opts;
        this._resources = {};
        this._roles = {};
        this._identityDefinitions = identityDefinitionStrategies;
    }
    defineIdentity({ strategy = 'default', props }) {
        const identityResolver = this._identityDefinitions[strategy];
        if (!identityResolver) {
            console.warn(`Warning: "${strategy}" is not a valid identity strategy. AuthenticatableEntity has not been identified.`);
            return {
                traits: {}
            };
        }
        return this._identityDefinitions[strategy](props);
    }
    registerRole(role) {
        if (!(role instanceof identity_1.Role)) {
            const msg = 'Cannot use registerRole with an entity that is not an instance of Role.';
            console.error(msg);
            throw new Error(msg);
        }
        if (this._roles[role.name]) {
            const msg = `Role with name "${role.name}" is already registered to this framework.`;
            console.error(msg);
            throw new Error(msg);
        }
        this._roles[role.name] = role;
    }
    registerResource(resource) {
        if (!(resource instanceof resource_1.Resource)) {
            const msg = 'Cannot use registerResource with an entity that is not an instance of Resource.';
            console.error(msg);
            throw new Error(msg);
        }
        if (this._resources[resource.name]) {
            const msg = `Resource with name "${resource.name}" is already registered to this framework.`;
            console.error(msg);
            throw new Error(msg);
        }
        this._resources[resource.name] = resource;
    }
    getRole(role) {
        return this._roles[role] || null;
    }
    getResource(resource) {
        return this._resources[resource] || null;
    }
}
exports.default = AccessControlFramework;
