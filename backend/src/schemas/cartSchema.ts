import { z } from 'zod';

export const addToCartSchema = z.object({
  menuItemId: z.number(),
  quantity: z.number().min(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().min(0),
}); 