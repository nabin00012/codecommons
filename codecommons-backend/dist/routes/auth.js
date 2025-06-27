"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const asyncHandler_1 = require("../utils/asyncHandler");
const router = express_1.default.Router();
// Public routes
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/verify", (0, asyncHandler_1.asyncHandler)(auth_1.auth), (0, asyncHandler_1.asyncHandler)(authController_1.verifyTokenPost));
// Protected routes
router.get("/verify", auth_1.protect, authController_1.verifyToken);
router.get("/me", auth_1.protect, authController_1.getCurrentUser);
exports.default = router;
