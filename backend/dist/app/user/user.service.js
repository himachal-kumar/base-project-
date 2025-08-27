"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countItems = exports.getUserByEmail = exports.getAllUser = exports.getUserById = exports.deleteUser = exports.editUser = exports.updateUser = exports.createUser = void 0;
const user_schema_1 = __importDefault(require("./user.schema"));
/**
 * Creates a new user
 * @param data user data, without _id, createdAt, and updatedAt fields
 * @returns a new user object, without password and refreshToken
 */
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.create(data);
    const _a = result.toJSON(), { refreshToken, password } = _a, user = __rest(_a, ["refreshToken", "password"]);
    return user;
});
exports.createUser = createUser;
/**
 * Updates a user
 * @param id user id
 * @param data user data to update, without _id, createdAt, and updatedAt fields
 * @returns the updated user object, without password and refreshToken
 */
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.findOneAndUpdate({ _id: id }, data, {
        new: true,
        select: "-password -refreshToken -facebookId",
    });
    return result;
});
exports.updateUser = updateUser;
/**
 * Updates a user, with a subset of fields
 * @param id user id
 * @param data user data to update, with only the fields that should be updated
 * @returns the updated user object, without password and refreshToken
 */
const editUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.findOneAndUpdate({ _id: id }, data, {
        new: true,
        select: "-password -refreshToken -facebookId",
    });
    return result;
});
exports.editUser = editUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.deleteOne({ _id: id }, { select: "-password -refreshToken -facebookId" });
    return result;
});
exports.deleteUser = deleteUser;
const getUserById = (id, projection) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.findById(id, projection).lean();
    return result;
});
exports.getUserById = getUserById;
/**
 * Gets all users
 * @param projection optional mongoose projection to select only some fields
 * @param options optional mongoose query options
 * @returns a list of user objects, without password and refreshToken fields
 */
const getAllUser = (projection, options) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.find({}, projection, options).lean();
    return result;
});
exports.getAllUser = getAllUser;
/**
 * Finds a user by email
 * @param email the email to search for
 * @param projection optional mongoose projection to select only some fields
 * @returns the user object, without password and refreshToken fields, or null if not found
 */
const getUserByEmail = (email, projection) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_schema_1.default.findOne({ email }, projection).lean();
    return result;
});
exports.getUserByEmail = getUserByEmail;
/**
 * Counts the total number of users in the database
 * @returns a promise that resolves with the number of users
 */
const countItems = () => {
    return user_schema_1.default.count();
};
exports.countItems = countItems;
