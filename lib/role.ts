/* eslint-disable @typescript-eslint/no-explicit-any */
interface StaticRoleResolver {
    ({ role }: { role: Role }): boolean;
}

interface DynamicRoleResolver {
    ({ role, ...options }: { role: Role } & Record<string, any>): boolean;
}

interface RoleOptions {
    name: string;
    groups: string[];
    resolvers: Record<string, DynamicRoleResolver>;
}

export class Role {
    public name: string;
    public groups: string[];

    private resolvers: Record<string, DynamicRoleResolver>;

    constructor({ name, groups, resolvers }: RoleOptions) {
        this.name = name;
        this.groups = groups;
        this.resolvers = resolvers;
    }
    
    public getResolver({ name }: { name: string }): DynamicRoleResolver {
        const definedResolver: DynamicRoleResolver | undefined = this.resolvers[name];

        return definedResolver || ((): boolean => false);
    }
}

interface IntrospectedAuthorizationHeader {
    humanId: string;
    userId: string;
    clientId: string;
    groups: string[];
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
    public is: StaticRoleResolver = ({ role }) => {
        return this.authInfo.groups.some(group => role.groups.includes(group));
    }

    /**
     * Verify that this principal's groups contains exactly the specified group
     * from the required role.
     */
    public isExactly: StaticRoleResolver = ({ role }) => {
        return this.authInfo.groups.every(group => role.groups.includes(group));
    }

    /**
     * Use a dynamic resolver from the required role to authorize this principal.
     */
    public resolve(role: Role, resolver: string, options: Record<string, any> = {}): boolean {
        return role.getResolver({ name: resolver })({ role, ...options });
    }
}

