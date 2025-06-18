import {z} from "zod";


export const CreateUserSchema = z.object({
    userName: z.string(),
    password: z.string().min(3),
    email: z.string().min(3)
});

export const CreateRoomSchema = z.object({
    name: z.string()
});

export const SigninSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(3)
})

