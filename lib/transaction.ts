/* eslint-disable @typescript-eslint/no-explicit-any */
import { Principal } from './role';

export class RejectedTransactionError extends Error {
    constructor() {
        const message = 'RejectedTransactionError:' 
            + `User is not allowed to perform this transaction`;

        super(message);

        Error.captureStackTrace(this, RejectedTransactionError);
    }
}

export interface TransactionPlan {
    authorize: ({ principal, resource }: {
        principal: Principal;
        resource?: any;
    }) => boolean;

    lazy: boolean;
}

interface TransactionOptions {
    principal: Principal;
    plan: TransactionPlan;
}

interface PromiseExecutor {
    (resolve: (value?: unknown) => void, reject: (reason?: any) => void): unknown;
}


export class Transaction {
    constructor(executor: PromiseExecutor, options: TransactionOptions) {
        const { 
            principal, 
            plan: { 
                authorize, 
                lazy, 
            },
        } = options;

        /* If this transaction plan isn't lazy, then authorize right away */
        if (!lazy) {
            const isAllowed = authorize({ principal });

            if (!isAllowed) {
                return Promise.reject(new RejectedTransactionError());
            }
        }

        /* Execute the main promise body, then authorize the actor based on the result */
        const promise: Promise<unknown> = new Promise(executor)
            .then(resource => {
                if (lazy) {
                    const isAllowed = authorize({ principal, resource });

                    if (!isAllowed) {
                        return Promise.reject(new RejectedTransactionError());
                    }
                }

                return resource;
            })

        return promise;
    }
}
