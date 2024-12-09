"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRelationships = ["root", "group", "user"];
const defaultRoles = {
    guest: { id: "guest", gid: 0 },
    owner: { id: "owner", gid: 1 },
    admin: { id: "admin", gid: 2 }, //manages roles as tech support but isn't the responsible data controller and/or processor or company owner
    system: { id: "system", gid: 3 }, //maybe relevant for tracking changes but every service can also have its own role
    contributor: { id: "contributor", gid: 8 },
    reader: { id: "reader", gid: 9 },
    registered: { id: "registered", gid: 10 },
};
const defaultPermission = {
    c: 0,
    r: 0,
    u: 0,
    d: 0,
    x: 0,
};
class RBACClass {
    constructor() {
        this.whiteEndPointAccessRelationship = {}; //only explicitly defined endpoints are allowed for access
        this.endPointRolePermissions = {};
        this.rolesTable = defaultRoles; //roles are types of groups
        this.gid2Name = {};
        this.latestRoleKey = 0;
        for (const key in this.rolesTable) {
            const { gid } = this.rolesTable[key];
            this.gid2Name[gid.toString()] = key;
            if (gid > this.latestRoleKey) {
                this.latestRoleKey = gid;
            }
        }
    }
    getIncrementedRoleKey() {
        this.latestRoleKey++;
        return this.latestRoleKey;
    }
    hasRole(role) {
        return this.rolesTable[role] != undefined ? true : false;
    }
    setRoleOnce(role) {
        if (!this.hasRole(role)) {
            const gid = this.getIncrementedRoleKey();
            this.rolesTable[role] = { id: role, gid: gid };
            this.gid2Name[gid.toString()] = role;
        }
        else {
            console.log(role, " -- Role already exists");
        }
    }
    getRole(role) {
        const roleRow = this.rolesTable[role];
        return (roleRow) ? roleRow : defaultPermission;
    }
    getRoleByGid(gid) {
        return this.rolesTable[this.gid2Name[gid.toString()]];
    }
    // endpoint table entries relate to the access relationship
    // sometimes individual fields eg. file can have a different ownership eg. root table can have photos of users stored in their directories
    // field ownership is handled at the form processing level
    setEndpointAccessRelationship(endpoint, accessRelationship) {
        this.whiteEndPointAccessRelationship[endpoint] = accessRelationship;
    }
    removeEndpointAccessRelationship(endpoint) {
        delete this.whiteEndPointAccessRelationship[endpoint];
    }
    getEndpointAccessRelationship(endpoint) {
        return this.whiteEndPointAccessRelationship[endpoint]; //if there is not relationship, the endpoint does not exist
    }
    setPermission(role, endpoint, permission) {
        if (!this.getEndpointAccessRelationship(endpoint)) {
            console.log("Endpoint does not exist");
            return;
        }
        if (!this.endPointRolePermissions[endpoint]) {
            this.endPointRolePermissions[endpoint] = {};
        }
        this.endPointRolePermissions[endpoint][role] = permission;
    }
    getPermission(role, endpoint) {
        const endPoint = this.endPointRolePermissions[endpoint];
        if (endPoint) {
            const permission = endPoint[role];
            if (permission) {
                return permission;
            }
        }
        return defaultPermission;
    }
}
const RBAC = new RBACClass();
exports.default = RBAC;
