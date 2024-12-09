type iPermission = {
    c: number;
    r: number;
    u: number;
    d: number;
    x: number;
};
declare const accessRelationships: readonly ["root", "group", "user"];
type iAccessRelationship = typeof accessRelationships[number];
type iRoleRow = {
    id: string;
    gid: number;
};
declare class RBACClass {
    private whiteEndPointAccessRelationship;
    private endPointRolePermissions;
    private rolesTable;
    private gid2Name;
    private latestRoleKey;
    constructor();
    private getIncrementedRoleKey;
    hasRole(role: string): boolean;
    setRoleOnce(role: string): void;
    getRole(role: string): iPermission | iRoleRow;
    getRoleByGid(gid: number): iRoleRow;
    setEndpointAccessRelationship(endpoint: string, accessRelationship: iAccessRelationship): void;
    removeEndpointAccessRelationship(endpoint: string): void;
    getEndpointAccessRelationship(endpoint: string): "root" | "group" | "user";
    setPermission(role: string, endpoint: string, permission: iPermission): void;
    getPermission(role: string, endpoint: string): iPermission;
}
declare const RBAC: RBACClass;
export default RBAC;
