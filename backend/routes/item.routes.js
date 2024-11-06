import express from 'express';
import {
    createItem,
    getItemsByCollege,
    getItemById,
    updateItem,
    deleteItem,
    searchItems,
} from '../controllers/item.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();


router.post('/', protectRoute, createItem);
router.get('/college/:collegeId', getItemsByCollege);
router.get('/search', searchItems);
router.get('/:itemId', getItemById);
router.put('/:itemId', protectRoute, updateItem);
router.delete('/:itemId', protectRoute, deleteItem);



export default router;
