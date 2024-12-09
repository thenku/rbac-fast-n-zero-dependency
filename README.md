# rbac-fast-n-zero-dependency

## A fast RBAC manager for nodejs using in-memory Hash Tables or Key-Value Pairs.
### Versatile and easy-to-use

## How to Use

### Installation

```sh
npm install rbac-fast-n-zero-dependency
```

### Basic Usage

```javascript

const RBAC = require('rbac-fast-n-zero-dependency');

const rbac = new RBAC();

// default roles
owner
admin
contributor
reader
registered
guest

// Add non-default roles / groups
rbac.setRoleOnce('vendors');
rbac.setRoleOnce('employees');

// enable endpoints with corresponding table relationships if needed
rbac.setEndpointAccessRelationship("/users", "root"); "root" | "group" | "user"

// getPermissions
rbac.getPermissions("owner", "/users"); //owner always has all permissions if the endpoint was enabled

// whitelist permissions per endpoint per role
RBAC.setPermissions("registered", "/users", {c:1, r:1, u:1, d:1, x:1});

```

### API
