"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storageContexts = ["root", "group", "user"]; //table storage locations: system, group or user.
const accessSelectors = ["grant", "mng", "gid", "uid"]; //all may grant access to roles and access all user and group entries.
const defaultRoles = {
    guest: { id: "guest", gid: 0 }, //guest has uid 0 and gid 0 because it evaluates to false
    owner: { id: "owner", gid: 1 }, //by default owner is the system owner having all permissions, gid:1 and uid:1
    admin: { id: "admin", gid: 2 }, //high level tech support but NOT being the responsible party / data controller / data processor
    contributor: { id: "contributor", gid: 3 },
    reader: { id: "reader", gid: 4 },
    registered: { id: "registered", gid: 5 },
    tier1: { id: "tier1", gid: 6 },
    tier2: { id: "tier2", gid: 7 },
    tier3: { id: "tier3", gid: 8 },
    tier4: { id: "tier4", gid: 9 },
};
const defaultPermission = {
    c: 0,
    r: 0,
    u: 0,
    d: 0,
    x: 0,
    a: "uid",
};
class RBACClass {
    constructor() {
        this.endPointStorageContexts = {}; //only explicitly defined endpoints are allowed for access
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
            console.error(role, " -- Role already exists");
        }
    }
    getGidOfRoleName(roleName) {
        const role = this.rolesTable[roleName];
        ;
        return role ? role.gid : 0;
    }
    getRoleNameOfGid(gid) {
        return this.gid2Name[gid.toString()];
    }
    setEndpointStorageContext(endpoint, storageContext) {
        this.endPointStorageContexts[endpoint] = storageContext;
    }
    getEndpointStorageContext(endpoint) {
        return this.endPointStorageContexts[endpoint]; //if there is no relationship, the endpoint does not exist
    }
    removeEndpointAccess(endpoint) {
        delete this.endPointStorageContexts[endpoint];
    }
    setPermissions(role, endpoint, permission) {
        if (!this.getEndpointStorageContext(endpoint)) {
            console.error(endpoint, "-- endpoint does not exist");
            return;
        }
        if (!this.endPointRolePermissions[endpoint]) {
            this.endPointRolePermissions[endpoint] = {};
        }
        this.endPointRolePermissions[endpoint][role] = permission;
    }
    getPermissions(role, endpoint) {
        const endPoint = this.endPointRolePermissions[endpoint];
        if (role == "owner") {
            return {
                c: 1,
                r: 1,
                u: 1,
                d: 1,
                x: 1,
                a: "grant",
            };
        }
        if (endPoint) {
            const permission = endPoint[role];
            if (permission) {
                return permission;
            }
        }
        return defaultPermission;
    }
    getPermissionByGid(gid, endpoint) {
        const roleName = this.getRoleNameOfGid(gid);
        if (!roleName) {
            return defaultPermission;
        }
        return this.getPermissions(roleName, endpoint);
    }
}
const RBAC = new RBACClass(); //singleton
exports.default = RBAC;
