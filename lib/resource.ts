/* eslint-disable @typescript-eslint/no-explicit-any */
import { Principal, Role } from './role';

enum Operation {
    FindOne, // The actor may request exactly one of a resource
    FindMany, // The actor may request many of one resource 
    Create, // The actor may create a resource
    Update, // The actor may update a resource
    Delete, // The actor may delete a resouce
}

type TransactionStrategy = 'static' | string;

interface Transaction {
    principal: Principal;
    role: Role;
    operation: Operation;
    strategy: TransactionStrategy;
    onAccessGranted: () => (...args: any[]) => any;
    onAccessDenied: () => (...args: any[]) => any;
}

export class Resource {
    public schema: Record<string, any>;
    public permissions: Record<Operation, Role>;

    constructor(schema: Record<string, any>, permissions: Record<Operation, Role>) {
        this.schema = schema;
        this.permissions = permissions;
    }

    public transact: any = (transaction: Transaction): any => {
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
    }
}
