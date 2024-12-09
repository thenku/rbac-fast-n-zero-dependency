# rbac-fast-n-zero-dependency

#### A data storage agnostic Role-Based-Access-Control (RBAC) manager with Big O(1) complexity and zero dependencies.

## How to Use

### Concept
1. Add a role or use an existing role.
2. Enable endpoints by defining a context filter: "root" | "group" | "user".
3. Optionally interpret the endpoint context if you have a multi-tenant system.
4. Explicitly set (whitelist) permissions for each role per endpoint.
5. Use your authorized user's groupId to query his/her permissions for the requested endpoint.

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

// enable endpoints by adding an owner-type OR access-relationship for the endpoint 
rbac.setEndpointAccessRelationship("/users", "root"); "root" | "group" | "user"

// whitelist permissions per endpoint per role
RBAC.setPermissions("registered", "/users", {c:1, r:1, u:1, d:1, x:1});

// getPermissions
rbac.getPermissions("owner", "/users"); //owner always has all permissions if the endpoint was enabled

const gid = rbac.getGidOfRole("registered");
rbac.getPermissions(rbac.getRoleNameOfGid(gid), "/users"); //registered role permissions (apply filter if using root context)



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
