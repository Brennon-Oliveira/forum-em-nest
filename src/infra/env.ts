import { z } from "zod";

export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	PORT: z.coerce.number().optional().default(3333),
	JWT_PRIVATE_SECRET: z.string().base64(),
	JWT_PUBLIC_SECRET: z.string().base64(),
});

export type Env = z.infer<typeof envSchema>;
