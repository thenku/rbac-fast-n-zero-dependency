//permission type
type iPermission = {
    c: number,
    r: number,
    u: number,
    d: number,
    x: number,
}
const accessRelationships = ["root", "group", "user"] as const;
type iAccessRelationship = typeof accessRelationships[number];

type iRoleRow = {id:string, gid:number};

const defaultRoles: Record<string, iRoleRow> = {
    guest: {id: "guest", gid:0},
    owner: {id: "owner", gid:1},
    admin: {id: "admin", gid:2}, //manages roles as tech support but isn't the responsible data controller and/or processor or company owner
    // system: {id: "system", gid:3}, //maybe relevant for tracking changes but every service can also have its own role

    
    contributor: {id: "contributor", gid:8},
    reader: {id: "reader", gid:9},
    registered: {id: "registered", gid:10},
} as const;
type iRoleKey = keyof typeof defaultRoles;

const defaultPermission:iPermission = {
    c: 0,
    r: 0,
    u: 0,
    d: 0,
    x: 0,
}

class RBACClass {
    private whiteEndPointAccessRelationship: Record<string, iAccessRelationship> = {};//only explicitly defined endpoints are allowed for access
    private endPointRolePermissions: {[endPoint in string]: {[roleName in string]: iPermission}} = {};

    private rolesTable: {[roleName in string]: iRoleRow} = defaultRoles; //roles are types of groups
    private gid2Name: {[gidStr in string]: string} = {};
    private latestRoleKey: number = 0;

    constructor(){
        for (const key in this.rolesTable) {
            const {gid} = this.rolesTable[key];
            this.gid2Name[gid.toString()] = key;
            if(gid > this.latestRoleKey){
                this.latestRoleKey = gid;
            }
        }
    }
    private getIncrementedRoleKey(){
        this.latestRoleKey++;
        return this.latestRoleKey;
    }
    
    hasRole(role: string) {
        return this.rolesTable[role] != undefined ? true : false;
    }
    setRoleOnce(role: string) {
        if(!this.hasRole(role)){
            const gid = this.getIncrementedRoleKey();
            this.rolesTable[role] = {id: role, gid: gid};
            this.gid2Name[gid.toString()] = role;
        }else{
            console.log(role," -- Role already exists");
        }
    }
    getRole(role: string) {
        return this.rolesTable[role];
    }
    getGidOfRole(roleName: string) {
        const role = this.getRole(roleName);
        return role ? role.gid : 0;
    }
    getRoleNameOfGid(gid: number) {
        return this.gid2Name[gid.toString()];
    }

    // endpoint table entries relate to the access relationship
    // sometimes individual fields eg. file can have a different ownership eg. root table can have photos of users stored in their directories
    // field ownership is handled at the form processing level
    setEndpointAccessRelationship(endpoint: string, accessRelationship: iAccessRelationship) {
        this.whiteEndPointAccessRelationship[endpoint] = accessRelationship;
    }
    removeEndpointAccessRelationship(endpoint: string) {
        delete this.whiteEndPointAccessRelationship[endpoint];
    }
    getEndpointAccessRelationship(endpoint: string) {
        return this.whiteEndPointAccessRelationship[endpoint]; //if there is not relationship, the endpoint does not exist
    }

    setPermission(role: string, endpoint: string, permission: iPermission) {
        if(!this.getEndpointAccessRelationship(endpoint)){
            console.log("Endpoint does not exist");
            return;
        }
        if(!this.endPointRolePermissions[endpoint]){
            this.endPointRolePermissions[endpoint] = {};
        }
        this.endPointRolePermissions[endpoint][role] = permission;
    }
    getPermission(role:string, endpoint:string){
        const endPoint = this.endPointRolePermissions[endpoint];
        if(role == "owner"){
            return {
                c: 1,
                r: 1,
                u: 1,
                d: 1,
                x: 1,
            }
        }
        if(endPoint){
            const permission = endPoint[role];
            if(permission){
                return permission;
            }
        }
        return defaultPermission;
    }
    getPermissionByGid(gid:number, endpoint:string){
        const roleName = this.getRoleNameOfGid(gid);
        if(!roleName){
            return defaultPermission;
        }
        return this.getPermission(roleName, endpoint);
    }
}
const RBAC = new RBACClass();
export default RBAC;