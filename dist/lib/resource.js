"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Resource {
    constructor({ name, transactions }) {
        this.name = name;
        this.transactions = transactions;
    }
    getTransactionPlan({ name }) {
        if (!this.transactions[name])
            return null;
        return this.transactions[name];
    }
}
exports.Resource = Resource;
