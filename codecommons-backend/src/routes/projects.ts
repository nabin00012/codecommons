import express from "express";
import { protect } from "../middleware/auth";
import Project from "../models/Project";
import { Response } from "express";

interface AuthRequest extends express.Request {
  user?: any;
}

const router = express.Router();

// Get all projects
router.get(
  "/",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const projects = await Project.find({
        $or: [
          { "author._id": req.user._id }, // User's own projects
          { isPublic: true }, // Public projects
        ],
      }).sort({ createdAt: -1 });
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get a specific project
router.get(
  "/:id",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Create a new project
router.post(
  "/",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        title,
        description,
        longDescription,
        githubLink,
        demoLink,
        tags,
        media,
        screenshots,
        screenRecordings,
      } = req.body;

      if (!title || !description || !longDescription || !githubLink) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const project = await Project.create({
        title,
        description,
        longDescription,
        githubLink,
        demoLink,
        tags: tags || [],
        media: media || [],
        screenshots: screenshots || [],
        screenRecordings: screenRecordings || [],
        author: {
          _id: req.user._id,
          name: req.user.name,
          role: req.user.role,
        },
      });

      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update a project
router.put(
  "/:id",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      // Check if user is the author
      if (!project.author || project.author._id.toString() !== req.user._id) {
        res
          .status(403)
          .json({ error: "Not authorized to update this project" });
        return;
      }

      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );

      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete a project
router.delete(
  "/:id",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      // Check if user is the author
      if (!project.author || project.author._id.toString() !== req.user._id) {
        res
          .status(403)
          .json({ error: "Not authorized to delete this project" });
        return;
      }

      await Project.findByIdAndDelete(req.params.id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
