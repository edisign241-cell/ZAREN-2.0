import { z } from 'zod';

export const productCreationSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Le titre doit comporter au moins 3 caractères' })
    .max(200, { message: 'Le titre ne peut excéder 200 caractères' }),
  description: z
    .string()
    .min(5, { message: 'La description doit comporter au moins 5 caractères' }),
  price: z
    .number()
    .min(100, { message: 'Le prix minimum est de 100 FCFA' }),
  currency: z
    .string()
    .default('FCFA'),
  category: z
    .string()
    .default('Général'),
  condition: z
    .string()
    .optional(),
  size: z
    .string()
    .optional(),
  stockQuantity: z
    .number()
    .int()
    .min(1, { message: 'Le stock doit être au minimum de 1' })
    .default(1),
  images: z
    .array(z.string())
    .min(1, { message: 'Veuillez ajouter au moins une photo' }),
  city: z
    .string()
    .min(2, { message: 'La ville est requise' }),
  district: z
    .string()
    .optional(),
  deliveryFee: z
    .number()
    .min(0)
    .default(0),
  pickupAvailable: z
    .boolean()
    .default(true),
  accountTier: z
    .enum(['STANDARD', 'PRO'])
    .default('STANDARD'),
});

export type ProductCreationInput = z.infer<typeof productCreationSchema>;

export const publicationPaymentSchema = z.object({
  productId: z.string(),
  amount: z.number().default(500),
  currency: z.string().default('FCFA'),
  paymentMethod: z.enum(['AIRTEL_MONEY', 'MOOV_MONEY', 'CARD']),
  phoneNumber: z.string().min(8, { message: 'Numéro de téléphone requis' }),
});

export type PublicationPaymentInput = z.infer<typeof publicationPaymentSchema>;
