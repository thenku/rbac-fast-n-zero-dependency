import RBAC from './index'; //import the global singleton

// Add non-default roles / groups
RBAC.setRoleOnce('vendors');
RBAC.setRoleOnce('employees');

//choose an endpoint
const endpoint1 = "/users";

// enable endpoints by adding an owner-type OR access-relationship for the endpoint 
RBAC.setEndpointStorageContext(endpoint1, "root"); //"root" | "group" | "user"

// whitelist permissions per endpoint per role and define a selector a: "grant" | "mng" | "gid" | "uid" for related entries
RBAC.setPermissions("registered", endpoint1, {c:1, r:1, u:1, d:1, x:1, a:"uid2id"});

// getPermissions
RBAC.getPermissions("owner", endpoint1); //owner always has all permissions if the endpoint was enabled

const gid = RBAC.getGidOfRoleName("registered");
const permissions = RBAC.getPermissions(RBAC.getRoleNameOfGid(gid), endpoint1); //registered role permissions

// get multi-tenant options
const storageContext = RBAC.getEndpointStorageContext(endpoint1); //where to find the data-hierarchy of the endpoint

// const canGrantAndManageEndpointData = (permissions.a  == "grant") ? true : false;
// const canManageEndpointData = (permissions.a  == "mng") ? true : false;
// const mustFilterAccessByUID = (permissions.a == "uid") ? true : false;
// const mustFilterAccessByGID = (permissions.a  == "gid") ? true : false;