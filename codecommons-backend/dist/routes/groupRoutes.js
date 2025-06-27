"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/", groupController_1.groupController.getAll);
router.get("/search", groupController_1.groupController.search);
router.get("/:id", groupController_1.groupController.getById);
// Protected routes
router.use(auth_1.protect);
router.get("/user/groups", groupController_1.groupController.getUserGroups);
router.post("/", groupController_1.groupController.create);
router.put("/:id", groupController_1.groupController.update);
router.delete("/:id", groupController_1.groupController.delete);
router.post("/:id/join", groupController_1.groupController.toggleMembership);
exports.default = router;
