"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const classroom_1 = __importDefault(require("./routes/classroom"));
const auth_1 = __importDefault(require("./routes/auth"));
const assignment_1 = __importDefault(require("./routes/assignment"));
const submission_1 = __importDefault(require("./routes/submission"));
const course_1 = __importDefault(require("./routes/course"));
const discussionRoutes_1 = __importDefault(require("./routes/discussionRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const app = (0, express_1.default)();
// Serve static files from the uploads directory
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Assignment routes (file uploads) BEFORE express.json()
app.use("/api/assignments", assignment_1.default);
// Other routes that expect JSON
app.use(express_1.default.json());
app.use("/api/classrooms", classroom_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/submissions", submission_1.default);
app.use("/api/courses", course_1.default);
// Community routes
app.use("/api/discussions", discussionRoutes_1.default);
app.use("/api/events", eventRoutes_1.default);
app.use("/api/groups", groupRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
    });
});
exports.default = app;
