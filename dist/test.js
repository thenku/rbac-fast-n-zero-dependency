"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index")); //import the global singleton
// Add non-default roles / groups
index_1.default.setRoleOnce('vendors');
index_1.default.setRoleOnce('employees');
//choose an endpoint
const endpoint1 = "/users";
// enable endpoints by adding an owner-type OR access-relationship for the endpoint 
index_1.default.setEndpointStorageContext(endpoint1, "root"); //"root" | "group" | "user"
// whitelist permissions per endpoint per role and define a selector a: "grant" | "mng" | "gid" | "uid" for related entries
index_1.default.setPermissions("registered", endpoint1, { c: 1, r: 1, u: 1, d: 1, x: 1, a: "uid2id" });
// getPermissions
index_1.default.getPermissions("owner", endpoint1); //owner always has all permissions if the endpoint was enabled
const gid = index_1.default.getGidOfRoleName("registered");
const permissions = index_1.default.getPermissions(index_1.default.getRoleNameOfGid(gid), endpoint1); //registered role permissions
// get multi-tenant options
const storageContext = index_1.default.getEndpointStorageContext(endpoint1); //where to find the data-hierarchy of the endpoint
// const canGrantAndManageEndpointData = (permissions.a  == "grant") ? true : false;
// const canManageEndpointData = (permissions.a  == "mng") ? true : false;
// const mustFilterAccessByUID = (permissions.a == "uid") ? true : false;
// const mustFilterAccessByGID = (permissions.a  == "gid") ? true : false;
