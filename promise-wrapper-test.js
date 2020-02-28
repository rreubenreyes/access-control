/* Transactions are wrappers over Promises which expose an additional object, called "scope", as a third
 * argument to the promise executor. */
class Transaction {
    constructor(transactionPlan, executor) {
        const { authorize, lazy, principal, scope, role } = transactionPlan;

        if (!lazy) {
            if (!authorize({ principal })) {
                reject(new Error('Access denied'));
            }
        }

        return new Promise((resolve, reject) => {
            executor(resolve, reject, scope);
        }).then(result => {
            if (lazy) {
                if (!authorize({ principal })) {
                    throw new Error('Access denied');
                }
            }

            return result;
        });
    }
}

const authorize = () => true;

const getResource = () => ({
    humanId: 'test-human-id',
    userId: 'test-user-id',
})

const transactionPlan = {
    authorize,
    lazy: true,
    principal: 'me',
    scope: {
        filters: {
            userIdOnly(result) {
                return result.userId;
            }
        }
    }
};

async function main() {
    const result = await new Transaction(transactionPlan, (resolve, reject, scope) => {
        const resource = getResource();
        
        resolve(scope.filters.userIdOnly(resource));
    });

    console.log({ result });
}

main();
