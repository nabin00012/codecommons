"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.teacherOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
            req.user = await User_1.default.findById(decoded.id).select("-password");
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
// Middleware to check if user is a teacher
const teacherOnly = async (req, res, next) => {
    if (req.user && req.user.role === "teacher") {
        next();
    }
    else {
        res.status(403).json({ message: "Not authorized as teacher" });
    }
};
exports.teacherOnly = teacherOnly;
// Middleware to check if user is authenticated (for POST /verify)
const auth = async (req, res, next) => {
    var _a;
    try {
        // Get token from header or cookie
        let token = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        console.log("Auth middleware - Token from header:", authHeader);
        console.log("Auth middleware - Token from cookie:", (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token);
        console.log("Auth middleware - Using token:", token);
        if (!token) {
            console.log("Auth middleware - No token provided");
            res.status(401).json({ success: false, message: "No token provided" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
            console.log("Auth middleware - Decoded token:", decoded);
            const user = await User_1.default.findById(decoded.id).select("-password");
            if (!user) {
                console.log("Auth middleware - User not found");
                res.status(401).json({ success: false, message: "User not found" });
                return;
            }
            console.log("Auth middleware - User found:", user.email);
            req.user = user;
            next();
        }
        catch (err) {
            console.log("Auth middleware - Token verification failed:", err);
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }
    }
    catch (error) {
        console.log("Auth middleware - Error:", error);
        res.status(401).json({ success: false, message: "Authentication failed" });
        return;
    }
};
exports.auth = auth;
