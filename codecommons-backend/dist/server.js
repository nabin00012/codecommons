"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const course_1 = __importDefault(require("./routes/course"));
const assignment_1 = __importDefault(require("./routes/assignment"));
const submission_1 = __importDefault(require("./routes/submission"));
const classroom_1 = __importDefault(require("./routes/classroom"));
const codecorner_1 = __importDefault(require("./routes/codecorner"));
const discussionRoutes_1 = __importDefault(require("./routes/discussionRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const projects_1 = __importDefault(require("./routes/projects"));
// Load environment variables
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: [
        process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
        "https://codecommons-delta.vercel.app",
        "https://codecommons.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
    ],
    exposedHeaders: ["Authorization"],
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);
    next();
});
// Connect to MongoDB
(0, db_1.default)();
// Basic route for testing
app.get("/", (req, res) => {
    res.json({ message: "Welcome to CodeCommons API" });
});
// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/courses", course_1.default);
app.use("/api/classrooms/:classroomId/assignments", assignment_1.default);
app.use("/api/submissions", submission_1.default);
app.use("/api/classrooms", classroom_1.default);
app.use("/api/codecorner", codecorner_1.default);
app.use("/api/discussions", discussionRoutes_1.default);
app.use("/api/events", eventRoutes_1.default);
app.use("/api/groups", groupRoutes_1.default);
app.use("/api/projects", projects_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({
        message: "Internal server error",
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});
// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
