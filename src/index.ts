//permission type
type iPermission = {
    c: number,
    r: number,
    u: number,
    d: number,
    x: number,
}
type iAccessRelationship = "root" | "group" | "user";
type iAccessRow = Record<iAccessRelationship, iPermission>;

type iRoleRow = {id:string, gid:number, parent?:string};
const defaultRoles: Record<string, iRoleRow> = {
    guest: {id: "guest", gid:0},
    owner: {id: "owner", gid:1},
    admin: {id: "admin", gid:2}, //manages roles as tech support but isn't the responsible data controller and/or processor or company owner

    contributor: {id: "contributor", gid:3},
    reader: {id: "reader", gid:4},

    registered: {id: "registered", gid:1000},
}

class RBAC {
    private whiteEndpoints: Record<string, iAccessRow> = {}; //only explicitly defined endpoints are allowed for access
    
    private endPointRolePermission: Record<string, iAccessRelationship> = {};

    private endPointAccessRelationship: Record<string, iAccessRelationship> = {};

    private rolesTable: {[roleName in string]: iRoleRow} = defaultRoles; //roles are types of groups
    private gid2Name: {[gidStr in string]: string} = {};
    private latestRoleKey: number = 0;

    constructor(){
        //set basic groups
        this.setRoleOnce("guest");
        this.setRoleOnce("admin");
        this.setRoleOnce("registered");
    }
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
        return this.roleNamesMap[role] != undefined ? true : false;
    }

    setRoleOnce(role: string, parentRole: string = "") {
        const roleExists = this.hasRole(role);
        if(!roleExists){
            const gid = this.getIncrementedRoleKey();
            this.rolesTable[role] = {id: role, gid: gid, parent: parentRole};
        }
    }
    addRoleToEndpoint(role: string, endpoint: string) {
        
    }
    addGroupName(){

    }

    allowEndpoint(endpoint: string, accessRelationship: iAccessRelationship) {
        this.whiteEndpoints[endpoint] = accessRelationship;
    }
    removeEndpoint(endpoint: string) {
        delete this.whiteEndpoints[endpoint];
    }
    // addPermission(role: string, permission: string) {
    //     if (!this.table[role]) {
    //         this.table[role] = [];
    //     }
    //     this.table[role].push(permission);
    // }
    getPermission(role:string, endpoint:string){
        

    }
}
const RBACSingleton = new RBAC();
export default RBACSingleton;