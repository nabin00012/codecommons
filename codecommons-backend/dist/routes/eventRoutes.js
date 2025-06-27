"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get("/", eventController_1.eventController.getAll);
router.get("/search", eventController_1.eventController.search);
router.get("/:id", eventController_1.eventController.getById);
// Protected routes
router.use(auth_1.protect);
router.post("/", eventController_1.eventController.create);
router.put("/:id", eventController_1.eventController.update);
router.delete("/:id", eventController_1.eventController.delete);
router.post("/:id/attend", eventController_1.eventController.toggleAttendance);
exports.default = router;
