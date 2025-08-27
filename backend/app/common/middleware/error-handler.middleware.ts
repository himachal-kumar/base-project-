import { type ErrorRequestHandler } from "express";
import { type ErrorResponse } from "../helper/response.hepler";

/**
 * Handles all errors that occur during the express.js request response cycle.
 * The error object is expected to have a `status` property that is a number,
 * and a `message` property that is a string. The `data` property is optional and can be any type.
 * If the error object does not have these properties, default values are used.
 * The error object is then sent as the response, with the `error_code` as the status code.
 * The `next` function is called, but it is not expected to do anything.
 * @param err - The error object.
 * @param req - The express.js request object.
 * @param res - The express.js response object.
 * @param next - The express.js next function.
 */
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const response: ErrorResponse = {
    success: false,
    error_code: (err?.status ?? 500) as number,
    message: (err?.message ?? "Something went wrong!") as string,
    data: err?.data ?? {},
  };

  res.status(response.error_code).send(response);
  next();
};

export default errorHandler;
