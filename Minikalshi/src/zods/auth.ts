import z from "zod";

export const signupSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." })
});

export const signinSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const onrampSchema = z.object({
    amount: z.number().int().positive(),
})