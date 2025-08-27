import { ProjectionType, QueryOptions } from "mongoose";
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";

/**
 * Creates a new user
 * @param data user data, without _id, createdAt, and updatedAt fields
 * @returns a new user object, without password and refreshToken
 */
export const createUser = async (
  data: Omit<IUser, "_id" | "createdAt" | "updatedAt">
) => {
  const result = await UserSchema.create(data);
  const { refreshToken, password, ...user } = result.toJSON();
  return user;
};


/**
 * Updates a user
 * @param id user id
 * @param data user data to update, without _id, createdAt, and updatedAt fields
 * @returns the updated user object, without password and refreshToken
 */
export const updateUser = async (id: string, data: IUser) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: "-password -refreshToken -facebookId",
  });
  return result;
};

/**
 * Updates a user, with a subset of fields
 * @param id user id
 * @param data user data to update, with only the fields that should be updated
 * @returns the updated user object, without password and refreshToken
 */
export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: "-password -refreshToken -facebookId",
  });
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await UserSchema.deleteOne(
    { _id: id },
    { select: "-password -refreshToken -facebookId" }
  );
  return result;
};

export const getUserById = async (
  id: string,
  projection?: ProjectionType<IUser>
) => {
  const result = await UserSchema.findById(id, projection).lean();
  return result;
};

/**
 * Gets all users
 * @param projection optional mongoose projection to select only some fields
 * @param options optional mongoose query options
 * @returns a list of user objects, without password and refreshToken fields
 */

export const getAllUser = async (
  projection?: ProjectionType<IUser>,
  options?: QueryOptions<IUser>
) => {
  const result = await UserSchema.find({}, projection, options).lean();
  return result;
};
/**
 * Finds a user by email
 * @param email the email to search for
 * @param projection optional mongoose projection to select only some fields
 * @returns the user object, without password and refreshToken fields, or null if not found
 */
export const getUserByEmail = async (
  email: string,
  projection?: ProjectionType<IUser>
) => {
  const result = await UserSchema.findOne({ email }, projection).lean();
  return result;
};

/**
 * Counts the total number of users in the database
 * @returns a promise that resolves with the number of users
 */
export const countItems = () => {
  return UserSchema.count();
};
