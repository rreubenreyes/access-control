/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TransactionPlan } from './transaction';

export class Resource {
    public name: string;
    private transactions: Record<string, TransactionPlan>;

    constructor({ name, transactions }: { name: string; transactions: Record<string, TransactionPlan> }) {
        this.name = name;
        this.transactions = transactions;
    }

    public getTransactionPlan({ name }: { name: string }): TransactionPlan | null {
        if (!this.transactions[name]) return null;

        return this.transactions[name];
    }
}

