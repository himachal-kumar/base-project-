"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const errorHandler = (err, req, res, next) => {
    var _a, _b, _c;
    const response = {
        success: false,
        error_code: ((_a = err === null || err === void 0 ? void 0 : err.status) !== null && _a !== void 0 ? _a : 500),
        message: ((_b = err === null || err === void 0 ? void 0 : err.message) !== null && _b !== void 0 ? _b : "Something went wrong!"),
        data: (_c = err === null || err === void 0 ? void 0 : err.data) !== null && _c !== void 0 ? _c : {},
    };
    res.status(response.error_code).send(response);
    next();
};
exports.default = errorHandler;
