type PromiseExecutor<T> = (
    resolve: (value?: T | PromiseLike<T> | undefined) => void,
    reject?: (reason?: unknown) => void
) => void;

export type Restriction<A, R> = {
    preflight: (actor?: A) => boolean;
    requirements: (actor: A, resource: R) => boolean;
}

export class Transaction<A, R> {
    private _executor: PromiseExecutor<R>;
    private _actor: A | undefined = undefined;
    private _restriction: Restriction<A, R> | undefined = undefined;

    constructor(executor: PromiseExecutor<R>) {
        this._executor = executor;
    }

    actor(txnActor: A): this {
        this._actor = txnActor;
        return this;
    }

    restriction(txnRestriction: Restriction<A, R>): this {
        this._restriction = txnRestriction;
        return this;
    }

    async mediate(): Promise<R> {
        if (!this._actor) return Promise.reject('Cannot perform transaction without actor');
        if (!this._restriction) return Promise.reject('Cannot perform transaction without restriction');

        if (!this._restriction.preflight(this._actor)) {
            return Promise.reject('Preflight: Actor is unauthorized to perform this transaction');
        }

        return new Promise(this._executor)
            .then((result: R | undefined) => {
                if (!result) {
                    return Promise.reject('Transaction not mediated: Resource could not be found');
                }

                const actor = this._actor as A;
                const restriction = this._restriction as Restriction<A, R>;

                if (restriction.requirements(actor, result)) {
                    return result;
                } 

                return Promise.reject('Actor is unauthorized to perform this transaction');
            })
            .catch((err: string | undefined) => {
                throw new Error(err);
            });
    }
}

export default Transaction;
