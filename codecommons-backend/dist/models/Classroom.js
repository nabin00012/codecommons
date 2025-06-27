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
const classroomSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please add a classroom name"],
        trim: true,
        maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [500, "Description cannot be more than 500 characters"],
    },
    code: {
        type: String,
        required: [true, "Please add a course code"],
        unique: true,
        trim: true,
    },
    semester: {
        type: String,
        required: [true, "Please add a semester"],
    },
    teacher: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    instructor: {
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "/placeholder.svg",
        },
        department: {
            type: String,
            required: true,
        },
    },
    students: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    materials: [
        {
            id: { type: String, required: true },
            title: { type: String, required: true },
            type: { type: String, required: true },
            size: { type: String, required: true },
            uploadedOn: { type: String, required: true },
            fileUrl: { type: String, required: true },
        },
    ],
}, {
    timestamps: true,
});
// Generate a unique course code before saving
classroomSchema.pre("save", async function (next) {
    if (!this.isNew) {
        return next();
    }
    // Generate a random 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.code = code;
    next();
});
exports.default = mongoose_1.default.model("Classroom", classroomSchema);
