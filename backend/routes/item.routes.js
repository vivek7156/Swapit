import express from 'express';
import {
    createItem,
    getItemsByCollege,
    getItemById,
    updateItem,
    deleteItem,
} from '../controllers/item.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();


router.post('/', protectRoute, createItem);
router.get('/college/:collegeId', getItemsByCollege);
router.get('/:itemId', getItemById);
router.put('/:itemId', protectRoute, updateItem);
router.delete('/:itemId', protectRoute, deleteItem);


export default router;
