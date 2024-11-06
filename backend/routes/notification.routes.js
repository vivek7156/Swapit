import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteAllNotifications, deleteNotification, getAllNotifications, markAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllNotifications);
router.patch("/:id/read", protectRoute, markAsRead);
router.delete("/:id", protectRoute, deleteNotification);
router.delete("/", protectRoute, deleteAllNotifications);

export default router;