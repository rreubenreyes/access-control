/* eslint-disable @typescript-eslint/no-explicit-any */
import { Principal } from './identity';
import { Resource } from './resource';

export class RejectedTransactionError extends Error {
    constructor(message: string) {
        const msg = 'RejectedTransactionError:' 
            + (message || `User is not allowed to perform this transaction`);

        super(msg);

        Error.captureStackTrace(this, RejectedTransactionError);
    }
}

export interface TransactionPlan {
    principal: Principal;
    resource: Resource;
}

interface TransactionScope {
    foo: string;
}

interface TransactionExecutor {
    (
        resolve: (value?: unknown) => void, 
        reject: (reason?: any) => void,
        scope: TransactionScope
    ): unknown;
}

export class Transaction {
    constructor(plan: TransactionPlan, executor: TransactionExecutor) {
        const { principal, resource } = plan;

        if (!(principal instanceof Principal)) {
            throw new RejectedTransactionError('principal is not an instance of Principal');
        }

        if (!(resource instanceof Resource)) {
            throw new RejectedTransactionError('resource is not an instance of Resource');
        }

        const isAuthorizedPreflight = resource.authorizePreflight({ principal });

        if (!isAuthorizedPreflight) {
            throw new RejectedTransactionError(
                `Transaction on resource ${resource.name} was rejected pre-flight.`
            );
        }

        const transactionScope = { foo: 'bar' };

        return new Promise((resolve, reject) => executor(resolve, reject, transactionScope))
    }
}
