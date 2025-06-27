"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submissionController_1 = require("../controllers/submissionController");
const auth_1 = require("../middleware/auth");
const role_1 = require("../middleware/role");
const router = express_1.default.Router();
// Only students can create submissions
router.post("/", auth_1.protect, (0, role_1.roleMiddleware)("student"), submissionController_1.createSubmission);
// Anyone can view submissions
router.get("/", submissionController_1.getSubmissions);
router.get("/:id", submissionController_1.getSubmissionById);
// Only teachers can update (grade) or delete submissions
router.put("/:id", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), submissionController_1.updateSubmission);
router.delete("/:id", auth_1.protect, (0, role_1.roleMiddleware)("teacher"), submissionController_1.deleteSubmission);
exports.default = router;
