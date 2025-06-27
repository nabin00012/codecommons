"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discussionController = void 0;
const Discussion_1 = require("../models/Discussion");
exports.discussionController = {
    // Create a new discussion
    async create(req, res) {
        try {
            const { title, content, tags } = req.body;
            const author = req.user._id; // Assuming auth middleware sets user
            const discussion = await Discussion_1.Discussion.create({
                title,
                content,
                author,
                tags,
            });
            await discussion.populate("author", "name department avatar");
            res.status(201).json(discussion);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating discussion", error });
        }
    },
    // Get all discussions with pagination
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const discussions = await Discussion_1.Discussion.find()
                .populate("author", "name department avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await Discussion_1.Discussion.countDocuments();
            res.json({
                discussions,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total,
            });
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching discussions", error });
        }
    },
    // Get a single discussion by ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Discussion ID is required" });
            }
            const discussion = await Discussion_1.Discussion.findById(id)
                .populate("author", "name department avatar")
                .populate("comments.author", "name department avatar");
            if (!discussion) {
                return res.status(404).json({ message: "Discussion not found" });
            }
            res.json(discussion);
        }
        catch (error) {
            console.error("Error fetching discussion:", error);
            res.status(500).json({
                message: "Error fetching discussion",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },
    // Add a comment to a discussion
    async addComment(req, res) {
        var _a;
        try {
            const { id } = req.params;
            const { content } = req.body;
            const author = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!id) {
                return res.status(400).json({ message: "Discussion ID is required" });
            }
            if (!content || typeof content !== "string") {
                return res
                    .status(400)
                    .json({ message: "Valid comment content is required" });
            }
            if (!author) {
                return res
                    .status(401)
                    .json({ message: "User authentication required" });
            }
            const discussion = await Discussion_1.Discussion.findByIdAndUpdate(id, {
                $push: {
                    comments: {
                        content,
                        author,
                    },
                },
            }, { new: true }).populate("comments.author", "name department avatar");
            if (!discussion) {
                return res.status(404).json({ message: "Discussion not found" });
            }
            res.json(discussion);
        }
        catch (error) {
            console.error("Error adding comment:", error);
            res.status(500).json({
                message: "Error adding comment",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    },
    // Like/Unlike a discussion
    async toggleLike(req, res) {
        try {
            const userId = req.user._id;
            const discussion = await Discussion_1.Discussion.findById(req.params.id);
            if (!discussion) {
                return res.status(404).json({ message: "Discussion not found" });
            }
            const isLiked = discussion.likes.includes(userId);
            if (isLiked) {
                discussion.likes = discussion.likes.filter((id) => id.toString() !== userId.toString());
            }
            else {
                discussion.likes.push(userId);
            }
            await discussion.save();
            res.json(discussion);
        }
        catch (error) {
            res.status(500).json({ message: "Error toggling like", error });
        }
    },
    // Search discussions
    async search(req, res) {
        try {
            const { query, tags } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            let searchQuery = {};
            if (query) {
                searchQuery.$text = { $search: query };
            }
            if (tags) {
                searchQuery.tags = { $in: tags.split(",") };
            }
            const discussions = await Discussion_1.Discussion.find(searchQuery)
                .populate("author", "name department avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await Discussion_1.Discussion.countDocuments(searchQuery);
            res.json({
                discussions,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total,
            });
        }
        catch (error) {
            res.status(500).json({ message: "Error searching discussions", error });
        }
    },
};
