import { Router } from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }).lean();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ error: "Request body must be a JSON object." });
  }

  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid task ID." });
  }
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({ error: "Request body must be a JSON object." });
  }

  const updates = {};
  for (const field of ["title", "description", "completed"]) {
    if (Object.hasOwn(req.body, field)) {
      updates[field] = req.body[field];
    }
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Provide at least one field to update." });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Invalid task ID." });
  }

  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
