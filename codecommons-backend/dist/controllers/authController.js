"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenPost = exports.getCurrentUser = exports.verifyToken = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("../utils/email");
const crypto_1 = __importDefault(require("crypto"));
// Generate JWT Token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "30d",
    });
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        console.log("Register request received:", req.body);
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            console.log("User already exists:", email);
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Create new user
        console.log("Creating new user:", { name, email, role });
        const user = await User_1.default.create({
            name,
            email,
            password,
            role: role || "student",
        });
        // Generate token
        const token = generateToken(user._id.toString());
        console.log("Token generated for user:", user._id);
        // Set token as HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
        return;
    }
    catch (error) {
        console.error("Registration error:", error);
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        res.status(500).json({ message: errorMessage });
        return;
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        console.log("Login request received:", req.body);
        const { email, password } = req.body;
        // Find user and explicitly select password field
        const user = await User_1.default.findOne({ email }).select("+password");
        if (!user) {
            console.log("User not found:", email);
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log("Invalid password for user:", email);
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        // Generate token
        const token = generateToken(user._id.toString());
        console.log("Token generated for user:", user._id);
        // Set token as HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
        return;
    }
    catch (error) {
        console.error("Login error:", error);
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        res.status(500).json({ message: errorMessage });
        return;
    }
};
exports.login = login;
// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Generate reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();
        // Send reset email
        if (user.email) {
            await (0, email_1.sendPasswordResetEmail)(user.email, resetToken);
        }
        res.json({ message: "Password reset email sent" });
        return;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        res.status(500).json({ message: errorMessage });
        return;
    }
};
exports.forgotPassword = forgotPassword;
// @desc    Reset password
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { resetToken } = req.params;
        const { password } = req.body;
        // Hash token
        const resetPasswordToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        // Find user by token and check if token is expired
        const user = await User_1.default.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.json({ message: "Password reset successful" });
        return;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        res.status(500).json({ message: errorMessage });
        return;
    }
};
exports.resetPassword = resetPassword;
// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res, next) => {
    try {
        console.log("Verify token request received");
        console.log("Auth header:", req.headers.authorization);
        console.log("User from request:", req.user);
        // The user is already attached to the request by the protect middleware
        if (!req.user) {
            console.log("No user found in request");
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        console.log("Token verified successfully for user:", req.user._id);
        res.json({
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            },
        });
        return;
    }
    catch (error) {
        next(error);
        return;
    }
};
exports.verifyToken = verifyToken;
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        res.json({
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            },
        });
        return;
    }
    catch (error) {
        next(error);
        return;
    }
};
exports.getCurrentUser = getCurrentUser;
// @desc    Verify token (POST version for frontend)
// @route   POST /api/auth/verify
// @access  Public
const verifyTokenPost = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token = null;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        console.log("verifyTokenPost: using token =", token);
        if (!token) {
            console.log("verifyTokenPost: No token provided");
            res.status(401).json({ success: false, message: "No token provided" });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
            console.log("verifyTokenPost: Decoded token:", decoded);
            const user = await User_1.default.findById(decoded.id).select("-password");
            if (!user) {
                console.log("verifyTokenPost: User not found");
                res.status(401).json({ success: false, message: "User not found" });
                return;
            }
            console.log("verifyTokenPost: User found:", user.email);
            res.json({ success: true, user });
        }
        catch (err) {
            console.log("verifyTokenPost: jwt.verify failed:", err);
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }
    }
    catch (error) {
        console.log("verifyTokenPost: Error:", error);
        res.status(401).json({ success: false, message: "Authentication failed" });
        return;
    }
};
exports.verifyTokenPost = verifyTokenPost;
