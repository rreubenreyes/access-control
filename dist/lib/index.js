"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Transaction {
    constructor(executor) {
        this._actor = undefined;
        this._restriction = undefined;
        this._executor = executor;
    }
    actor(txnActor) {
        this._actor = txnActor;
        return this;
    }
    restriction(txnRestriction) {
        this._restriction = txnRestriction;
        return this;
    }
    mediate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._actor)
                return Promise.reject('Cannot perform transaction without actor');
            if (!this._restriction)
                return Promise.reject('Cannot perform transaction without restriction');
            if (!this._restriction.preflight(this._actor)) {
                return Promise.reject('Preflight: Actor is unauthorized to perform this transaction');
            }
            return new Promise(this._executor)
                .then((result) => {
                if (!result) {
                    return Promise.reject('Transaction not mediated: Resource could not be found');
                }
                const actor = this._actor;
                const restriction = this._restriction;
                if (restriction.requirements(actor, result)) {
                    return result;
                }
                return Promise.reject('Actor is unauthorized to perform this transaction');
            })
                .catch((err) => {
                throw new Error(err);
            });
        });
    }
}
exports.Transaction = Transaction;
exports.default = Transaction;
