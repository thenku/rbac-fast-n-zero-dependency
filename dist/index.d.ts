declare const storageContexts: readonly ["root", "group", "user"];
type iStorageContext = typeof storageContexts[number];
declare const accessSelectors: readonly ["uid2id", "uid2uid", "gid2gid", "table", "hierarchy"];
type iAccessSelector = typeof accessSelectors[number];
type iPermission = {
    c: number;
    r: number;
    u: number;
    d: number;
    x: number;
    a: iAccessSelector;
};
type iRoleName = string;
declare class RBACClass {
    private endPointStorageContexts;
    private endPointRolePermissions;
    private rolesTable;
    private gid2Name;
    private latestRoleKey;
    constructor();
    private getIncrementedRoleKey;
    hasRole(role: string): boolean;
    setRoleOnce(role: string): void;
    getGidOfRoleName(roleName: string): number;
    getRoleNameOfGid(gid: number): string;
    setEndpointStorageContext(endpoint: string, storageContext: iStorageContext): void;
    getEndpointStorageContext(endpoint: string): "root" | "group" | "user";
    removeEndpointAccess(endpoint: string): void;
    setPermissions(role: iRoleName, endpoint: string, permission: iPermission): void;
    getPermissions(role: iRoleName, endpoint: string): iPermission;
    getPermissionByGid(gid: number, endpoint: string): iPermission;
}
declare const RBAC: RBACClass;
export default RBAC;
