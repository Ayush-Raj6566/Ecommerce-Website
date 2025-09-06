import { Request, Response } from 'express';
import prisma from '../prisma';



// Get user's cart items
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        item: true,
      },
    });

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId, qty } = req.body;

    if (!itemId || !qty || qty < 1) {
      return res.status(400).json({ message: 'Item ID and quantity are required' });
    }

    // Check if item exists
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if item is in stock
    if (item.stock < qty) {
      return res.status(400).json({ message: 'Not enough items in stock' });
    }

    // Check if item is already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity if item already in cart
      cartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          qty: existingCartItem.qty + qty,
        },
        include: {
          item: true,
        },
      });
    } else {
      // Add new item to cart
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          itemId,
          qty,
        },
        include: {
          item: true,
        },
      });
    }

    return res.status(200).json(cartItem);
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    // Check if item is in cart
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove item from cart
    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId, qty } = req.body;

    if (!itemId || !qty || qty < 1) {
      return res.status(400).json({ message: 'Item ID and quantity are required' });
    }

    // Check if item is in cart
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check if item exists and has enough stock
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.stock < qty) {
      return res.status(400).json({ message: 'Not enough items in stock' });
    }

    // Update cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        qty,
      },
      include: {
        item: true,
      },
    });

    return res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error('Update cart item error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Delete all cart items for user
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};