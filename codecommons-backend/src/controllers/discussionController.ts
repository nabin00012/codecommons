import { Request, Response } from "express";
import { Discussion } from "../models/Discussion";

export const discussionController = {
  // Create a new discussion
  async create(req: Request, res: Response) {
    try {
      const { title, content, tags } = req.body;
      const author = req.user._id; // Assuming auth middleware sets user

      const discussion = await Discussion.create({
        title,
        content,
        author,
        tags,
      });

      await discussion.populate("author", "name department avatar");
      res.status(201).json(discussion);
    } catch (error) {
      res.status(500).json({ message: "Error creating discussion", error });
    }
  },

  // Get all discussions with pagination
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const discussions = await Discussion.find()
        .populate("author", "name department avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Discussion.countDocuments();

      res.json({
        discussions,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching discussions", error });
    }
  },

  // Get a single discussion by ID
  async getById(req: Request, res: Response) {
    try {
      const discussion = await Discussion.findById(req.params.id)
        .populate("author", "name department avatar")
        .populate("comments.author", "name department avatar");

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      res.json(discussion);
    } catch (error) {
      res.status(500).json({ message: "Error fetching discussion", error });
    }
  },

  // Add a comment to a discussion
  async addComment(req: Request, res: Response) {
    try {
      const { content } = req.body;
      const author = req.user._id;

      const discussion = await Discussion.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            comments: {
              content,
              author,
            },
          },
        },
        { new: true }
      ).populate("comments.author", "name department avatar");

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      res.json(discussion);
    } catch (error) {
      res.status(500).json({ message: "Error adding comment", error });
    }
  },

  // Like/Unlike a discussion
  async toggleLike(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const discussion = await Discussion.findById(req.params.id);

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      const isLiked = discussion.likes.includes(userId);

      if (isLiked) {
        discussion.likes = discussion.likes.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        discussion.likes.push(userId);
      }

      await discussion.save();
      res.json(discussion);
    } catch (error) {
      res.status(500).json({ message: "Error toggling like", error });
    }
  },

  // Search discussions
  async search(req: Request, res: Response) {
    try {
      const { query, tags } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      let searchQuery: any = {};

      if (query) {
        searchQuery.$text = { $search: query as string };
      }

      if (tags) {
        searchQuery.tags = { $in: (tags as string).split(",") };
      }

      const discussions = await Discussion.find(searchQuery)
        .populate("author", "name department avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Discussion.countDocuments(searchQuery);

      res.json({
        discussions,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      });
    } catch (error) {
      res.status(500).json({ message: "Error searching discussions", error });
    }
  },
};
