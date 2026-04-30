import { Router, Request, Response, NextFunction } from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../services/itemService';
import {
  createItemBodySchema,
  updateItemBodySchema,
  itemIdParamsSchema,
  parseBody,
  parseParams,
} from '../schemas/itemSchemas';
import { uploadItemImage, getFileUrl } from '../utils/fileUpload';
import { deleteImageFile } from '../utils/fileUpload';

const router = Router();

// Move asyncHandler above all usages
const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// GET all items
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await getAllItems();
    res.status(200).json({
      message: 'Items fetched successfully',
      data: items,
    });
  })
);

// GET item by id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const params = parseParams(itemIdParamsSchema, req.params);
    const item = await getItemById(params.id);
    
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    
    res.status(200).json({
      message: 'Item fetched successfully',
      data: item,
    });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = parseBody(createItemBodySchema, req.body);
    const createdItem = await createItem(body);

    res.status(201).json({
      message: 'Item created successfully',
      data: createdItem,
    });
  })
);

// POST /upload-image - Upload item image
router.post(
  '/upload-image',
  uploadItemImage.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const imageUrl = getFileUrl(req.file.filename);

    res.status(200).json({
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        url: imageUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  })
);

// POST /upload-images - Upload multiple item images
router.post(
  '/upload-images',
  uploadItemImage.array('images', 5), // Max 5 images
  asyncHandler(async (req, res) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ message: 'No image files provided' });
      return;
    }

    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      url: getFileUrl(file.filename),
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.status(200).json({
      message: 'Images uploaded successfully',
      data: uploadedFiles,
    });
  })
);

// DELETE /delete-image - Delete an item image
router.delete(
  '/delete-image',
  asyncHandler(async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl || typeof imageUrl !== 'string') {
      res.status(400).json({ message: 'Image URL is required' });
      return;
    }

    // Extract filename from URL (e.g., /uploads/items/filename.jpg -> filename.jpg)
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    if (!filename) {
      res.status(400).json({ message: 'Invalid image URL' });
      return;
    }

    try {
      deleteImageFile(filename);
      res.status(200).json({
        message: 'Image deleted successfully',
        data: { imageUrl },
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete image',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const params = parseParams(itemIdParamsSchema, req.params);
    const body = parseBody(updateItemBodySchema, req.body);

    const updatedItem = await updateItem(params.id, body);
    if (!updatedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.status(200).json({
      message: 'Item updated successfully',
      data: updatedItem,
    });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const params = parseParams(itemIdParamsSchema, req.params);

    const deletedItem = await deleteItem(params.id);
    if (!deletedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.status(200).json({
      message: 'Item deleted successfully',
      data: deletedItem,
    });
  })
);

export default router;
