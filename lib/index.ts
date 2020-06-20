type PromiseExecutor<T> = (
    resolve: (value?: T | PromiseLike<T> | undefined) => void,
    reject?: (reason?: unknown) => void
) => void;

export type Scope<A, R> = {
    name: string;
    priority: number;
    predicate: (actor: A, resource: Partial<R>) => boolean;
    projection: (resource: Partial<R>) => Partial<R> | null;
    allowFurther?: Scope<A, R>[];
};

export type Restriction<A, R> = {
    preflight: (actor?: A) => boolean;
    requirements: (actor: A, resource: R) => boolean;
    allowedScopes?: Scope<A, R>[];
};

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
        this._restriction = txnRestriction as Restriction<A, R>;

        return this;
    }

    private evaluateScopeWaterfall(resource: Partial<R>, scopes: Scope<A, R>[]): Partial<R> | null {
        const actor = this._actor as A;
        const priorityScopes = [...scopes].sort((a, b) => a.priority - b.priority);

        const matchingScope = priorityScopes.find(scope => scope.predicate(actor, resource));

        if (!matchingScope) {
            return null;
        }

        if (!matchingScope.projection(resource)) {
            return null;
        }

        const scopedResult = matchingScope.projection(resource) as Partial<R>;

        if (matchingScope.allowFurther) {
            return this.evaluateScopeWaterfall(scopedResult, matchingScope.allowFurther);
        }

        return scopedResult;
    }

    async mediate(): Promise<Partial<R> | null> {
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
                    if (!restriction.allowedScopes) {
                        return result;
                    }

                    return this.evaluateScopeWaterfall(result, restriction.allowedScopes);
                } 

                return Promise.reject('Actor is unauthorized to perform this transaction');
            })
            .catch((err: string | undefined) => {
                throw new Error(err);
            });
    }
}

export default Transaction;
