/* eslint-disable @typescript-eslint/no-explicit-any */
interface StaticResolutionStrategy {
    (role: Role): boolean;
}

type DynamicResolverOptions = Record<string, any>

interface DynamicResolutionStrategy {
    requireTransactionResult: boolean;
    resolve: (role: Role, options: DynamicResolverOptions) => boolean;
}

type IntrospectedAuthorizationHeader = {
    humanId: string;
    userId: string;
    clientId: string;
    groups: string[];
}

export interface Role {
    name: string;
    groups: string[];
    resolvers: {
        [index: string]: DynamicResolutionStrategy;
    };
}

export class Principal {
    public authInfo: IntrospectedAuthorizationHeader;

    constructor(authInfo: IntrospectedAuthorizationHeader) {
        this.authInfo = authInfo;
    }

    /**
     * Verify that this principal's groups contains at least one group from the
     * required role.
     */
    public is: StaticResolutionStrategy = (role: Role) => {
        return this.authInfo.groups.some(group => role.groups.includes(group));
    }

    /**
     * Verify that this principal's groups contains exactly the specified group
     * from the required role.
     */
    public isExactly: StaticResolutionStrategy = (role: Role) => {
        return this.authInfo.groups.every(group => role.groups.includes(group));
    }

    /**
     * Use a dynamic resolver from the required role to authorize this principal.
     */
    public resolve(role: Role, strategy: string, options: DynamicResolverOptions = {}): boolean {
        return role.resolvers[strategy].resolve(role, options);
    }
}

