"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Operation;
(function (Operation) {
    Operation[Operation["FindOne"] = 0] = "FindOne";
    Operation[Operation["FindMany"] = 1] = "FindMany";
    Operation[Operation["Create"] = 2] = "Create";
    Operation[Operation["Update"] = 3] = "Update";
    Operation[Operation["Delete"] = 4] = "Delete";
})(Operation || (Operation = {}));
class Resource {
    constructor(schema, permissions) {
        this.transact = (transaction) => {
            const grantAccess = transaction.onAccessGranted;
            const denyAccess = transaction.onAccessDenied;
            const { principal, role, strategy } = transaction;
            /* Authorize the user by checking that they belong to at least one required group */
            if (strategy === 'static') {
                return principal.is(role) ? grantAccess() : denyAccess();
            }
            /* Authorize the actor by checking that they belong to all required groups */
            if (strategy === 'exact') {
                return principal.isExactly(role) ? grantAccess() : denyAccess();
            }
            /* TODO: Figure out a way to dynamically authorize the user without
             * allowing the developer to write code with harmful side effects
             * inside the resolution strategy */
            /* At this point we know that the specified strategy is dynamic */
            // const { requireTransactionResult } = role.resolvers[strategy];
        };
        this.schema = schema;
        this.permissions = permissions;
    }
}
exports.Resource = Resource;
