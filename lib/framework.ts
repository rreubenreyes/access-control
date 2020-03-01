/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Identity } from './identity';
import { Role } from './identity';
import { Resource } from './resource';

interface IdentityResolver {
    (props: any): Identity;
}

interface FrameworkOptions {
    identityDefinitionStrategies: {
        [index: string]: IdentityResolver;
        default: IdentityResolver;
    };
}

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
export default class AccessControlFramework {
    private _resources: Record<string, Resource>;
    private _roles: Record<string, Role>;
    private _identityDefinitions: {
        [index: string]: IdentityResolver;
        default: IdentityResolver;
    }

    constructor(opts: FrameworkOptions) {
        const { identityDefinitionStrategies } = opts;

        this._resources = {};
        this._roles = {};
        this._identityDefinitions = identityDefinitionStrategies;
    }

    public defineIdentity({ strategy = 'default', props }: { strategy: string; props: any }): Identity {
        const identityResolver = this._identityDefinitions[strategy];

        if (!identityResolver) {
            console.warn(`Warning: "${strategy}" is not a valid identity strategy. AuthenticatableEntity has not been identified.`);

            return {
                traits: {}
            };
        }

        return this._identityDefinitions[strategy](props);
    }

    public registerRole(role: Role): void {
        if (!(role instanceof Role)) {
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

    public registerResource(resource: Resource): void {
        if (!(resource instanceof Resource)) {
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

    public getRole(role: string): Role | null {
        return this._roles[role] || null;
    }

    public getResource(resource: string): Resource | null {
        return this._resources[resource] || null;
    }
}

