"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Role {
    constructor({ name, groups, resolvers }) {
        this.name = name;
        this.groups = groups;
        this.resolvers = resolvers;
    }
    getResolver({ name }) {
        const definedResolver = this.resolvers[name];
        return definedResolver || (() => false);
    }
}
exports.Role = Role;
class Principal {
    constructor(authInfo) {
        /**
         * Verify that this principal's groups contains at least one group from the
         * required role.
         */
        this.is = ({ role }) => {
            return this.authInfo.groups.some(group => role.groups.includes(group));
        };
        /**
         * Verify that this principal's groups contains exactly the specified group
         * from the required role.
         */
        this.isExactly = ({ role }) => {
            return this.authInfo.groups.every(group => role.groups.includes(group));
        };
        this.authInfo = authInfo;
    }
    /**
     * Use a dynamic resolver from the required role to authorize this principal.
     */
    authorize(role, resolver, options = {}) {
        return role.getResolver({ name: resolver })(Object.assign({ role }, options));
    }
}
exports.Principal = Principal;
