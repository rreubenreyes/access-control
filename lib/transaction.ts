/* eslint-disable @typescript-eslint/no-explicit-any */
import { Principal } from './identity';
import { Resource } from './resource';
import { AuthorizedScope } from './resource';

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

interface TransactionExecutor {
    (
        resolve: any,
        reject: any,
        scope: AuthorizedScope
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

        const authorizedScope = resource.authorizePreflight({ principal });

        if (authorizedScope === null) {
            throw new RejectedTransactionError(
                `Transaction on resource ${resource.name} was rejected pre-flight.`
            );
        }

        return new Promise((resolve, reject) => executor(resolve, reject, authorizedScope))
    }
}
