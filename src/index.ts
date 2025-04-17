
const storageContexts = ["root", "group", "user"] as const; //table storage locations: system, group or user.
type iStorageContext = typeof storageContexts[number];

//this is not the same as table-to-table relationships but they do force filters
const accessSelectors = ["uid2id", "uid2uid", "gid2gid", "table", "hierarchy"] as const; //all may grant access to roles and access all user and group entries.
type iAccessSelector = typeof accessSelectors[number];

//permission type
type iPermission = {
    c: number, //create
    r: number, //read
    u: number, //update
    d: number, //delete
    x: number, //execute
    a: iAccessSelector, //admin has access to all, gid to role and uid to user entries.
}

type iRoleName = string;
type iRoleRow = {id:iRoleName, gid:number};

const defaultRoles: Record<string, iRoleRow> = {
    guest: {id: "guest", gid:0}, //guest has uid 0 and gid 0 because it evaluates to false
    owner: {id: "owner", gid:1}, //by default owner is the system owner having all permissions, gid:1 and uid:1
    admin: {id: "admin", gid:2}, //high level tech support but NOT being the responsible party / data controller / data processor
    
    contributor: {id: "contributor", gid:3},
    reader: {id: "reader", gid:4},
    registered: {id: "registered", gid:5},

    tier1: {id: "tier1", gid:6},
    tier2: {id: "tier2", gid:7},
    tier3: {id: "tier3", gid:8},
    tier4: {id: "tier4", gid:9},
} as const;

const defaultPermission:iPermission = {
    c: 0,
    r: 0,
    u: 0,
    d: 0,
    x: 0,
    a: "uid2id",
}

class RBACClass {
    private endPointStorageContexts: Record<string, iStorageContext> = {};//only explicitly defined endpoints are allowed for access
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
            console.error(role," -- Role already exists");
        }
    }
    getGidOfRoleName(roleName: string) {
        const role = this.rolesTable[roleName];;
        return role ? role.gid : 0;
    }
    getRoleNameOfGid(gid: number) {
        return this.gid2Name[gid.toString()];
    }

    setEndpointStorageContext(endpoint: string, storageContext: iStorageContext) {
        this.endPointStorageContexts[endpoint] = storageContext;
    }
    getEndpointStorageContext(endpoint: string) {
        return this.endPointStorageContexts[endpoint]; //if there is no relationship, the endpoint does not exist
    }
    removeEndpointAccess(endpoint: string) {
        delete this.endPointStorageContexts[endpoint];
    }

    setPermissions(role: iRoleName, endpoint: string, permission: iPermission) {
        if(!this.getEndpointStorageContext(endpoint)){
            console.error(endpoint, "-- endpoint does not exist");
            return;
        }
        if(!this.endPointRolePermissions[endpoint]){
            this.endPointRolePermissions[endpoint] = {};
        }
        this.endPointRolePermissions[endpoint][role] = permission;
    }
    getPermissions(role:iRoleName, endpoint:string){
        const endPoint = this.endPointRolePermissions[endpoint];
        if(role == "owner"){
            return {
                c: 1,
                r: 1,
                u: 1,
                d: 1,
                x: 1,
                a: "hierarchy",
            } as iPermission;
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
        return this.getPermissions(roleName, endpoint);
    }
}
const RBAC = new RBACClass(); //singleton
export default RBAC;