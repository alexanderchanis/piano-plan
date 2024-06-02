import { z } from "zod";

export const AuthCredentialsValidator = z.object({
    email: z
        .string()
        .email()
        .max(255, {
            message: "Email exceeds maximum length of 255 characters."
        }),
    password: z
        .string()
        .min(8, {
            message: "Password must be at least 8 characters long.",
        })
        .max(255, {
            message: "Password exceeds maximum length of 255 characters."
        })
})

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>