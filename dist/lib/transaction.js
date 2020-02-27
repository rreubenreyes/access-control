"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RejectedTransactionError extends Error {
    constructor() {
        const message = 'RejectedTransactionError:'
            + `User is not allowed to perform this transaction`;
        super(message);
        Error.captureStackTrace(this, RejectedTransactionError);
    }
}
exports.RejectedTransactionError = RejectedTransactionError;
class Transaction {
    constructor(executor, options) {
        const { principal, plan: { authorize, lazy } } = options;
        /* If this transaction plan isn't lazy, then authorize right away */
        if (!lazy) {
            const isAllowed = authorize({ principal });
            if (!isAllowed) {
                return Promise.reject(new RejectedTransactionError());
            }
        }
        /* Execute the main promise body, then authorize the actor based on the result */
        const promise = new Promise(executor)
            .then(resource => {
            if (lazy) {
                const isAllowed = authorize({ principal, resource });
                if (!isAllowed) {
                    return Promise.reject(new RejectedTransactionError());
                }
            }
            return resource;
        });
        return promise;
    }
}
exports.Transaction = Transaction;
