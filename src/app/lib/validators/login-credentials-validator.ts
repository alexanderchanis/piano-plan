import { z } from "zod";

export const LoginCredentialsValidator = z.object({
    email: z.string(),
    password: z.string()
})

export type TLoginCredentialsValidator = z.infer<typeof LoginCredentialsValidator>