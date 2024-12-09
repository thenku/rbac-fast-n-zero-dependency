# rbac-fast-n-zero-dependency

## A fast RBAC manager for nodejs using in-memory Hash Tables or Key-Value Pairs.

## How to Use

### Installation

```sh
npm install rbac-fast-n-zero-dependency
```

### Basic Usage

```javascript

const RBAC = require('rbac-fast-n-zero-dependency');

const rbac = new RBAC();


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

### default roles
- owner
- admin
- contributor
- reader
- registered
- guest

### API

#### `RBAC()`

Creates a new RBAC instance.

#### `setRoleOnce(role)`

Adds a new role if it doesn't already exist.

- `role` (string): The name of the role to add.

#### `setEndpointAccessRelationship(endpoint, relationship)`

Sets the access relationship for a specific endpoint.

- `endpoint` (string): The endpoint to set the relationship for.
- `relationship` (string): The type of relationship ("root", "group", "user").

#### `getPermissions(role, endpoint)`

Gets the permissions for a specific role and endpoint.

- `role` (string): The role to get permissions for.
- `endpoint` (string): The endpoint to get permissions for.

#### `setPermissions(role, endpoint, permissions)`

Sets the permissions for a specific role and endpoint.

- `role` (string): The role to set permissions for.
- `endpoint` (string): The endpoint to set permissions for.
- `permissions` (object): An object representing the permissions (c: create, r: read, u: update, d: delete, x: execute).
