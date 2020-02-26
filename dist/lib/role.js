"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Principal {
    constructor(authInfo) {
        /**
         * Verify that this principal's groups contains at least one group from the
         * required role.
         */
        this.is = (role) => {
            return this.authInfo.groups.some(group => role.groups.includes(group));
        };
        /**
         * Verify that this principal's groups contains exactly the specified group
         * from the required role.
         */
        this.isExactly = (role) => {
            return this.authInfo.groups.every(group => role.groups.includes(group));
        };
        this.authInfo = authInfo;
    }
    /**
     * Use a dynamic resolver from the required role to authorize this principal.
     */
    resolve(role, strategy, options = {}) {
        return role.resolvers[strategy].resolve(role, options);
    }
}
exports.Principal = Principal;
