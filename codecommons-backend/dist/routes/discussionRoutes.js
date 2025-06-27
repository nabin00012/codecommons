"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discussionController_1 = require("../controllers/discussionController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/", discussionController_1.discussionController.getAll);
router.get("/search", discussionController_1.discussionController.search);
router.get("/:id", discussionController_1.discussionController.getById);
// Protected routes
router.use(auth_1.auth);
router.post("/", discussionController_1.discussionController.create);
router.post("/:id/comments", discussionController_1.discussionController.addComment);
router.post("/:id/like", discussionController_1.discussionController.toggleLike);
exports.default = router;
