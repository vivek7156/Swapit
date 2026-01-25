import express from "express";
import College from "../models/college.model.js";

const router = express.Router();

// Add a new college
router.post("/colleges", async (req, res) => {
  try {
    const { name, location } = req.body;
    const college = new College({ name, location });
    await college.save();
    res.status(201).json(college);
  } catch (error) {
    res.status(500).json({ message: "Failed to create college", error });
  }
});

// Bulk add colleges
router.post("/colleges/bulk", async (req, res) => {
  try {
    const colleges = req.body; // Expecting an array of objects { name, location }
    if (!Array.isArray(colleges)) {
      return res.status(400).json({ message: "Input must be an array of colleges" });
    }
    const result = await College.insertMany(colleges);
    res.status(201).json({ message: "Colleges added successfully", count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to bulk add colleges", error });
  }
});

// Get all colleges
router.get("/colleges", async (req, res) => {
  try {
    const colleges = await College.find().populate("students");
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch colleges", error });
  }
});

// Get a single college by ID with students
router.get("/colleges/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id).populate("students");
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res.status(200).json(college);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch college", error });
  }
});

export default router;
