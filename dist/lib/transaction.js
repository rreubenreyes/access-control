"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const identity_1 = require("./identity");
const resource_1 = require("./resource");
class RejectedTransactionError extends Error {
    constructor(message) {
        const msg = 'RejectedTransactionError:'
            + (message || `User is not allowed to perform this transaction`);
        super(msg);
        Error.captureStackTrace(this, RejectedTransactionError);
    }
}
exports.RejectedTransactionError = RejectedTransactionError;
class Transaction {
    constructor(plan, executor) {
        const { principal, resource } = plan;
        if (!(principal instanceof identity_1.Principal)) {
            throw new RejectedTransactionError('principal is not an instance of Principal');
        }
        if (!(resource instanceof resource_1.Resource)) {
            throw new RejectedTransactionError('resource is not an instance of Resource');
        }
        const authorizedScope = resource.authorizePreflight({ principal });
        if (authorizedScope === null) {
            throw new RejectedTransactionError(`Transaction on resource ${resource.name} was rejected pre-flight.`);
        }
        return new Promise((resolve, reject) => executor(resolve, reject, authorizedScope));
    }
}
exports.Transaction = Transaction;
