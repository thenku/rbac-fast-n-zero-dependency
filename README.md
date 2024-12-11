# rbac-fast-n-zero-dependency

#### A data storage agnostic Role-Based-Access-Control (RBAC) manager with Big O(1) complexity and zero dependencies.

## How to Use

### Concept
1. Add a role or use an existing role.
2. Enable endpoints by defining a context filter: "root" | "group" | "user".
3. Optionally interpret the endpoint context if you have a multi-tenant system.
4. Explicitly set (whitelist) permissions for each role per endpoint.
5. Use your authorized user's groupId to query his/her permissions for the requested endpoint.
6. If you want to use a DB for storing RBAC, then load your entries at app-initialization and update them at the same time as your DB updates.

### Installation

```sh
npm install rbac-fast-n-zero-dependency
```

### Basic Usage

```javascript

const RBAC = require('rbac-fast-n-zero-dependency');//import singleton

// Add non-default roles / groups
RBAC.setRoleOnce('vendors');
RBAC.setRoleOnce('employees');

// enable endpoints by adding an owner-type OR access-relationship for the endpoint 
RBAC.setEndpointAccessRelationship("/users", "root"); "root" | "group" | "user"

// whitelist permissions per endpoint per role
RBAC.setPermissions("registered", "/users", {c:1, r:1, u:1, d:1, x:1});

// getPermissions
RBAC.getPermissions("owner", "/users"); //owner always has all permissions if the endpoint was enabled

const gid = RBAC.getGidOfRole("registered");
RBAC.getPermissions(RBAC.getRoleNameOfGid(gid), "/users"); //registered role permissions (apply filter if using root context)


```

### default roles
- owner
- admin
- contributor
- reader
- registered
- guest

### API

#### `RBAC`

Imports the RBAC singleton.

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

#### `getGidOfRole(role)`

Gets the group ID (GID) of a specific role.

- `role` (string): The role to get the GID for.

#### `getRoleNameOfGid(gid)`

Gets the role name associated with a specific group ID (GID).

- `gid` (number): The GID to get the role name for.

#### `removeRole(role)`

Removes a role from the RBAC system.

- `role` (string): The role to remove.

#### `removeEndpoint(endpoint)`

Removes an endpoint from the RBAC system.

- `endpoint` (string): The endpoint to remove.