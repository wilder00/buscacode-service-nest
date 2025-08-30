import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000), // convierte de string a number
  GRAPHQL_PLAYGROUND: z.coerce.boolean().default(false) // convierte "true"/"false" a boolean
})
