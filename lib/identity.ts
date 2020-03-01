/* eslint-disable @typescript-eslint/no-explicit-any */
import isEqual from 'lodash/isEqual';

import AccessControlFramework from './framework';

export interface Identity {
    traits: any;
}

interface StaticRolePredicate {
    ({ role, principal }: { role: Identity; principal: Identity }): boolean;
}

/**
 * @class AuthenticatableEntity
 *
 * An AuthenticatableIdentity, by definition, has an identity which can be authenticated. Instances of this
 * class must define their identities such that they may be resolved using an AccessControlFramework.
 */
abstract class AuthenticatableEntity {
    protected _framework: AccessControlFramework;
    protected abstract _identity: Identity;

    constructor(framework: AccessControlFramework) {
        if (!(framework instanceof AccessControlFramework)) {
            const msg = 'Invalid access control framework.' 
                + 'Argument provided for `framework` is not an instance of AccessControlFramework.'

            console.error(msg);

            throw new Error(msg);
        }

        this._framework = framework;
    }

    public get identity(): any {
        return this._identity;
    }
}

export class Role extends AuthenticatableEntity {
    private _name: string;
    protected _identity: Identity;

    constructor({ framework, name, identity }: { 
        framework: AccessControlFramework; 
        name: string; 
        identity: Identity;
    }) {
        super(framework);

        this._name = name;
        this._identity = identity;

        this._framework.registerRole(this);
    }

    public get name(): string {
        return this._name;
    }
}

export class Principal extends AuthenticatableEntity {
    protected _identity: Identity;

    constructor({ framework, props, strategy = 'default' }: { 
        framework: AccessControlFramework; 
        props: any; 
        strategy: string;
    }) {
        super(framework);

        this._identity = framework.defineIdentity({ strategy, props });
    }

    /**
     * Authenticate this princpal as the provided role by verifying that 
     * the identity of this princpal is exactly the same as the identity of the role being evaluated.
     */
    public is(role: Role): boolean {
        if (!(role instanceof Role)) return false;

        return isEqual(role.identity, this.identity);
    }

    /**
     * Authenticate this principal as the provided role by comparing the identities of the two parties.
     */
    public authenticate(role: Role, assertion: StaticRolePredicate): boolean {
        if (!(role instanceof Role)) return false;

        return assertion({ role: role.identity, principal: this.identity });
    }
}

