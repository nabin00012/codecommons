"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    longDescription: {
        type: String,
        required: true,
        trim: true,
    },
    githubLink: {
        type: String,
        required: true,
        trim: true,
    },
    demoLink: {
        type: String,
        trim: true,
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    media: [
        {
            type: {
                type: String,
                enum: ["image", "video"],
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            caption: String,
        },
    ],
    screenshots: [
        {
            url: {
                type: String,
                required: true,
            },
            caption: String,
        },
    ],
    screenRecordings: [
        {
            url: {
                type: String,
                required: true,
            },
            caption: String,
        },
    ],
    author: {
        _id: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    stars: {
        type: Number,
        default: 0,
    },
    contributors: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            user: {
                _id: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                role: {
                    type: String,
                    required: true,
                },
            },
            content: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true,
});
const Project = mongoose_1.default.model("Project", projectSchema);
exports.default = Project;
