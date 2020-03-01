# access-control 🔒
Lightweight, general-purpose access control layer.

(This project is still a work in progress!)

TODO:
- [ ] Clean up which properties are accessible inside `Principal` and `Role`
- [ ] Close potential authn/authz loopholes
- [ ] Write unit tests

# Example Usage 

(this section isn't finished yet)

First, we define a new access control framework:

```javascript
const AccessControlFramework = require('access-control');

const identityDefinitionStrategies = {
    default: (rawUserInformation) => {
        return {
            groups: rawUserInformation.groups,
            isRegistered: rawUserInformation.isRegistered,
        }
    },
};

const framework = new AccessControlFramework({ identityDefinitionStrategies });
```

Here, we've defined an object called `identityDefinitionStrategies`, which contains functions that map raw user information to a valid user identity. In the above example, the required `"default"` strategy defines a user identity as an object containing an array called `"groups"`.

Next, we define roles for our framework:

```javascript
const { Role } = require('access-control');

const admin = new Role({
    framework,
    name: 'admin',
    identity: {
        groups: ['administrators', 'moderators', 'registered-users']
        isRegistered: true,
    }
});

const user = new Role({
    framework,
    name: 'user',
    identity: {
        groups: ['users']
    }
});

const visitor = new Role({
    framework,
    name: 'visitor',
    identity: {
        groups: ['users'],
        isRegistered: false,
    }
});
```

In order for our defined roles to be able to participate in our framework, we _must_ pass the `framework` instance as an argument to our role definition. Notice that we have also directly defined the identities of all of our roles.

If you are implementing an access control framework, you probably have resources that you want to protect. Let's define some now:

```javascript
const { Resource } = require('access-control');
const { admin, user, visitor } = require('./my-roles');

const forumPosts = new Resource({
    framework,
    name: 'forum-posts',
    preflightAuthorizationStrategy: ({ principal }) => {
        // This value will be true if the principal's identity exactly matches an admin's identity
        // TODO for the author: Need to clean up authn methods to be more robust/less "leaky abstraction"
        const isAdmin = principal.is(admin);
        const isUser = principal.is(user);
    }
})

```

When about to execute a transaction, we most likely want to first identify the actor that is attempting the transaction:

```javascript
// Somewhere in our server...
const { Principal } = require('access-control');

/* Make sure we have access to our previously defined framework */
const framework = require('./my-framework');

async function getForumPosts(request, response) {
    const rawUserInformation = request.headers['X-User'];

    const actor = new Principal({
        framework,
        props: rawUserInformation,
        strategy: 'default' // Note: If this field is missing, the 'default' strategy will be used anyway
    });
}
```

Using an API controller as an example above, we use the user information contained in a request header in order to identify the actor who is making the request. Now we're ready to execute a transaction.

```javascript
// Somewhere in our server...
const { Principal, Transaction } = require('access-control');

/* Make sure we have access to our previously defined framework */
const framework = require('./my-framework');
const forumPosts = require('./my-resources/forum-posts');

async function getForumPosts(request, response) {
    const rawUserInformation = request.headers['X-User'];

    const actor = new Principal({
        framework,
        props: rawUserInformation,
        strategy: 'default' // Note: If this field is missing, the 'default' strategy will be used anyway
    });

    const transactionPlan = {
        principal: actor,
        resource: forumPosts
    };

    const result = await new Transaction(transactionPlan, (resolve, reject, scope) => {
        const posts = await fetch('posts');

        // Your authz logic here
    });
}
```
