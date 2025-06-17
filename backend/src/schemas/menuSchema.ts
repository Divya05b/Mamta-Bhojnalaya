import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().optional(),
  isAvailable: z.boolean().default(true),
});

export const menuItemUpdateSchema = menuItemSchema.partial(); 