"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupController = void 0;
const Group_1 = require("../models/Group");
exports.groupController = {
    // Create a new group
    async create(req, res) {
        try {
            const { name, description, tags } = req.body;
            const creator = req.user._id;
            const group = await Group_1.Group.create({
                name,
                description,
                creator,
                members: [creator], // Creator is automatically a member
                tags,
                activityLevel: "low", // Default activity level
            });
            await group.populate("creator", "name department avatar");
            await group.populate("members", "name department avatar");
            res.status(201).json(group);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating group", error });
        }
    },
    // Get all groups with pagination
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const groups = await Group_1.Group.find()
                .populate("creator", "name department avatar")
                .populate("members", "name department avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await Group_1.Group.countDocuments();
            res.json({
                groups,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total,
            });
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching groups", error });
        }
    },
    // Get a single group by ID
    async getById(req, res) {
        try {
            const group = await Group_1.Group.findById(req.params.id)
                .populate("creator", "name department avatar")
                .populate("members", "name department avatar");
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
            res.json(group);
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching group", error });
        }
    },
    // Update a group
    async update(req, res) {
        try {
            const { name, description, tags } = req.body;
            const group = await Group_1.Group.findById(req.params.id);
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
            // Only creator can update the group
            if (group.creator.toString() !== req.user._id.toString()) {
                return res
                    .status(403)
                    .json({ message: "Not authorized to update this group" });
            }
            const updatedGroup = await Group_1.Group.findByIdAndUpdate(req.params.id, {
                name,
                description,
                tags,
            }, { new: true })
                .populate("creator", "name department avatar")
                .populate("members", "name department avatar");
            res.json(updatedGroup);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating group", error });
        }
    },
    // Delete a group
    async delete(req, res) {
        try {
            const group = await Group_1.Group.findById(req.params.id);
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
            // Only creator can delete the group
            if (group.creator.toString() !== req.user._id.toString()) {
                return res
                    .status(403)
                    .json({ message: "Not authorized to delete this group" });
            }
            await group.deleteOne();
            res.json({ message: "Group deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting group", error });
        }
    },
    // Join/Leave a group
    async toggleMembership(req, res) {
        try {
            const userId = req.user._id;
            const group = await Group_1.Group.findById(req.params.id);
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
            const isMember = group.members.includes(userId);
            if (isMember) {
                // Can't leave if you're the creator
                if (group.creator.toString() === userId.toString()) {
                    return res
                        .status(400)
                        .json({ message: "Creator cannot leave the group" });
                }
                group.members = group.members.filter((id) => id.toString() !== userId.toString());
            }
            else {
                group.members.push(userId);
            }
            await group.save();
            await group.populate("members", "name department avatar");
            res.json(group);
        }
        catch (error) {
            res.status(500).json({ message: "Error toggling membership", error });
        }
    },
    // Get groups for the current user
    async getUserGroups(req, res) {
        try {
            const userId = req.user._id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const groups = await Group_1.Group.find({ members: userId })
                .populate("creator", "name department avatar")
                .populate("members", "name department avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await Group_1.Group.countDocuments({ members: userId });
            res.json({
                groups,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total,
            });
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching user groups", error });
        }
    },
    // Search groups
    async search(req, res) {
        try {
            const { query, tags, activityLevel } = req.query;
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
            if (activityLevel) {
                searchQuery.activityLevel = activityLevel;
            }
            const groups = await Group_1.Group.find(searchQuery)
                .populate("creator", "name department avatar")
                .populate("members", "name department avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            const total = await Group_1.Group.countDocuments(searchQuery);
            res.json({
                groups,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total,
            });
        }
        catch (error) {
            res.status(500).json({ message: "Error searching groups", error });
        }
    },
};
