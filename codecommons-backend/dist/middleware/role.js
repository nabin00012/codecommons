"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        }
        else {
            next({ status: 403, message: `Not authorized as a ${role}` });
        }
    };
};
exports.roleMiddleware = roleMiddleware;
