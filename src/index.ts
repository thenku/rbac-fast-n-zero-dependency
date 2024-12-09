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

type iRoleRow = {id:string, gid:number, parent?:string};
const defaultRoles: Record<string, iRoleRow> = {
    guest: {id: "guest", gid:0},
    owner: {id: "owner", gid:1},
    admin: {id: "admin", gid:2}, //manages roles as tech support but isn't the responsible data controller and/or processor or company owner

    contributor: {id: "contributor", gid:3},
    reader: {id: "reader", gid:4},

    registered: {id: "registered", gid:1000},
}
const defaultPermission:iPermission = {
    c: 0,
    r: 0,
    u: 0,
    d: 0,
    x: 0,
}

class RBAC {
    private whiteEndPointAccessRelationship: Record<string, iAccessRelationship> = {};//only explicitly defined endpoints are allowed for access
    private endPointRolePermissions: {[endPoint in string]: {[roleName in string]: iPermission}} = {};

    private rolesTable: {[roleName in string]: iRoleRow} = defaultRoles; //roles are types of groups
    private gid2Name: {[gidStr in string]: string} = {};
    private latestRoleKey: number = 0;

    private getIncrementedRoleKey(){
        for (const key in this.rolesTable) {
            const num = parseInt(key);
            if(num > this.latestRoleKey){
                this.latestRoleKey = num;
            }
        }
        this.latestRoleKey++;
        return this.latestRoleKey;
    }
    hasRole(role: string) {
        return this.rolesTable[role] != undefined ? true : false;
    }
    setRoleOnce(role: string, parentRole: string = "") {
        if(!this.hasRole(role)){
            const gid = this.getIncrementedRoleKey();
            this.rolesTable[role] = {id: role, gid: gid, parent: parentRole};
            this.gid2Name[gid.toString()] = role;
        }
    }
    getRole(role: string) {
        const roleRow = this.rolesTable[role];
        return (roleRow) ? roleRow : defaultPermission;
    }
    allowEndpoint(endpoint: string, accessRelationship: iAccessRelationship) {
        this.whiteEndPointAccessRelationship[endpoint] = accessRelationship;
    }
    removeEndpoint(endpoint: string) {
        delete this.whiteEndPointAccessRelationship[endpoint];
    }
    setPermission(role: string, endpoint: string, permission: iPermission) {
        if(!this.endPointRolePermissions[endpoint]){
            this.endPointRolePermissions[endpoint] = {};
        }
        this.endPointRolePermissions[endpoint][role] = permission;
    }
    getPermission(role:string, endpoint:string){
        const endPoint = this.endPointRolePermissions[endpoint];
        if(endPoint){
            const permission = endPoint[role];
            if(permission){
                return permission;
            }
        }
        return defaultPermission;
    }
}
const RBACSingleton = new RBAC();
export default RBACSingleton;