import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000), // convierte de string a number
  GRAPHQL_PLAYGROUND: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
  GRAPHQL_DEBUG: z
    .string()
    .default('false')
    .transform((value) => value === 'true'),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(3306),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_TIMEZONE: z.string().default('Z'),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string()
})
