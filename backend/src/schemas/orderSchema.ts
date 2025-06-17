import { z } from 'zod';

export const orderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        quantity: z.number().min(1),
        price: z.number().min(0),
      })
    ),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
  }),
}); 