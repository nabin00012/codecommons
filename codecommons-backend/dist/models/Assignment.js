"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const assignmentSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
        trim: true,
        maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    dueDate: {
        type: Date,
        required: [true, "Please add a due date"],
    },
    submissionType: {
        type: String,
        enum: ["code", "file", "text"],
        required: [true, "Please specify submission type"],
        default: "file",
    },
    codeTemplate: {
        type: String,
        default: "",
    },
    classroom: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
    },
    submissions: [
        {
            student: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            submittedAt: {
                type: Date,
                default: Date.now,
            },
            status: {
                type: String,
                enum: ["submitted", "graded"],
                default: "submitted",
            },
            grade: {
                type: Number,
                min: 0,
                max: 100,
            },
            feedback: {
                type: String,
                maxlength: [500, "Feedback cannot be more than 500 characters"],
            },
            content: {
                type: String,
                default: "",
            },
            fileUrl: {
                type: String,
                default: "",
            },
            fileType: {
                type: String,
                default: "",
            },
            fileSize: {
                type: String,
                default: "",
            },
        },
    ],
    questions: [
        {
            student: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            question: {
                type: String,
                required: true,
            },
            answers: [
                {
                    user: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                    answer: {
                        type: String,
                        required: true,
                    },
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Assignment", assignmentSchema);
