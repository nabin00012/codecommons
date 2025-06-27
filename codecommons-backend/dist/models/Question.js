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
exports.Answer = exports.Question = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define the answer schema as a separate collection
const AnswerSchema = new mongoose_1.Schema({
    content: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: mongoose_1.Schema.Types.ObjectId, ref: "Question", required: true },
    createdAt: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 },
    isAccepted: { type: Boolean, default: false },
});
const QuestionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    language: { type: String },
    tags: [{ type: String }],
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    isSolved: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Add virtual for answers
QuestionSchema.virtual("answers", {
    ref: "Answer",
    localField: "_id",
    foreignField: "question",
    justOne: false,
});
// Add pre-find middleware to ensure proper population
QuestionSchema.pre("find", function () {
    this.populate("author", "name role semester department email");
});
QuestionSchema.pre("findOne", function () {
    this.populate("author", "name role semester department email");
});
// Add pre-find middleware for answers
QuestionSchema.pre("find", function () {
    this.populate({
        path: "answers",
        populate: {
            path: "author",
            select: "name role semester department email",
        },
    });
});
QuestionSchema.pre("findOne", function () {
    this.populate({
        path: "answers",
        populate: {
            path: "author",
            select: "name role semester department email",
        },
    });
});
const Question = mongoose_1.default.model("Question", QuestionSchema);
exports.Question = Question;
const Answer = mongoose_1.default.model("Answer", AnswerSchema);
exports.Answer = Answer;
exports.default = Question;
