import express from 'express';
import {
    createItem,
    getItemsByCollege,
    getItemById,
    updateItem,
    deleteItem,
    searchItems,
    getItems,
} from '../controllers/item.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5 MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  });


router.post('/', upload.array('images'), protectRoute, createItem);
router.get('/getItems', getItems);
router.get('/college/:collegeId', getItemsByCollege);
router.get('/search', searchItems);
router.get('/:itemId', getItemById);
router.put('/:itemId', upload.array('images'), protectRoute, updateItem);
router.delete('/:itemId', protectRoute, deleteItem);



export default router;
