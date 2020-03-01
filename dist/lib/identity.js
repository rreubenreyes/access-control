"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const framework_1 = __importDefault(require("./framework"));
/**
 * @class AuthenticatableEntity
 *
 * An AuthenticatableIdentity, by definition, has an identity which can be authenticated. Instances of this
 * class must define their identities such that they may be resolved using an AccessControlFramework.
 */
class AuthenticatableEntity {
    constructor(framework) {
        if (!(framework instanceof framework_1.default)) {
            const msg = 'Invalid access control framework.'
                + 'Argument provided for `framework` is not an instance of AccessControlFramework.';
            console.error(msg);
            throw new Error(msg);
        }
        this._framework = framework;
    }
}
class Role extends AuthenticatableEntity {
    constructor({ framework, name, identity }) {
        super(framework);
        this._name = name;
        this._identity = identity;
        this._framework.registerRole(this);
    }
    get name() {
        return this._name;
    }
    get identity() {
        return this._identity;
    }
}
exports.Role = Role;
class Principal extends AuthenticatableEntity {
    constructor({ framework, props, strategy = 'default' }) {
        super(framework);
        this._identity = framework.defineIdentity({ strategy, props });
    }
    /**
     * Authenticate this princpal as the provided role by verifying that
     * the identity of this princpal is exactly the same as the identity of the role being evaluated.
     */
    is(role) {
        if (!(role instanceof Role))
            return false;
        return isEqual_1.default(role.identity, this._identity);
    }
    /**
     * Authenticate this principal as the provided role by comparing the identities of the two parties.
     */
    authenticate(role, assertion) {
        if (!(role instanceof Role))
            return false;
        return assertion({ role: role.identity, principal: this._identity });
    }
}
exports.Principal = Principal;
