import { Request, Response } from 'express';
import prisma from '../prisma';



// Get all items with filtering, sorting, and pagination
export const getItems = async (req: Request, res: Response) => {
  try {
    const {
      q = '',
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = '1',
      limit = '10',
    } = req.query;

    // Parse pagination params
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter conditions
    const where: any = {};

    // Search by name or description
    if (q) {
      where.OR = [
        { name: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (category) {
      where.category = category as string;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      
      if (minPrice) {
        where.price.gte = parseFloat(minPrice as string);
      }
      
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice as string);
      }
    }

    // Determine sort order
    let orderBy: any = {};
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Get items with pagination
    const items = await prisma.item.findMany({
      where,
      orderBy,
      skip,
      take: limitNumber,
    });

    // Get total count for pagination
    const totalItems = await prisma.item.count({ where });
    const totalPages = Math.ceil(totalItems / limitNumber);

    return res.status(200).json({
      items,
      pagination: {
        total: totalItems,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get items error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get item by ID
export const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error('Get item by ID error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create new item
export const createItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Validate input
    if (!name || !description || !price || !category || !image || stock === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const item = await prisma.item.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        stock: parseInt(stock, 10),
      },
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, stock } = req.body;

    // Check if item exists
    const existingItem = await prisma.item.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update item
    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name: name || existingItem.name,
        description: description || existingItem.description,
        price: price ? parseFloat(price) : existingItem.price,
        category: category || existingItem.category,
        image: image || existingItem.image,
        stock: stock !== undefined ? parseInt(stock, 10) : existingItem.stock,
      },
    });

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Update item error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const existingItem = await prisma.item.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete item
    await prisma.item.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};